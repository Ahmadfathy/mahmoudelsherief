import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, Download, XCircle } from "lucide-react";
import { apiDownload, apiRequest, friendlyApiError, getAdminToken } from "@/lib/api";

type PaymentStatus = "pending" | "verified" | "rejected";
type Payment = {
  id: number;
  method: "vodafone_cash" | "instapay";
  amount: string;
  currency: string;
  sender_phone?: string | null;
  transaction_reference?: string | null;
  receipt_path?: string | null;
  status: PaymentStatus;
  user: { name: string; email: string; phone?: string | null };
  course: { title: string; slug: string };
};

const labels: Record<PaymentStatus, string> = {
  pending: "قيد المراجعة",
  verified: "تم التأكيد",
  rejected: "مرفوض",
};

export function PaymentsPanel() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filter, setFilter] = useState<PaymentStatus | "all">("pending");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const query = filter === "all" ? "" : `?status=${filter}`;
      const response = await apiRequest<{ data: Payment[] }>(`/admin/payments${query}`, {
        token: getAdminToken(),
      });
      setPayments(response.data);
    } catch (requestError) {
      setError(friendlyApiError(requestError));
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => { void load(); }, [load]);

  async function review(payment: Payment, action: "verify" | "reject") {
    try {
      await apiRequest(`/admin/payments/${payment.id}/${action}`, {
        method: "PATCH",
        token: getAdminToken(),
        body: JSON.stringify(action === "reject"
          ? { admin_notes: "تم رفض الإيصال من لوحة التحكم" }
          : { admin_notes: "تم تأكيد الدفع من لوحة التحكم" }),
      });
      await load();
    } catch (requestError) {
      setError(friendlyApiError(requestError));
    }
  }

  async function downloadReceipt(payment: Payment) {
    const token = getAdminToken();
    if (!token) return;
    try {
      const blob = await apiDownload(`/admin/payments/${payment.id}/receipt`, token);
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `payment-${payment.id}`;
      anchor.click();
      URL.revokeObjectURL(url);
    } catch (requestError) {
      setError(friendlyApiError(requestError));
    }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-5">
        {(["pending", "verified", "rejected", "all"] as const).map((item) => (
          <button key={item} onClick={() => setFilter(item)} className={`h-9 px-4 rounded-full text-sm font-bold ${filter === item ? "bg-[var(--color-primary)] text-white" : "bg-[var(--color-subtle)]"}`}>
            {item === "all" ? "الكل" : labels[item]}
          </button>
        ))}
      </div>
      {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
      {loading ? <p>جاري التحميل...</p> : payments.length === 0 ? <p className="text-[var(--color-muted)]">لا توجد مدفوعات.</p> : (
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-[var(--color-border)]">
              <th className="text-start p-3">الطالب</th><th className="text-start p-3">الكورس</th><th className="text-start p-3">المبلغ</th><th className="text-start p-3">الطريقة</th><th className="text-start p-3">الحالة</th><th className="text-start p-3">الإجراءات</th>
            </tr></thead>
            <tbody>{payments.map((payment) => (
              <tr key={payment.id} className="border-b border-[var(--color-border)] last:border-0">
                <td className="p-3"><p className="font-bold">{payment.user.name}</p><p className="text-xs text-[var(--color-muted)]">{payment.user.email}</p></td>
                <td className="p-3">{payment.course.title}</td>
                <td className="p-3 whitespace-nowrap">{Number(payment.amount).toLocaleString("ar-EG")} {payment.currency}</td>
                <td className="p-3">{payment.method === "instapay" ? "InstaPay" : "Vodafone Cash"}</td>
                <td className="p-3">{labels[payment.status]}</td>
                <td className="p-3"><div className="flex gap-1 whitespace-nowrap">
                  {payment.receipt_path && <button onClick={() => void downloadReceipt(payment)} className="p-2 rounded-full bg-[var(--color-subtle)]" title="تحميل الإيصال"><Download size={14} /></button>}
                  {payment.status !== "verified" && <button onClick={() => void review(payment, "verify")} className="inline-flex items-center gap-1 px-3 rounded-full bg-green-500/10 text-green-500 font-bold"><CheckCircle2 size={13}/> تأكيد</button>}
                  {payment.status !== "rejected" && <button onClick={() => void review(payment, "reject")} className="inline-flex items-center gap-1 px-3 rounded-full bg-red-500/10 text-red-500 font-bold"><XCircle size={13}/> رفض</button>}
                </div></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}

