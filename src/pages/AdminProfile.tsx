import { useEffect, useState } from "react";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { ProfileForm, type ProfileUser } from "@/components/account/ProfileForm";
import { apiRequest, friendlyApiError, getAdminToken } from "@/lib/api";

function AdminProfileContent() {
  const token = getAdminToken();
  const [user, setUser] = useState<ProfileUser | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    apiRequest<{ user: ProfileUser }>("/me", { token })
      .then((response) => setUser(response.user))
      .catch((requestError) => setError(friendlyApiError(requestError, "تعذر تحميل بيانات الحساب.")));
  }, [token]);

  if (error) return <p className="rounded-xl bg-red-500/10 p-4 text-red-600">{error}</p>;
  if (!token || !user) return <p className="text-[var(--color-muted)]">جاري تحميل بيانات الحساب...</p>;

  return (
    <>
      <div className="mb-8"><p className="text-sm font-bold text-[var(--color-primary)]">حساب الأدمن</p><h1 className="mt-1 text-3xl font-black">تعديل الملف الشخصي</h1><p className="mt-2 text-[var(--color-muted)]">عدّل بيانات الدخول الخاصة بك بدون التأثير على صلاحيات الأدمن.</p></div>
      <ProfileForm token={token} user={user} onUpdated={setUser} />
    </>
  );
}

export default function AdminProfile() {
  return <AdminGuard><AdminProfileContent /></AdminGuard>;
}
