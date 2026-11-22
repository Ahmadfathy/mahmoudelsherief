import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Camera, ShieldCheck, CheckCircle2, AlertCircle, AlertTriangle } from "lucide-react";
import { PasswordInput } from "@/components/academy/PasswordInput";
import { config } from "@/lib/config";
import { apiRequest, friendlyApiError } from "@/lib/api";

// Backend contract for POST /auth/reset-password is documented in ForgotPassword.tsx.

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token") ?? "";
  const email = searchParams.get("email") ?? "";

  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const tokenInvalid = !token || !email;

  // After success, redirect to /subscribe after 3 seconds
  useEffect(() => {
    if (!success) return;
    const timer = setTimeout(() => navigate("/subscribe", { replace: true }), 3000);
    return () => clearTimeout(timer);
  }, [success, navigate]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    if (password.length < 8) {
      setError("كلمة السر يجب ألا تقل عن 8 حروف أو أرقام.");
      return;
    }
    if (password !== passwordConfirmation) {
      setError("كلمتا السر غير متطابقتين.");
      return;
    }
    setSubmitting(true);
    try {
      await apiRequest("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({
          email,
          token,
          password,
          password_confirmation: passwordConfirmation,
        }),
      });
      setSuccess(true);
    } catch (requestError) {
      setError(friendlyApiError(requestError));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)]" dir="rtl">
      <header className="border-b border-[var(--color-border)] bg-[var(--color-bg)]/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-5">
          <Link to="/subscribe" className="flex items-center gap-2 text-sm font-bold text-[var(--color-muted)] transition-colors hover:text-[var(--color-fg)]">
            <ArrowRight size={17} />
            تسجيل الدخول
          </Link>
          <Link to="/" className="flex items-center gap-2 font-bold">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-[var(--color-primary)] text-white">
              <Camera size={16} />
            </span>
            {config.brandName}
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-5 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 md:p-10"
        >
          {tokenInvalid ? (
            // Invalid / missing token
            <div className="text-center">
              <div className="mx-auto mb-6 grid place-items-center w-16 h-16 rounded-full bg-red-50 text-red-600">
                <AlertTriangle size={28} strokeWidth={1.75} />
              </div>
              <h1 className="text-2xl md:text-3xl font-black mb-3" style={{ fontFamily: "var(--font-display)" }}>
                اللينك غير صالح
              </h1>
              <p className="text-[var(--color-muted)] leading-relaxed mb-8">
                اللينك اللي استخدمته مفيهوش بيانات كافية. يمكن يكون انتهت صلاحيته أو اتبعت بشكل خاطئ.
              </p>
              <Link to="/forgot-password" className="inline-flex items-center justify-center gap-2 h-12 px-8 rounded-full bg-[var(--color-primary)] text-white font-bold transition-opacity hover:opacity-90">
                اطلب لينك جديد
              </Link>
            </div>
          ) : success ? (
            // Success state
            <div className="text-center">
              <div className="mx-auto mb-6 grid place-items-center w-16 h-16 rounded-full bg-green-50 text-green-600">
                <CheckCircle2 size={28} strokeWidth={1.75} />
              </div>
              <h1 className="text-2xl md:text-3xl font-black mb-3" style={{ fontFamily: "var(--font-display)" }}>
                تم تغيير كلمة السر بنجاح
              </h1>
              <p className="text-[var(--color-muted)] leading-relaxed mb-8">
                هنوجّهك لصفحة تسجيل الدخول خلال ثواني...
              </p>
              <Link to="/subscribe" replace className="inline-flex items-center justify-center gap-2 h-12 px-8 rounded-full bg-[var(--color-primary)] text-white font-bold transition-opacity hover:opacity-90">
                الدخول دلوقتي
              </Link>
            </div>
          ) : (
            // Reset password form
            <>
              <div className="mx-auto mb-6 grid place-items-center w-16 h-16 rounded-full bg-[var(--color-secondary)]/10 text-[var(--color-secondary)]">
                <ShieldCheck size={28} strokeWidth={1.75} />
              </div>

              <h1 className="text-2xl md:text-3xl font-black mb-2 text-center" style={{ fontFamily: "var(--font-display)" }}>
                اختار كلمة سر جديدة
              </h1>
              <p className="text-sm text-[var(--color-muted)] mb-6 text-center" dir="ltr">
                {email}
              </p>

              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-bold">كلمة السر الجديدة</label>
                  <PasswordInput
                    value={password}
                    onChange={(value) => { setPassword(value); setError(""); }}
                    autoComplete="new-password"
                    minLength={8}
                    invalid={Boolean(error) && password.length < 8}
                    className="h-12 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4"
                  />
                  <p className="mt-1 text-xs text-[var(--color-muted)]">8 حروف أو أرقام على الأقل</p>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-bold">تأكيد كلمة السر</label>
                  <PasswordInput
                    value={passwordConfirmation}
                    onChange={(value) => { setPasswordConfirmation(value); setError(""); }}
                    autoComplete="new-password"
                    minLength={8}
                    invalid={Boolean(error) && password !== passwordConfirmation}
                    className="h-12 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4"
                  />
                </div>

                {error && (
                  <div role="alert" className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
                    <AlertCircle className="mt-0.5 shrink-0" size={17} />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-12 rounded-full bg-[var(--color-primary)] text-white font-bold transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-wait"
                >
                  {submitting ? "جاري التحديث..." : "تعيين كلمة السر"}
                </button>
              </form>
            </>
          )}
        </motion.div>
      </main>
    </div>
  );
}
