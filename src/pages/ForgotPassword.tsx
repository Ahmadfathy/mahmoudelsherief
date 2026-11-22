import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Camera, KeyRound, Mail, CheckCircle2, AlertCircle } from "lucide-react";
import { config } from "@/lib/config";
import { apiRequest, friendlyApiError } from "@/lib/api";

/**
 * Password reset flow — standard Laravel pattern.
 *
 * REQUIRED BACKEND ENDPOINTS (to be implemented in Laravel):
 *
 * 1) POST /api/v1/auth/forgot-password
 *    Body: { email: string }
 *    Success (200): { message: string }
 *    Errors:
 *      - 422: { message, errors: { email: [...] } }  (invalid email, not found)
 *      - 429: too many requests (rate limit)
 *    Behavior: sends an email to the user with a reset link of the form:
 *      ${APP_URL}/reset-password?token=${TOKEN}&email=${EMAIL}
 *    The token is a hashed value in the password_resets table with an expiry (typically 60 min).
 *
 * 2) POST /api/v1/auth/reset-password
 *    Body: { email: string, token: string, password: string, password_confirmation: string }
 *    Success (200): { message: string }
 *    Errors:
 *      - 422: { message, errors: { email|token|password: [...] } }  (expired, invalid, mismatch)
 *      - 400: { message } (token invalid)
 *    Behavior: validates the token, updates the user's password, invalidates the token.
 *
 * Laravel ships `Illuminate\Auth\Passwords\PasswordBroker` which handles all of this —
 * controllers can just forward to `Password::sendResetLink(...)` and `Password::reset(...)`.
 */

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError("من فضلك اكتب إيميل صحيح.");
      return;
    }
    setSubmitting(true);
    try {
      await apiRequest("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email: email.trim() }),
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
            الرجوع لتسجيل الدخول
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
          <div className="mx-auto mb-6 grid place-items-center w-16 h-16 rounded-full bg-[var(--color-secondary)]/10 text-[var(--color-secondary)]">
            {success ? <CheckCircle2 size={28} strokeWidth={1.75} /> : <KeyRound size={28} strokeWidth={1.75} />}
          </div>

          {success ? (
            <div className="text-center">
              <h1 className="text-2xl md:text-3xl font-black mb-3" style={{ fontFamily: "var(--font-display)" }}>
                تمام، بعتنالك اللينك
              </h1>
              <p className="text-[var(--color-muted)] leading-relaxed mb-2">
                لو الإيميل مسجّل عندنا، هتلاقي لينك استرجاع كلمة السر في صندوق الوارد خلال دقائق.
              </p>
              <p className="text-sm text-[var(--color-muted)] mb-8">
                لو مش لاقيه، افحص فولدر <span className="font-bold">الـ Spam</span>.
              </p>
              <Link to="/subscribe" className="inline-flex items-center justify-center gap-2 h-12 px-8 rounded-full bg-[var(--color-primary)] text-white font-bold transition-opacity hover:opacity-90">
                الرجوع لتسجيل الدخول
              </Link>
              <div className="mt-6 pt-6 border-t border-dashed border-[var(--color-border)]">
                <button
                  type="button"
                  onClick={() => { setSuccess(false); setEmail(""); }}
                  className="text-sm text-[var(--color-muted)] hover:text-[var(--color-fg)] transition-colors"
                >
                  استخدم إيميل تاني؟
                </button>
              </div>
            </div>
          ) : (
            <>
              <h1 className="text-2xl md:text-3xl font-black mb-3 text-center" style={{ fontFamily: "var(--font-display)" }}>
                نسيت كلمة السر؟
              </h1>
              <p className="text-[var(--color-muted)] leading-relaxed mb-8 text-center">
                اكتب إيميلك المسجّل وهنبعتلك لينك لتعيين كلمة سر جديدة.
              </p>

              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <div>
                  <label htmlFor="forgot-email" className="mb-1.5 block text-sm font-bold">الإيميل</label>
                  <div className="relative">
                    <Mail size={18} className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" strokeWidth={1.75} />
                    <input
                      id="forgot-email"
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(""); }}
                      autoComplete="email"
                      autoFocus
                      dir="ltr"
                      placeholder="you@example.com"
                      aria-invalid={Boolean(error)}
                      className={`h-12 w-full rounded-xl border bg-[var(--color-bg)] ps-11 pe-4 transition-colors focus-visible:outline-none focus-visible:ring-2 ${
                        error ? "border-red-400 focus-visible:ring-red-200" : "border-[var(--color-border)] focus-visible:ring-[var(--color-primary)]"
                      }`}
                    />
                  </div>
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
                  {submitting ? "جاري الإرسال..." : "ابعت لينك الاسترجاع"}
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-dashed border-[var(--color-border)] text-center">
                <p className="text-sm text-[var(--color-muted)]">
                  افتكرت كلمة السر؟{" "}
                  <Link to="/subscribe" className="text-[var(--color-primary)] font-bold hover:underline">
                    رجوع لتسجيل الدخول
                  </Link>
                </p>
              </div>
            </>
          )}
        </motion.div>
      </main>
    </div>
  );
}
