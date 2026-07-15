import { useState } from "react";
import { LogOut, Shield } from "lucide-react";
import { useAdminSession } from "@/lib/admin-auth";
import { SubscribersPanel } from "@/components/admin/SubscribersPanel";
import { CoursesPanel } from "@/components/admin/CoursesPanel";

export default function Admin() {
  const { isAdmin, login, logout } = useAdminSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"subscribers" | "courses">("subscribers");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!login(email, password)) {
      setError("بيانات الدخول غلط.");
    }
  }

  if (!isAdmin) {
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

  return (
    <div className="min-h-screen bg-[var(--color-bg)]" dir="rtl">
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[var(--color-bg)]/90 border-b border-[var(--color-border)]">
        <div className="max-w-5xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold" style={{ fontFamily: "var(--font-display)" }}>
            <Shield size={20} className="text-[var(--color-primary)]" strokeWidth={1.75} />
            لوحة تحكم الأدمن
          </div>
          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-1.5 h-9 px-4 rounded-full text-sm font-bold text-red-500 hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={15} />
            تسجيل الخروج
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-5 md:px-8 py-8">
        <div className="flex gap-2 mb-6">
          <button
            type="button"
            onClick={() => setTab("subscribers")}
            className={`h-10 px-5 rounded-full text-sm font-bold transition-colors ${
              tab === "subscribers"
                ? "bg-[var(--color-primary)] text-white"
                : "bg-[var(--color-subtle)] hover:bg-[var(--color-border)]"
            }`}
          >
            المشتركين
          </button>
          <button
            type="button"
            onClick={() => setTab("courses")}
            className={`h-10 px-5 rounded-full text-sm font-bold transition-colors ${
              tab === "courses"
                ? "bg-[var(--color-primary)] text-white"
                : "bg-[var(--color-subtle)] hover:bg-[var(--color-border)]"
            }`}
          >
            الكورسات والدروس
          </button>
        </div>

        {tab === "subscribers" ? <SubscribersPanel /> : <CoursesPanel />}
      </main>
    </div>
  );
}
