import { Navigate } from "react-router-dom";
import { AcademyHeader } from "@/components/academy/AcademyHeader";
import { ProfileForm } from "@/components/account/ProfileForm";
import { getStudentToken } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

export default function StudentProfile() {
  const { user, loading, refreshProfile } = useAuth();
  const token = getStudentToken();

  if (loading) return <div className="grid min-h-screen place-items-center">جاري تحميل حسابك...</div>;
  if (!user || !token) return <Navigate to="/subscribe" replace />;
  if (user.role !== "student") return <Navigate to="/admin" replace />;

  return (
    <div className="min-h-screen bg-[var(--color-bg)]" dir="rtl">
      <AcademyHeader />
      <main className="mx-auto max-w-5xl px-5 py-10 md:px-8 md:py-14">
        <div className="mb-8"><p className="text-sm font-bold text-[var(--color-primary)]">حساب الطالب</p><h1 className="mt-1 text-3xl font-black">تعديل الملف الشخصي</h1><p className="mt-2 text-[var(--color-muted)]">حدّث بياناتك أو غيّر كلمة السر بأمان.</p></div>
        <ProfileForm token={token} user={user} onUpdated={() => void refreshProfile()} />
      </main>
    </div>
  );
}
