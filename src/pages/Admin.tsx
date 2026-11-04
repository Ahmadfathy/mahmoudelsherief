import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { Shield } from "lucide-react";
import { useAdminSession } from "@/lib/admin-auth";
import { friendlyApiError } from "@/lib/api";
import { EgyptPhoneInput, isValidEgyptPhoneInput } from "@/components/academy/EgyptPhoneInput";
import { PasswordInput } from "@/components/academy/PasswordInput";

export default function Admin() {
  const { isAdmin, login } = useAdminSession();
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (isAdmin) return <Navigate to="/admin/subscribers" replace />;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!isValidEgyptPhoneInput(phone)) {
      setError("رقم الموبايل غير صحيح. اكتب 10 أرقام بعد كود مصر +20.");
      return;
    }
    setSubmitting(true);
    try {
      await login(phone, password);
      navigate("/admin/subscribers");
    } catch (requestError) {
      setError(friendlyApiError(requestError, "بيانات الدخول غير صحيحة."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] grid place-items-center px-5" dir="rtl">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="w-full max-w-sm bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 shadow-xl"
      >
        <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[var(--color-primary)]/10 grid place-items-center">
          <Shield size={24} className="text-[var(--color-primary)]" strokeWidth={1.75} />
        </div>
        <h1
          className="text-xl font-bold text-center mb-5"
          style={{ fontFamily: "var(--font-display)" }}
        >
          دخول الأدمن
        </h1>
        <div className="space-y-3">
          <EgyptPhoneInput value={phone} onChange={(value) => { setPhone(value); setError(""); }} invalid={Boolean(error) && !isValidEgyptPhoneInput(phone)} autoFocus className="h-11 rounded-lg" inputBackgroundClassName="bg-[var(--color-bg)]" />
          <PasswordInput value={password} onChange={setPassword} autoComplete="current-password" className="h-11 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-4 text-[var(--color-fg)]" />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="w-full h-11 rounded-lg bg-[var(--color-primary)] text-white font-bold hover:opacity-90 transition-opacity"
          >
            {submitting ? "جاري الدخول..." : "دخول"}
          </button>
        </div>
      </form>
    </div>
  );
}
