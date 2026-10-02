import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { apiRequest, friendlyApiError, getAdminToken } from "@/lib/api";

type SubscriptionStatus = "pending" | "approved" | "rejected";

type Subscription = {
  id: number;
  status: SubscriptionStatus;
  notes?: string | null;
  starts_at?: string | null;
  expires_at?: string | null;
  user: { id: number; name: string; email: string; phone?: string | null };
  course: { id: number; title: string; slug: string };
};

const STATUS_LABEL: Record<SubscriptionStatus, string> = {
  pending: "قيد المراجعة",
  approved: "مفعّل",
  rejected: "مرفوض",
};

const STATUS_STYLE: Record<SubscriptionStatus, string> = {
  pending: "bg-[var(--color-secondary)]/20 text-[var(--color-secondary-warm)]",
  approved: "bg-green-500/15 text-green-500",
  rejected: "bg-red-500/15 text-red-500",
};

export function SubscribersPanel() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [filter, setFilter] = useState<SubscriptionStatus | "all">("pending");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const loadSubscriptions = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const query = filter === "all" ? "" : `?status=${filter}`;
      const response = await apiRequest<{ data: Subscription[] }>(`/admin/subscriptions${query}`, {
        token: getAdminToken(),
      });
      setSubscriptions(response.data);
    } catch (requestError) {
      setError(friendlyApiError(requestError));
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    void loadSubscriptions();
  }, [loadSubscriptions]);

  async function updateStatus(subscription: Subscription, action: "approve" | "reject") {
    setBusyId(subscription.id);
    setError("");
    try {
      const body = action === "approve"
        ? { notes: "تم التفعيل من لوحة التحكم" }
        : { notes: "تم رفض طلب الاشتراك من لوحة التحكم" };
      await apiRequest(`/admin/subscriptions/${subscription.id}/${action}`, {
        method: "PATCH",
        token: getAdminToken(),
        body: JSON.stringify(body),
      });
      await loadSubscriptions();
    } catch (requestError) {
      setError(friendlyApiError(requestError));
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-5">
        {(["pending", "approved", "rejected", "all"] as const).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setFilter(item)}
            className={`h-9 px-4 rounded-full text-sm font-bold transition-colors ${
              filter === item
                ? "bg-[var(--color-primary)] text-white"
                : "bg-[var(--color-subtle)] hover:bg-[var(--color-border)]"
            }`}
          >
            {item === "all" ? "الكل" : STATUS_LABEL[item]}
          </button>
        ))}
      </div>

      {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
      {loading ? (
        <p className="text-[var(--color-muted)] text-sm">جاري تحميل طلبات الاشتراك...</p>
      ) : subscriptions.length === 0 ? (
        <p className="text-[var(--color-muted)] text-sm">مفيش طلبات هنا.</p>
      ) : (
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                <th className="text-start font-bold px-4 py-3">الاسم</th>
                <th className="text-start font-bold px-4 py-3">الإيميل</th>
                <th className="text-start font-bold px-4 py-3">الموبايل</th>
                <th className="text-start font-bold px-4 py-3">الكورس</th>
                <th className="text-start font-bold px-4 py-3">الحالة</th>
                <th className="text-start font-bold px-4 py-3">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.map((subscription) => (
                <tr key={subscription.id} className="border-b border-[var(--color-border)] last:border-0">
                  <td className="px-4 py-3 font-bold whitespace-nowrap">{subscription.user.name}</td>
                  <td className="px-4 py-3 text-[var(--color-muted)]">{subscription.user.email}</td>
                  <td className="px-4 py-3 text-[var(--color-muted)]">{subscription.user.phone || "—"}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{subscription.course.title}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${STATUS_STYLE[subscription.status]}`}>
                      {STATUS_LABEL[subscription.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5 whitespace-nowrap">
                      {subscription.status !== "approved" && (
                        <button
                          type="button"
                          disabled={busyId === subscription.id}
                          onClick={() => void updateStatus(subscription, "approve")}
                          className="inline-flex items-center gap-1 h-8 px-3 rounded-full bg-green-500/10 text-green-500 text-xs font-bold"
                        >
                          <CheckCircle2 size={13} /> تفعيل
                        </button>
                      )}
                      {subscription.status !== "rejected" && (
                        <button
                          type="button"
                          disabled={busyId === subscription.id}
                          onClick={() => void updateStatus(subscription, "reject")}
                          className="inline-flex items-center gap-1 h-8 px-3 rounded-full bg-red-500/10 text-red-500 text-xs font-bold"
                        >
                          <XCircle size={13} /> رفض
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
