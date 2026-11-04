import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { EgyptPhoneInput, isValidEgyptPhoneInput } from "@/components/academy/EgyptPhoneInput";
import { PasswordInput } from "@/components/academy/PasswordInput";
import { useAuth, type LoginResult } from "@/lib/auth-context";

const LOGIN_ERROR_MESSAGES: Partial<Record<LoginResult, string>> = {
  invalid: "رقم الموبايل أو كلمة السر غير صحيحة.",
  admin_account: "هذا حساب أدمن. استخدم صفحة دخول الأدمن.",
  suspended: "الحساب موقوف. تواصل مع الإدارة.",
  error: "تعذر الاتصال بالسيرفر. حاول مرة تانية.",
};

export function LoginModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { login } = useAuth();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function close() {
    onClose();
    setPhone("");
    setPassword("");
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!isValidEgyptPhoneInput(phone)) {
      setError("رقم الموبايل غير صحيح. اكتب 10 أرقام بعد كود مصر +20.");
      return;
    }
    setSubmitting(true);
    const result = await login(phone, password);
    setSubmitting(false);
    if (result === "ok") {
      close();
    } else {
      setError(LOGIN_ERROR_MESSAGES[result] ?? "حصل خطأ، حاول تاني.");
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
          className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 shadow-2xl"
          >
            <h2 className="text-xl font-bold mb-1" style={{ fontFamily: "var(--font-display)" }}>
              تسجيل الدخول للأكاديمية
            </h2>
            <p className="text-sm text-[var(--color-muted)] mb-4">
              سجّل دخولك برقم الموبايل وكلمة السر
            </p>
            <form onSubmit={handleSubmit} noValidate className="space-y-3">
              <div>
                <EgyptPhoneInput value={phone} onChange={(value) => { setPhone(value); setError(""); }} invalid={Boolean(error) && !isValidEgyptPhoneInput(phone)} autoFocus className="h-11 rounded-lg" inputBackgroundClassName="bg-[var(--color-bg)]" />
                <p className="mt-1 text-xs text-[var(--color-muted)]">رقم الموبايل بدون الصفر الأول</p>
              </div>
              <PasswordInput value={password} onChange={setPassword} autoComplete="current-password" className="h-11 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-4 text-[var(--color-fg)]" />
              {error && <div role="alert" className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700"><AlertCircle className="mt-0.5 shrink-0" size={17} /><span>{error}</span></div>}
              <button
                type="submit"
                disabled={submitting}
                className="w-full h-11 rounded-lg bg-[var(--color-primary)] text-white font-bold hover:opacity-90 transition-opacity"
              >
                {submitting ? "جاري الدخول..." : "دخول"}
              </button>
            </form>
            <p className="text-sm text-[var(--color-muted)] mt-4 text-center">
              لسه معملتش طلب اشتراك؟{" "}
              <Link
                to="/academy/subscribe"
                onClick={close}
                className="text-[var(--color-primary)] font-bold hover:underline"
              >
                سجّل هنا
              </Link>
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
