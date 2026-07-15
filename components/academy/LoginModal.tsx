import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth, type LoginResult } from "@/lib/auth-context";

const LOGIN_ERROR_MESSAGES: Partial<Record<LoginResult, string>> = {
  "not-found": "مفيش حساب بالإيميل ده. سجّل طلب اشتراك الأول.",
  "wrong-password": "كلمة السر غلط.",
  pending: "طلبك لسه قيد المراجعة من الأدمن.",
  rejected: "طلبك اتراجع. تواصل معانا لمزيد من التفاصيل.",
};

export function LoginModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function close() {
    onClose();
    setEmail("");
    setPassword("");
    setError("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = login(email, password);
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
              سجّل دخولك بالإيميل وكلمة السر اللي اتفعّلوا بعد موافقة الأدمن
            </p>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="الإيميل"
                autoFocus
                required
                className="w-full h-11 px-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="كلمة السر"
                required
                className="w-full h-11 px-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
              />
              {error && <p className="text-sm text-red-500">{error}</p>}
              <button
                type="submit"
                className="w-full h-11 rounded-lg bg-[var(--color-primary)] text-white font-bold hover:opacity-90 transition-opacity"
              >
                دخول
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
