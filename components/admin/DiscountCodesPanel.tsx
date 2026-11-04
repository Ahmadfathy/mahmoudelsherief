import { useCallback, useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { apiRequest, friendlyApiError, getAdminToken } from "@/lib/api";
import { useCourses } from "@/lib/courses-store";

type DiscountCode = {
  id: number;
  code: string;
  type: "percentage" | "fixed";
  value: string;
  course_id?: number | null;
  min_amount?: string | null;
  max_discount?: string | null;
  starts_at?: string | null;
  ends_at?: string | null;
  usage_limit?: number | null;
  per_user_limit: number;
  is_active: boolean;
  usages_count: number;
  course?: { id: number; title: string } | null;
};

const emptyForm = {
  code: "", type: "percentage" as const, value: "", courseId: "", minAmount: "", maxDiscount: "",
  startsAt: "", endsAt: "", usageLimit: "", perUserLimit: "1", isActive: true,
};

function dateInput(value?: string | null) {
  return value ? new Date(value).toISOString().slice(0, 16) : "";
}

export function DiscountCodesPanel() {
  const { courses, loadAdminCourses } = useCourses();
  const [codes, setCodes] = useState<DiscountCode[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiRequest<{ data: DiscountCode[] }>("/admin/discount-codes", { token: getAdminToken() });
      setCodes(response.data);
    } catch (requestError) {
      setError(friendlyApiError(requestError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); void loadAdminCourses(); }, [load]);

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setError("");
  }

  function edit(code: DiscountCode) {
    setEditingId(code.id);
    setForm({
      code: code.code, type: code.type, value: code.value, courseId: code.course_id ? String(code.course_id) : "",
      minAmount: code.min_amount ?? "", maxDiscount: code.max_discount ?? "", startsAt: dateInput(code.starts_at),
      endsAt: dateInput(code.ends_at), usageLimit: code.usage_limit ? String(code.usage_limit) : "",
      perUserLimit: String(code.per_user_limit), isActive: code.is_active,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = {
        code: form.code,
        type: form.type,
        value: Number(form.value),
        course_id: form.courseId ? Number(form.courseId) : null,
        min_amount: form.minAmount ? Number(form.minAmount) : null,
        max_discount: form.type === "percentage" && form.maxDiscount ? Number(form.maxDiscount) : null,
        starts_at: form.startsAt || null,
        ends_at: form.endsAt || null,
        usage_limit: form.usageLimit ? Number(form.usageLimit) : null,
        per_user_limit: Number(form.perUserLimit) || 1,
        is_active: form.isActive,
      };
      await apiRequest(editingId ? `/admin/discount-codes/${editingId}` : "/admin/discount-codes", {
        method: editingId ? "PATCH" : "POST", token: getAdminToken(), body: JSON.stringify(payload),
      });
      resetForm();
      await load();
    } catch (requestError) {
      setError(friendlyApiError(requestError));
    } finally {
      setSaving(false);
    }
  }

  async function remove(code: DiscountCode) {
    if (!confirm(`حذف كود ${code.code}؟`)) return;
    try {
      await apiRequest(`/admin/discount-codes/${code.id}`, { method: "DELETE", token: getAdminToken() });
      await load();
    } catch (requestError) {
      setError(friendlyApiError(requestError));
    }
  }

  return (
    <div className="space-y-7">
      <form onSubmit={submit} className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-5">
        <div className="mb-4 flex items-center justify-between"><h1 className="text-xl font-black">{editingId ? "تعديل كود الخصم" : "إضافة كود خصم"}</h1>{editingId && <button type="button" onClick={resetForm} className="text-sm text-[var(--color-muted)]">إلغاء التعديل</button>}</div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <label className="space-y-1.5 text-sm font-bold"><span className="block">كود الخصم</span><input required value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="مثال: WELCOME20" className="h-11 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 font-normal uppercase" dir="ltr" /></label>
          <label className="space-y-1.5 text-sm font-bold"><span className="block">نوع الخصم</span><select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as "percentage" | "fixed" })} className="h-11 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 font-normal"><option value="percentage">نسبة مئوية</option><option value="fixed">مبلغ ثابت</option></select></label>
          <label className="space-y-1.5 text-sm font-bold"><span className="block">{form.type === "percentage" ? "نسبة الخصم" : "قيمة الخصم"}</span><input required type="number" min="0.01" step="0.01" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} placeholder={form.type === "percentage" ? "مثال: 20" : "مثال: 100"} className="h-11 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 font-normal" /></label>
          <label className="space-y-1.5 text-sm font-bold"><span className="block">الكورس المطبق عليه</span><select value={form.courseId} onChange={(e) => setForm({ ...form, courseId: e.target.value })} className="h-11 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 font-normal"><option value="">كل الكورسات</option>{courses.map((course) => <option key={course.id} value={course.id}>{course.title}</option>)}</select></label>
          <label className="space-y-1.5 text-sm font-bold"><span className="block">الحد الأدنى لسعر الكورس</span><input type="number" min="0" step="0.01" value={form.minAmount} onChange={(e) => setForm({ ...form, minAmount: e.target.value })} placeholder="اختياري" className="h-11 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 font-normal" /></label>
          <label className="space-y-1.5 text-sm font-bold"><span className="block">أقصى قيمة للخصم</span><input type="number" min="0" step="0.01" disabled={form.type !== "percentage"} value={form.maxDiscount} onChange={(e) => setForm({ ...form, maxDiscount: e.target.value })} placeholder={form.type === "percentage" ? "اختياري" : "متاح مع النسبة المئوية فقط"} className="h-11 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 font-normal disabled:cursor-not-allowed disabled:opacity-40" /></label>
          <label className="space-y-1.5 text-sm font-bold"><span className="block">تاريخ بداية الكود</span><input type="datetime-local" value={form.startsAt} onChange={(e) => setForm({ ...form, startsAt: e.target.value })} className="h-11 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 font-normal text-[var(--color-fg)]" /></label>
          <label className="space-y-1.5 text-sm font-bold"><span className="block">تاريخ انتهاء الكود</span><input type="datetime-local" value={form.endsAt} onChange={(e) => setForm({ ...form, endsAt: e.target.value })} className="h-11 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 font-normal text-[var(--color-fg)]" /></label>
          <label className="space-y-1.5 text-sm font-bold"><span className="block">إجمالي مرات الاستخدام</span><input type="number" min="1" value={form.usageLimit} onChange={(e) => setForm({ ...form, usageLimit: e.target.value })} placeholder="اتركه فارغًا بدون حد" className="h-11 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 font-normal" /></label>
          <label className="space-y-1.5 text-sm font-bold"><span className="block">مرات الاستخدام لكل طالب</span><input required type="number" min="1" value={form.perUserLimit} onChange={(e) => setForm({ ...form, perUserLimit: e.target.value })} placeholder="مثال: 1" className="h-11 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 font-normal" /></label>
          <label className="space-y-1.5 text-sm font-bold"><span className="block">حالة الكود</span><span className="flex h-11 items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 font-normal"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="h-4 w-4 accent-[var(--color-primary)]" />الكود مفعّل</span></label>
        </div>
        {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
        <button disabled={saving} className="mt-4 inline-flex h-11 items-center gap-2 rounded-full bg-[var(--color-primary)] px-6 font-bold text-white disabled:opacity-50"><Plus size={17} />{saving ? "جاري الحفظ..." : editingId ? "حفظ التعديلات" : "إضافة الكود"}</button>
      </form>

      {loading ? <p>جاري تحميل الأكواد...</p> : codes.length === 0 ? <p className="text-[var(--color-muted)]">لا توجد أكواد خصم.</p> : (
        <div className="overflow-x-auto rounded-xl border border-[var(--color-border)] bg-[var(--color-card)]"><table className="w-full text-sm"><thead><tr className="border-b border-[var(--color-border)]"><th className="p-3 text-start">الكود</th><th className="p-3 text-start">الخصم</th><th className="p-3 text-start">الكورس</th><th className="p-3 text-start">الاستخدام</th><th className="p-3 text-start">الحالة</th><th className="p-3 text-start">الإجراءات</th></tr></thead><tbody>{codes.map((code) => <tr key={code.id} className="border-b border-[var(--color-border)] last:border-0"><td className="p-3 font-black" dir="ltr">{code.code}</td><td className="p-3">{code.type === "percentage" ? `${Number(code.value)}%` : `${Number(code.value).toLocaleString("ar-EG")} ج.م`}</td><td className="p-3">{code.course?.title ?? "كل الكورسات"}</td><td className="p-3">{code.usages_count}{code.usage_limit ? ` / ${code.usage_limit}` : ""}</td><td className="p-3"><span className={code.is_active ? "text-green-600" : "text-red-500"}>{code.is_active ? "مفعّل" : "موقوف"}</span></td><td className="p-3"><div className="flex gap-2"><button onClick={() => edit(code)} className="grid h-8 w-8 place-items-center rounded-full bg-[var(--color-subtle)]"><Pencil size={14} /></button><button onClick={() => void remove(code)} className="grid h-8 w-8 place-items-center rounded-full bg-red-500/10 text-red-500"><Trash2 size={14} /></button></div></td></tr>)}</tbody></table></div>
      )}
    </div>
  );
}
