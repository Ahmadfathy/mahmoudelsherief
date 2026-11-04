import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertCircle, ArrowRight, Camera, LogIn, UserPlus } from "lucide-react";
import { EgyptPhoneInput, isValidEgyptPhoneInput } from "@/components/academy/EgyptPhoneInput";
import { PasswordInput } from "@/components/academy/PasswordInput";
import { config } from "@/lib/config";
import { useAuth, type LoginResult } from "@/lib/auth-context";
import { ApiError, friendlyApiError } from "@/lib/api";

type Tab = "register" | "login";
type RegisterField = "name" | "email" | "phone" | "password";

const LOGIN_ERROR_MESSAGES: Partial<Record<LoginResult, string>> = {
  invalid: "رقم الموبايل أو كلمة السر غير صحيحة.",
  admin_account: "هذا حساب أدمن. استخدم صفحة دخول الأدمن.",
  suspended: "الحساب موقوف. تواصل مع الإدارة.",
  error: "تعذر الاتصال بالسيرفر. حاول مرة ثانية.",
};

export default function SubscriptionEntry() {
  const navigate = useNavigate();
  const { user, login, register } = useAuth();
  const [tab, setTab] = useState<Tab>("register");
  const [loginPhone, setLoginPhone] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPhone, setRegisterPhone] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [error, setError] = useState("");
  const [errorField, setErrorField] = useState<RegisterField | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleRegister(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setErrorField(null);

    const showValidationError = (field: RegisterField, message: string) => {
      setErrorField(field);
      setError(message);
    };

    if (!registerName.trim()) return showValidationError("name", "من فضلك اكتب الاسم.");
    if (!/^\S+@\S+\.\S+$/.test(registerEmail.trim())) return showValidationError("email", "من فضلك اكتب بريدًا إلكترونيًا صحيحًا.");
    if (!isValidEgyptPhoneInput(registerPhone)) return showValidationError("phone", "رقم الموبايل غير صحيح. اكتب 10 أرقام بعد كود مصر +20.");
    if (registerPassword.length < 8) return showValidationError("password", "كلمة السر يجب ألا تقل عن 8 حروف أو أرقام.");

    setSubmitting(true);
    try {
      await register({ name: registerName.trim(), email: registerEmail.trim(), phone: registerPhone, password: registerPassword });
      navigate("/dashboard", { replace: true });
    } catch (requestError) {
      setError(friendlyApiError(requestError));
      if (requestError instanceof ApiError) {
        const field = Object.keys(requestError.errors ?? {})[0];
        if (["name", "email", "phone", "password"].includes(field)) setErrorField(field as RegisterField);
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    if (!isValidEgyptPhoneInput(loginPhone)) {
      setError("رقم الموبايل غير صحيح. اكتب 10 أرقام بعد كود مصر +20.");
      return;
    }
    setSubmitting(true);
    const result = await login(loginPhone, loginPassword);
    setSubmitting(false);

    if (result === "ok") {
      navigate("/dashboard");
      return;
    }

    setError(LOGIN_ERROR_MESSAGES[result] ?? "حصل خطأ، حاول مرة ثانية.");
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)]" dir="rtl">
      <header className="border-b border-[var(--color-border)] bg-[var(--color-bg)]/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-5">
          <Link to="/" className="flex items-center gap-2 text-sm font-bold text-[var(--color-muted)] transition-colors hover:text-[var(--color-fg)]">
            <ArrowRight size={17} />
            الرجوع
          </Link>
          <Link to="/" className="flex items-center gap-2 font-bold">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-[var(--color-primary)] text-white">
              <Camera size={16} />
            </span>
            {config.brandName}
          </Link>
        </div>
      </header>

      <main className="mx-auto flex max-w-lg flex-col px-5 py-12 md:py-20">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 shadow-sm md:p-8">
          <div className="mb-7 text-center">
            <h1 className="mb-2 text-3xl font-black" style={{ fontFamily: "var(--font-display)" }}>ابدأ اشتراكك</h1>
            <p className="text-sm text-[var(--color-muted)]">أنشئ حسابًا جديدًا أو سجّل الدخول لو عندك حساب بالفعل</p>
          </div>

          <div className="mb-7 grid grid-cols-2 rounded-xl bg-[var(--color-subtle)] p-1" role="tablist" aria-label="نوع الاشتراك">
            <button
              type="button"
              role="tab"
              aria-selected={tab === "register"}
              onClick={() => { setTab("register"); setError(""); setErrorField(null); }}
              className={`flex h-11 items-center justify-center gap-2 rounded-lg text-sm font-bold transition-all ${tab === "register" ? "bg-[var(--color-card)] text-[var(--color-primary)] shadow-sm" : "text-[var(--color-muted)]"}`}
            >
              <UserPlus size={17} />
              اشتراك جديد
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab === "login"}
              onClick={() => { setTab("login"); setError(""); setErrorField(null); }}
              className={`flex h-11 items-center justify-center gap-2 rounded-lg text-sm font-bold transition-all ${tab === "login" ? "bg-[var(--color-card)] text-[var(--color-primary)] shadow-sm" : "text-[var(--color-muted)]"}`}
            >
              <LogIn size={17} />
              تسجيل دخول
            </button>
          </div>

          {user ? (
            <div className="text-center">
              <p className="mb-5 font-bold">أنت مسجل بالفعل باسم {user.name}</p>
              <Link to="/dashboard" className="flex h-12 w-full items-center justify-center rounded-full bg-[var(--color-primary)] font-bold text-white transition-opacity hover:opacity-90">
                دخول لوحة حسابي
              </Link>
            </div>
          ) : tab === "register" ? (
            <form onSubmit={handleRegister} noValidate className="space-y-4">
              <div><label className="mb-1.5 block text-sm font-bold">الاسم</label><input type="text" value={registerName} onChange={(event) => { setRegisterName(event.target.value); if (errorField === "name") { setError(""); setErrorField(null); } }} autoComplete="name" aria-invalid={errorField === "name"} className={`h-12 w-full rounded-xl border bg-[var(--color-bg)] px-4 transition-colors focus-visible:outline-none focus-visible:ring-2 ${errorField === "name" ? "border-red-400 focus-visible:ring-red-200" : "border-[var(--color-border)] focus-visible:ring-[var(--color-primary)]"}`} /></div>
              <div><label className="mb-1.5 block text-sm font-bold">الإيميل</label><input type="email" value={registerEmail} onChange={(event) => { setRegisterEmail(event.target.value); if (errorField === "email") { setError(""); setErrorField(null); } }} autoComplete="email" aria-invalid={errorField === "email"} className={`h-12 w-full rounded-xl border bg-[var(--color-bg)] px-4 transition-colors focus-visible:outline-none focus-visible:ring-2 ${errorField === "email" ? "border-red-400 focus-visible:ring-red-200" : "border-[var(--color-border)] focus-visible:ring-[var(--color-primary)]"}`} /></div>
              <div><label className="mb-1.5 block text-sm font-bold">رقم الموبايل</label><EgyptPhoneInput value={registerPhone} onChange={(value) => { setRegisterPhone(value); if (errorField === "phone") { setError(""); setErrorField(null); } }} invalid={errorField === "phone"} inputBackgroundClassName="bg-[var(--color-bg)]" /><p className="mt-1 text-xs text-[var(--color-muted)]">اكتب الرقم بدون الصفر الأول</p></div>
              <div><label className="mb-1.5 block text-sm font-bold">كلمة السر</label><PasswordInput value={registerPassword} onChange={(value) => { setRegisterPassword(value); if (errorField === "password") { setError(""); setErrorField(null); } }} autoComplete="new-password" minLength={8} invalid={errorField === "password"} className={`h-12 w-full rounded-xl border bg-[var(--color-bg)] px-4 transition-colors ${errorField === "password" ? "border-red-400 focus-visible:ring-red-200" : "border-[var(--color-border)]"}`} /><p className="mt-1 text-xs text-[var(--color-muted)]">8 حروف أو أرقام على الأقل</p></div>
              {error && <div role="alert" className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700"><AlertCircle className="mt-0.5 shrink-0" size={17} /><span>{error}</span></div>}
              <button type="submit" disabled={submitting} className="h-12 w-full rounded-full bg-[var(--color-primary)] font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50">{submitting ? "جاري إنشاء الحساب..." : "إنشاء الحساب"}</button>
            </form>
          ) : (
            <form onSubmit={handleLogin} noValidate className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-bold">رقم الموبايل</label>
                <EgyptPhoneInput value={loginPhone} onChange={(value) => { setLoginPhone(value); setError(""); }} invalid={Boolean(error) && !isValidEgyptPhoneInput(loginPhone)} inputBackgroundClassName="bg-[var(--color-bg)]" />
                <p className="mt-1 text-xs text-[var(--color-muted)]">اكتب الرقم بدون الصفر الأول</p>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-bold">كلمة السر</label>
                <PasswordInput value={loginPassword} onChange={setLoginPassword} autoComplete="current-password" className="h-12 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4" />
              </div>
              {error && <div role="alert" className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700"><AlertCircle className="mt-0.5 shrink-0" size={17} /><span>{error}</span></div>}
              <button type="submit" disabled={submitting} className="h-12 w-full rounded-full bg-[var(--color-primary)] font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50">
                {submitting ? "جاري تسجيل الدخول..." : "تسجيل الدخول والمتابعة"}
              </button>
            </form>
          )}
        </motion.div>
      </main>
    </div>
  );
}
