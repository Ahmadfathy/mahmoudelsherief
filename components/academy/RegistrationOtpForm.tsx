import { useState } from "react";
import { AlertCircle, MailCheck, RotateCw } from "lucide-react";
import { friendlyApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

type RegistrationOtpFormProps = {
  email: string;
  initialMessage?: string;
  courseId?: string;
  onVerified: () => void;
  onBack: () => void;
};

export function RegistrationOtpForm({ email, initialMessage, courseId, onVerified, onBack }: RegistrationOtpFormProps) {
  const { verifyRegistration, resendRegistrationOtp } = useAuth();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState(initialMessage ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    if (!/^\d{5}$/.test(otp)) {
      setError("اكتب كود التحقق المكوّن من 5 أرقام.");
      return;
    }
    setSubmitting(true);
    try {
      await verifyRegistration(email, otp, courseId);
      onVerified();
    } catch (requestError) {
      setError(friendlyApiError(requestError, "تعذر التحقق من الكود."));
    } finally {
      setSubmitting(false);
    }
  }

  async function resend() {
    setError("");
    setMessage("");
    setResending(true);
    try {
      setMessage(await resendRegistrationOtp(email));
    } catch (requestError) {
      setError(friendlyApiError(requestError, "تعذر إعادة إرسال الكود."));
    } finally {
      setResending(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5 text-center">
      <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)]"><MailCheck size={30} /></span>
      <div><h2 className="text-2xl font-black">تأكيد البريد الإلكتروني</h2><p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">أدخل الكود المرسل إلى</p><p className="font-bold" dir="ltr">{email}</p></div>
      {message && <p className="rounded-xl bg-green-500/10 px-4 py-3 text-sm text-green-700">{message}</p>}
      <input
        value={otp}
        onChange={(event) => { setOtp(event.target.value.replace(/\D/g, "").slice(0, 5)); setError(""); }}
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={5}
        autoFocus
        aria-label="كود التحقق"
        dir="ltr"
        className="h-16 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] text-center text-3xl font-black tracking-[0.6em] outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
        placeholder="00000"
      />
      {error && <div role="alert" className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-right text-sm text-red-700"><AlertCircle className="mt-0.5 shrink-0" size={17} /><span>{error}</span></div>}
      <button type="submit" disabled={submitting} className="h-12 w-full rounded-full bg-[var(--color-primary)] font-bold text-white disabled:opacity-50">{submitting ? "جاري التحقق..." : "تأكيد وإنشاء الحساب"}</button>
      <div className="flex items-center justify-between text-sm">
        <button type="button" onClick={onBack} className="text-[var(--color-muted)] hover:underline">تعديل البيانات</button>
        <button type="button" onClick={() => void resend()} disabled={resending} className="inline-flex items-center gap-1.5 font-bold text-[var(--color-primary)] disabled:opacity-50"><RotateCw size={14} />{resending ? "جاري الإرسال..." : "إعادة إرسال الكود"}</button>
      </div>
    </form>
  );
}
