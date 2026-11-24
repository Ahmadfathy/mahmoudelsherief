import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, Plus, Search, UserRound, X, XCircle } from "lucide-react";
import { apiRequest, friendlyApiError, getAdminToken } from "@/lib/api";
import { DEFAULT_COUNTRY, PhoneInput, phoneForSubmit } from "@/components/academy/PhoneInput";
import { PasswordInput } from "@/components/academy/PasswordInput";

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

function SubscriptionRequestsPanel() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [filter, setFilter] = useState<SubscriptionStatus | "all">("all");
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
        {(["all", "pending", "approved", "rejected"] as const).map((item) => (
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

type StudentUser = {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  status: "active" | "suspended";
  subscriptions_count: number;
  payments_count: number;
  created_at: string;
};

type CourseOption = { id: number; title: string };

function AddSubscriberModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => Promise<void> }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState(DEFAULT_COUNTRY);
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [status, setStatus] = useState<"active" | "suspended">("active");
  const [courseId, setCourseId] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    apiRequest<{ data: CourseOption[] }>("/admin/courses", { token: getAdminToken() })
      .then((response) => setCourses(response.data))
      .catch((requestError) => setError(friendlyApiError(requestError, "تعذر تحميل الكورسات.")));
  }, []);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    if (password !== passwordConfirmation) {
      setError("تأكيد كلمة السر غير مطابق.");
      return;
    }
    setSubmitting(true);
    try {
      await apiRequest("/admin/users", {
        method: "POST",
        token: getAdminToken(),
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phoneForSubmit(phone, country),
          password,
          password_confirmation: passwordConfirmation,
          status,
          course_id: courseId ? Number(courseId) : null,
          starts_at: courseId && startsAt ? startsAt : null,
          expires_at: courseId && expiresAt ? expiresAt : null,
        }),
      });
      await onCreated();
      onClose();
    } catch (requestError) {
      setError(friendlyApiError(requestError, "تعذر إضافة المشترك."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center overflow-y-auto bg-black/50 p-4" role="dialog" aria-modal="true" aria-labelledby="add-subscriber-title" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <form onSubmit={submit} className="my-6 w-full max-w-2xl rounded-3xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 shadow-2xl md:p-8">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div><h2 id="add-subscriber-title" className="text-2xl font-black">إضافة مشترك جديد</h2><p className="mt-1 text-sm text-[var(--color-muted)]">الحساب سيكون مفعّلًا بدون الحاجة إلى OTP.</p></div>
          <button type="button" onClick={onClose} aria-label="إغلاق" className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[var(--color-subtle)]"><X size={18} /></button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block"><span className="mb-1.5 block text-sm font-bold">اسم المشترك</span><input value={name} onChange={(event) => setName(event.target.value)} required autoComplete="name" className="h-12 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 outline-none focus:ring-2 focus:ring-[var(--color-primary)]" /></label>
          <label className="block"><span className="mb-1.5 block text-sm font-bold">البريد الإلكتروني</span><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" dir="ltr" className="h-12 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 text-left outline-none focus:ring-2 focus:ring-[var(--color-primary)]" /></label>
          <label className="block md:col-span-2"><span className="mb-1.5 block text-sm font-bold">رقم الموبايل</span><PhoneInput value={phone} onChange={setPhone} country={country} onCountryChange={setCountry} inputBackgroundClassName="bg-[var(--color-bg)]" /></label>
          <label className="block"><span className="mb-1.5 block text-sm font-bold">كلمة السر</span><PasswordInput value={password} onChange={setPassword} autoComplete="new-password" minLength={8} /></label>
          <label className="block"><span className="mb-1.5 block text-sm font-bold">تأكيد كلمة السر</span><PasswordInput value={passwordConfirmation} onChange={setPasswordConfirmation} autoComplete="new-password" minLength={8} placeholder="أعد كتابة كلمة السر" /></label>
          <label className="block"><span className="mb-1.5 block text-sm font-bold">حالة الحساب</span><select value={status} onChange={(event) => setStatus(event.target.value as "active" | "suspended")} className="h-12 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4"><option value="active">نشط</option><option value="suspended">موقوف</option></select></label>
          <label className="block"><span className="mb-1.5 block text-sm font-bold">تفعيل كورس (اختياري)</span><select value={courseId} onChange={(event) => setCourseId(event.target.value)} className="h-12 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4"><option value="">بدون كورس</option>{courses.map((course) => <option key={course.id} value={course.id}>{course.title}</option>)}</select></label>
          {courseId && <>
            <label className="block"><span className="mb-1.5 block text-sm font-bold">بداية الاشتراك (اختياري)</span><input type="datetime-local" value={startsAt} onChange={(event) => setStartsAt(event.target.value)} className="h-12 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4" /></label>
            <label className="block"><span className="mb-1.5 block text-sm font-bold">نهاية الاشتراك (اختياري)</span><input type="datetime-local" value={expiresAt} onChange={(event) => setExpiresAt(event.target.value)} className="h-12 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4" /></label>
          </>}
        </div>

        {error && <p role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
        <div className="mt-6 flex justify-end gap-3"><button type="button" onClick={onClose} className="h-11 rounded-full border border-[var(--color-border)] px-6 font-bold">إلغاء</button><button type="submit" disabled={submitting} className="h-11 rounded-full bg-[var(--color-primary)] px-7 font-bold text-white disabled:opacity-50">{submitting ? "جاري الإضافة..." : "إضافة المشترك"}</button></div>
      </form>
    </div>
  );
}

function RegisteredUsersPanel() {
  const [users, setUsers] = useState<StudentUser[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [addingSubscriber, setAddingSubscriber] = useState(false);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ role: "student" });
      if (search.trim()) params.set("search", search.trim());
      const response = await apiRequest<{ data: StudentUser[] }>(`/admin/users?${params}`, {
        token: getAdminToken(),
      });
      setUsers(response.data);
    } catch (requestError) {
      setError(friendlyApiError(requestError));
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const timer = window.setTimeout(() => void loadUsers(), 250);
    return () => window.clearTimeout(timer);
  }, [loadUsers]);

  async function toggleStatus(user: StudentUser) {
    setBusyId(user.id);
    setError("");
    try {
      await apiRequest(`/admin/users/${user.id}`, {
        method: "PATCH",
        token: getAdminToken(),
        body: JSON.stringify({ status: user.status === "active" ? "suspended" : "active" }),
      });
      await loadUsers();
    } catch (requestError) {
      setError(friendlyApiError(requestError));
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-full max-w-md flex-1">
          <Search size={17} className="pointer-events-none absolute end-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="ابحث بالاسم أو الإيميل" className="h-11 w-full rounded-full border border-[var(--color-border)] bg-[var(--color-card)] px-4 pe-11 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]" />
        </div>
        <button type="button" onClick={() => setAddingSubscriber(true)} className="inline-flex h-11 items-center gap-2 rounded-full bg-[var(--color-primary)] px-5 font-bold text-white"><Plus size={18} />إضافة مشترك</button>
      </div>
      {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
      {loading ? (
        <p className="text-sm text-[var(--color-muted)]">جاري تحميل الحسابات المسجّلة...</p>
      ) : users.length === 0 ? (
        <p className="text-sm text-[var(--color-muted)]">لا توجد حسابات مسجّلة.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[var(--color-border)] bg-[var(--color-card)]">
          <table className="w-full border-collapse text-sm">
            <thead><tr className="border-b border-[var(--color-border)]"><th className="px-4 py-3 text-start">الطالب</th><th className="px-4 py-3 text-start">الموبايل</th><th className="px-4 py-3 text-start">الاشتراكات</th><th className="px-4 py-3 text-start">تاريخ التسجيل</th><th className="px-4 py-3 text-start">الحالة</th><th className="px-4 py-3 text-start">الإجراء</th></tr></thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-[var(--color-border)] last:border-0">
                  <td className="px-4 py-3"><div className="flex items-center gap-2"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)]"><UserRound size={17} /></span><span><strong className="block">{user.name}</strong><small className="text-[var(--color-muted)]">{user.email}</small></span></div></td>
                  <td className="px-4 py-3" dir="ltr">{user.phone || "—"}</td>
                  <td className="px-4 py-3">{user.subscriptions_count}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-[var(--color-muted)]">{new Date(user.created_at).toLocaleDateString("ar-EG")}</td>
                  <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${user.status === "active" ? "bg-green-500/15 text-green-600" : "bg-red-500/15 text-red-500"}`}>{user.status === "active" ? "نشط" : "موقوف"}</span></td>
                  <td className="px-4 py-3"><button type="button" disabled={busyId === user.id} onClick={() => void toggleStatus(user)} className={`h-8 whitespace-nowrap rounded-full px-3 text-xs font-bold disabled:opacity-50 ${user.status === "active" ? "bg-red-500/10 text-red-500" : "bg-green-500/10 text-green-600"}`}>{user.status === "active" ? "إيقاف الحساب" : "تفعيل الحساب"}</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {addingSubscriber && <AddSubscriberModal onClose={() => setAddingSubscriber(false)} onCreated={loadUsers} />}
    </div>
  );
}

export function SubscribersPanel() {
  const [view, setView] = useState<"users" | "subscriptions">("users");

  return (
    <div>
      <div className="mb-6 flex gap-2 border-b border-[var(--color-border)] pb-4">
        <button type="button" onClick={() => setView("users")} className={`h-10 rounded-full px-5 text-sm font-bold ${view === "users" ? "bg-[var(--color-primary)] text-white" : "bg-[var(--color-subtle)]"}`}>الحسابات المسجّلة</button>
        <button type="button" onClick={() => setView("subscriptions")} className={`h-10 rounded-full px-5 text-sm font-bold ${view === "subscriptions" ? "bg-[var(--color-primary)] text-white" : "bg-[var(--color-subtle)]"}`}>طلبات الاشتراك</button>
      </div>
      {view === "users" ? <RegisteredUsersPanel /> : <SubscriptionRequestsPanel />}
    </div>
  );
}
