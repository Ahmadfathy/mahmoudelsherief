import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, CheckCircle2, Lock, PlayCircle } from "lucide-react";
import { AcademyHeader } from "@/components/academy/AcademyHeader";
import { useAuth } from "@/lib/auth-context";
import { useCourses } from "@/lib/courses-store";
import { apiRequest, getStudentToken } from "@/lib/api";

type SubscriptionStatus = "pending" | "approved" | "rejected";
type StudentSubscription = {
  id: number;
  status: SubscriptionStatus;
  course: { id: number; slug: string };
};

export default function StudentDashboard() {
  const { user, loading: authLoading, hasAccess, refreshAccess } = useAuth();
  const { courses, loading, error } = useCourses();
  const [subscriptionStatuses, setSubscriptionStatuses] = useState<Record<string, SubscriptionStatus>>({});

  useEffect(() => {
    const token = getStudentToken();
    if (!user || !token) return;
    apiRequest<{ subscriptions: StudentSubscription[] }>("/subscriptions", { token })
      .then((response) => {
        const statuses = Object.fromEntries(
          response.subscriptions.map((subscription) => [String(subscription.course.id), subscription.status])
        );
        setSubscriptionStatuses(statuses);
        if (response.subscriptions.some((subscription) => subscription.status === "approved")) {
          void refreshAccess();
        }
      })
      .catch(() => setSubscriptionStatuses({}));
  }, [user?.id]);

  if (authLoading) return <div className="min-h-screen grid place-items-center">جاري تحميل حسابك...</div>;
  if (!user) return <Navigate to="/subscribe" replace />;

  return (
    <div className="min-h-screen bg-[var(--color-bg)]" dir="rtl">
      <AcademyHeader />
      <main className="mx-auto max-w-7xl px-5 py-10 md:px-8 md:py-14">
        <div className="mb-10 rounded-3xl bg-[var(--color-primary)] p-6 text-white md:p-9">
          <p className="mb-2 text-sm text-white/75">لوحة الطالب</p>
          <h1 className="text-3xl font-black md:text-4xl" style={{ fontFamily: "var(--font-display)" }}>أهلًا، {user.name}</h1>
          <p className="mt-2 text-white/80">اختار الكورس المناسب واشترك فيه، أو كمّل كورساتك المفعّلة.</p>
        </div>
        <div className="mb-6"><h2 className="text-2xl font-black">الكورسات المتاحة</h2><p className="text-sm text-[var(--color-muted)]">كل كورسات الأكاديمية في مكان واحد</p></div>
        {loading && <p className="text-[var(--color-muted)]">جاري تحميل الكورسات...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && courses.length === 0 && <p className="text-[var(--color-muted)]">لا توجد كورسات منشورة حاليًا.</p>}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course, index) => {
            const subscriptionStatus = subscriptionStatuses[course.id];
            const active = !course.requiresSubscription || hasAccess(course.slug) || subscriptionStatus === "approved";
            const pending = subscriptionStatus === "pending";
            const rejected = subscriptionStatus === "rejected";
            return (
              <motion.article key={course.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)]">
                <div className="relative grid aspect-video place-items-center overflow-hidden bg-[var(--color-subtle)]">
                  {course.coverImageUrl ? <img src={course.coverImageUrl} alt={course.title} className="h-full w-full object-cover" /> : <BookOpen size={42} className="text-[var(--color-muted)]" />}
                  <span className={`absolute end-3 top-3 flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${active ? "bg-green-500 text-white" : pending ? "bg-amber-500 text-white" : rejected ? "bg-red-500 text-white" : "bg-black/70 text-white"}`}>{active ? <CheckCircle2 size={13} /> : <Lock size={13} />}{active ? "مفعّل" : pending ? "قيد المراجعة" : rejected ? "مرفوض" : "غير مشترك"}</span>
                </div>
                <div className="p-5">
                  <h3 className="mb-1 text-lg font-black">{course.title}</h3>
                  <p className="mb-4 line-clamp-2 min-h-10 text-sm text-[var(--color-muted)]">{course.subtitle}</p>
                  <div className="mb-4 flex items-center justify-between border-t border-[var(--color-border)] pt-4 text-sm"><span className="text-[var(--color-muted)]">سعر الكورس</span><span className={`font-black ${(course.price ?? 0) <= 0 ? "text-green-600" : ""}`}>{(course.price ?? 0) <= 0 ? "مجاني" : `${(course.price ?? 0).toLocaleString("ar-EG")} ${course.currency === "EGP" ? "ج.م" : course.currency}`}</span></div>
                  {pending ? (
                    <div className="flex h-11 w-full cursor-not-allowed items-center justify-center gap-2 rounded-full bg-amber-500/15 font-bold text-amber-600">
                      <CheckCircle2 size={18} />
                      طلبك قيد المراجعة
                    </div>
                  ) : (
                    <Link to={active ? `/academy/${course.slug}` : `/payment?course=${course.id}`} className={`flex h-11 w-full items-center justify-center gap-2 rounded-full font-bold text-white transition-opacity hover:opacity-90 ${active ? "bg-green-600" : "bg-[var(--color-primary)]"}`}>{active ? <PlayCircle size={18} /> : <Lock size={17} />}{active ? "دخول الكورس" : rejected ? "إعادة إرسال الطلب" : "اشترك في الكورس"}</Link>
                  )}
                </div>
              </motion.article>
            );
          })}
        </div>
      </main>
    </div>
  );
}
