import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { Shield } from "lucide-react";
import { useAdminSession } from "@/lib/admin-auth";

export default function Admin() {
  const { isAdmin, login } = useAdminSession();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (isAdmin) return <Navigate to="/admin/subscribers" replace />;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (login(email, password)) {
      navigate("/admin/subscribers");
    } else {
      setError("بيانات الدخول غلط.");
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] grid place-items-center px-5" dir="rtl">
      <form
        onSubmit={handleSubmit}
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
        </div>
      </form>
    </div>
  );
}
