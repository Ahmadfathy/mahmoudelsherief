import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertCircle, ArrowRight, Camera, CheckCircle2, KeyRound, Mail } from "lucide-react";
import { PasswordInput } from "@/components/academy/PasswordInput";
import { config } from "@/lib/config";
import { apiRequest, friendlyApiError } from "@/lib/api";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [step, setStep] = useState<"email" | "reset" | "success">("email");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function requestCode(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return setError("من فضلك اكتب بريدًا إلكترونيًا صحيحًا.");
    setSubmitting(true);
    try {
      const response = await apiRequest<{ message: string }>("/auth/forgot-password", { method: "POST", body: JSON.stringify({ email: email.trim() }) });
      setEmail(email.trim().toLowerCase());
      setMessage(response.message);
      setStep("reset");
    } catch (requestError) {
      setError(friendlyApiError(requestError, "تعذر إرسال الكود."));
    } finally {
      setSubmitting(false);
    }
  }

  async function resetPassword(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    if (!/^\d{5}$/.test(otp)) return setError("اكتب كود التحقق المكوّن من 5 أرقام.");
    if (password.length < 8) return setError("كلمة السر يجب ألا تقل عن 8 حروف أو أرقام.");
    if (password !== passwordConfirmation) return setError("تأكيد كلمة السر غير مطابق.");
    setSubmitting(true);
    try {
      await apiRequest("/auth/reset-password", { method: "POST", body: JSON.stringify({ email, otp, password, password_confirmation: passwordConfirmation }) });
      setStep("success");
    } catch (requestError) {
      setError(friendlyApiError(requestError, "تعذر تغيير كلمة السر."));
    } finally {
      setSubmitting(false);
    }
  }

  async function resendCode() {
    setError("");
    setSubmitting(true);
    try {
      const response = await apiRequest<{ message: string }>("/auth/forgot-password", { method: "POST", body: JSON.stringify({ email }) });
      setMessage(response.message);
    } catch (requestError) {
      setError(friendlyApiError(requestError, "تعذر إعادة إرسال الكود."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)]" dir="rtl">
      <header className="border-b border-[var(--color-border)] bg-[var(--color-bg)]/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-5">
          <Link to="/subscribe" className="flex items-center gap-2 text-sm font-bold text-[var(--color-muted)] hover:text-[var(--color-fg)]"><ArrowRight size={17} />الرجوع لتسجيل الدخول</Link>
          <Link to="/" className="flex items-center gap-2 font-bold"><span className="grid h-8 w-8 place-items-center rounded-full bg-[var(--color-primary)] text-white"><Camera size={16} /></span>{config.brandName}</Link>
        </div>
      </header>
      <main className="mx-auto max-w-lg px-5 py-16 md:py-24">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 md:p-10">
          {step === "success" ? (
            <div className="text-center">
              <span className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full bg-green-500/10 text-green-600"><CheckCircle2 size={30} /></span>
              <h1 className="text-2xl font-black">تم تغيير كلمة السر</h1>
              <p className="mb-7 mt-3 text-[var(--color-muted)]">تقدر دلوقتي تسجّل الدخول بكلمة السر الجديدة.</p>
              <button onClick={() => navigate("/subscribe", { replace: true })} className="h-12 w-full rounded-full bg-[var(--color-primary)] font-bold text-white">تسجيل الدخول</button>
            </div>
          ) : step === "email" ? (
            <>
              <span className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)]"><KeyRound size={29} /></span>
              <h1 className="text-center text-3xl font-black">استعادة كلمة المرور</h1>
              <p className="mb-7 mt-3 text-center text-[var(--color-muted)]">اكتب بريدك الإلكتروني وهنبعتلك كود من 5 أرقام.</p>
              <form onSubmit={requestCode} className="space-y-4">
                <label className="block"><span className="mb-1.5 block text-sm font-bold">البريد الإلكتروني</span><div className="relative"><Mail size={18} className="absolute start-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" /><input type="email" value={email} onChange={(event) => { setEmail(event.target.value); setError(""); }} autoComplete="email" autoFocus dir="ltr" className="h-12 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] ps-11 pe-4 text-left outline-none focus:ring-2 focus:ring-[var(--color-primary)]" placeholder="you@example.com" /></div></label>
                {error && <ErrorMessage text={error} />}
                <button type="submit" disabled={submitting} className="h-12 w-full rounded-full bg-[var(--color-primary)] font-bold text-white disabled:opacity-50">{submitting ? "جاري الإرسال..." : "إرسال كود الاستعادة"}</button>
              </form>
            </>
          ) : (
            <>
              <h1 className="text-center text-3xl font-black">اكتب الكود وكلمة السر الجديدة</h1>
              <p className="mt-2 text-center text-sm text-[var(--color-muted)]" dir="ltr">{email}</p>
              {message && <p className="my-5 rounded-xl bg-green-500/10 px-4 py-3 text-center text-sm text-green-700">{message}</p>}
              <form onSubmit={resetPassword} className="mt-6 space-y-4">
                <label className="block"><span className="mb-1.5 block text-sm font-bold">كود التحقق</span><input value={otp} onChange={(event) => { setOtp(event.target.value.replace(/\D/g, "").slice(0, 5)); setError(""); }} inputMode="numeric" autoComplete="one-time-code" maxLength={5} autoFocus dir="ltr" className="h-16 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] text-center text-3xl font-black tracking-[0.6em] outline-none focus:ring-2 focus:ring-[var(--color-primary)]" placeholder="00000" /></label>
                <label className="block"><span className="mb-1.5 block text-sm font-bold">كلمة السر الجديدة</span><PasswordInput value={password} onChange={(value) => { setPassword(value); setError(""); }} autoComplete="new-password" minLength={8} /></label>
                <label className="block"><span className="mb-1.5 block text-sm font-bold">تأكيد كلمة السر</span><PasswordInput value={passwordConfirmation} onChange={(value) => { setPasswordConfirmation(value); setError(""); }} autoComplete="new-password" minLength={8} /></label>
                {error && <ErrorMessage text={error} />}
                <button type="submit" disabled={submitting} className="h-12 w-full rounded-full bg-[var(--color-primary)] font-bold text-white disabled:opacity-50">{submitting ? "جاري التغيير..." : "تعيين كلمة السر الجديدة"}</button>
              </form>
              <div className="mt-5 flex justify-between text-sm"><button type="button" onClick={() => { setStep("email"); setOtp(""); setError(""); }} className="text-[var(--color-muted)] hover:underline">تغيير الإيميل</button><button type="button" onClick={() => void resendCode()} disabled={submitting} className="font-bold text-[var(--color-primary)] hover:underline">إعادة إرسال الكود</button></div>
            </>
          )}
        </motion.div>
      </main>
    </div>
  );
}

function ErrorMessage({ text }: { text: string }) {
  return <div role="alert" className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700"><AlertCircle className="mt-0.5 shrink-0" size={17} /><span>{text}</span></div>;
}
