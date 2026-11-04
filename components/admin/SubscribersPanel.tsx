import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, Search, UserRound, XCircle } from "lucide-react";
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

function RegisteredUsersPanel() {
  const [users, setUsers] = useState<StudentUser[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState("");

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
      <div className="relative mb-5 max-w-md">
        <Search size={17} className="pointer-events-none absolute end-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="ابحث بالاسم أو الإيميل" className="h-11 w-full rounded-full border border-[var(--color-border)] bg-[var(--color-card)] px-4 pe-11 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]" />
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
