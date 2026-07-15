import { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { AcademyHeader } from "@/components/academy/AcademyHeader";
import { useCourses } from "@/lib/courses-store";
import { registerSubscriber } from "@/lib/subscribers-store";

export default function Subscribe() {
  const { courses } = useCourses();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [courseSlug, setCourseSlug] = useState(courses[0]?.slug ?? "");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const result = registerSubscriber({
      name,
      email,
      phone,
      password,
      interestedCourseSlug: courseSlug || undefined,
    });

    if (!result.ok) {
      setError("فيه حساب مسجل بالإيميل ده قبل كده.");
      return;
    }
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)]" dir="rtl">
      <AcademyHeader />

      <main className="max-w-lg mx-auto px-5 md:px-8 py-10 md:py-14">
        <Link
          to="/academy"
          className="inline-block text-sm text-[var(--color-muted)] hover:text-[var(--color-fg)] transition-colors mb-6"
        >
          ← رجوع للأكاديمية
        </Link>

        {submitted ? (
          <div className="text-center py-16 px-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)]">
            <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-green-500/10 grid place-items-center">
              <CheckCircle2 size={28} className="text-green-500" strokeWidth={1.75} />
            </div>
            <h1 className="text-xl font-bold mb-2" style={{ fontFamily: "var(--font-display)" }}>
              تم استلام طلبك
            </h1>
            <p className="text-[var(--color-muted)]">
              هنراجع طلبك ونفعّل الكورس بعد التأكد من الدفع، وهتقدر تدخل بنفس الإيميل وكلمة السر.
            </p>
          </div>
        ) : (
          <>
            <h1
              className="text-2xl font-bold mb-1"
              style={{ fontFamily: "var(--font-display)" }}
            >
              طلب اشتراك في الأكاديمية
            </h1>
            <p className="text-[var(--color-muted)] mb-6">
              سجّل بياناتك وهنفعّلك الكورس بعد ما نتأكد من الاشتراك
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1.5">الاسم</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full h-11 px-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-1.5">الإيميل</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full h-11 px-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-1.5">رقم الموبايل (اختياري)</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-11 px-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-1.5">كلمة السر</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full h-11 px-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
                />
                <p className="text-xs text-[var(--color-muted)] mt-1">
                  هتستخدمها عشان تدخل الكورس بعد ما يتفعّل
                </p>
              </div>

              {courses.length > 0 && (
                <div>
                  <label className="block text-sm font-bold mb-1.5">الكورس اللي عايز تشترك فيه</label>
                  <select
                    value={courseSlug}
                    onChange={(e) => setCourseSlug(e.target.value)}
                    className="w-full h-11 px-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
                  >
                    {courses.map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {error && <p className="text-sm text-red-500">{error}</p>}

              <button
                type="submit"
                className="w-full h-12 rounded-full bg-[var(--color-primary)] text-white font-bold hover:opacity-90 transition-opacity"
              >
                إرسال الطلب
              </button>
            </form>
          </>
        )}
      </main>
    </div>
  );
}
