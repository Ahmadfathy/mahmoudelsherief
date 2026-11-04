import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { AcademyHeader } from "@/components/academy/AcademyHeader";
import { EgyptPhoneInput, isValidEgyptPhoneInput } from "@/components/academy/EgyptPhoneInput";
import { PasswordInput } from "@/components/academy/PasswordInput";
import { useAuth } from "@/lib/auth-context";
import { AlertCircle } from "lucide-react";
import { ApiError, friendlyApiError } from "@/lib/api";

type RegisterField = "name" | "email" | "phone" | "password";

export default function Subscribe() {
  const navigate = useNavigate();
  const { user, loading, register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [errorField, setErrorField] = useState<RegisterField | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!loading && user) return <Navigate to="/dashboard" replace />;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setErrorField(null);

    const showValidationError = (field: RegisterField, message: string) => {
      setErrorField(field);
      setError(message);
    };

    if (!name.trim()) {
      showValidationError("name", "من فضلك اكتب الاسم.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      showValidationError("email", "من فضلك اكتب بريدًا إلكترونيًا صحيحًا.");
      return;
    }
    if (!isValidEgyptPhoneInput(phone)) {
      showValidationError("phone", "رقم الموبايل غير صحيح. اكتب 10 أرقام بعد كود مصر +20.");
      return;
    }
    if (password.length < 8) {
      showValidationError("password", "كلمة السر يجب ألا تقل عن 8 حروف أو أرقام.");
      return;
    }

    setSubmitting(true);
    try {
      await register({ name, email, phone, password });
      navigate("/dashboard", { replace: true });
    } catch (requestError) {
      setError(friendlyApiError(requestError));
      if (requestError instanceof ApiError) {
        const field = Object.keys(requestError.errors ?? {})[0];
        if (["name", "email", "phone", "password"].includes(field)) {
          setErrorField(field as RegisterField);
        }
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)]" dir="rtl">
      <AcademyHeader />
      <main className="mx-auto max-w-lg px-5 py-10 md:py-14">
        <Link to="/subscribe" className="mb-6 inline-block text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-fg)]">← رجوع</Link>
        <h1 className="mb-1 text-3xl font-black" style={{ fontFamily: "var(--font-display)" }}>إنشاء حساب جديد</h1>
        <p className="mb-7 text-[var(--color-muted)]">سجّل بياناتك، وبعدها اختار الكورس المناسب من لوحة حسابك.</p>
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div><label className="mb-1.5 block text-sm font-bold">الاسم</label><input type="text" value={name} onChange={(event) => { setName(event.target.value); if (errorField === "name") { setError(""); setErrorField(null); } }} required autoComplete="name" aria-invalid={errorField === "name"} className={`h-12 w-full rounded-xl border bg-[var(--color-card)] px-4 transition-colors focus-visible:outline-none focus-visible:ring-2 ${errorField === "name" ? "border-red-400 bg-red-50/40 focus-visible:ring-red-200" : "border-[var(--color-border)] focus-visible:ring-[var(--color-primary)]"}`} /></div>
          <div><label className="mb-1.5 block text-sm font-bold">الإيميل</label><input type="email" value={email} onChange={(event) => { setEmail(event.target.value); if (errorField === "email") { setError(""); setErrorField(null); } }} required autoComplete="email" aria-invalid={errorField === "email"} className={`h-12 w-full rounded-xl border bg-[var(--color-card)] px-4 transition-colors focus-visible:outline-none focus-visible:ring-2 ${errorField === "email" ? "border-red-400 bg-red-50/40 focus-visible:ring-red-200" : "border-[var(--color-border)] focus-visible:ring-[var(--color-primary)]"}`} /></div>
          <div><label className="mb-1.5 block text-sm font-bold">رقم الموبايل</label><EgyptPhoneInput value={phone} onChange={(value) => { setPhone(value); if (errorField === "phone") { setError(""); setErrorField(null); } }} invalid={errorField === "phone"} /><p className="mt-1 text-xs text-[var(--color-muted)]">اكتب الرقم بدون الصفر الأول</p></div>
          <div><label className="mb-1.5 block text-sm font-bold">كلمة السر</label><PasswordInput value={password} onChange={(value) => { setPassword(value); if (errorField === "password") { setError(""); setErrorField(null); } }} autoComplete="new-password" minLength={8} invalid={errorField === "password"} className={`h-12 w-full rounded-xl border bg-[var(--color-card)] px-4 transition-colors ${errorField === "password" ? "border-red-400 bg-red-50/40 focus-visible:ring-red-200" : "border-[var(--color-border)]"}`} /><p className="mt-1 text-xs text-[var(--color-muted)]">8 حروف أو أرقام على الأقل</p></div>
          {error && (
            <div role="alert" className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 shadow-sm">
              <AlertCircle className="mt-0.5 shrink-0" size={19} />
              <div>
                <p className="text-sm font-bold">راجع البيانات التالية</p>
                <p className="mt-0.5 text-sm leading-6">{error}</p>
              </div>
            </div>
          )}
          <button type="submit" disabled={submitting} className="h-12 w-full rounded-full bg-[var(--color-primary)] font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50">{submitting ? "جاري إنشاء الحساب..." : "إنشاء الحساب"}</button>
        </form>
      </main>
    </div>
  );
}
