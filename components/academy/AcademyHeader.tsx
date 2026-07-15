import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { User, LogOut, GraduationCap } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { config } from "@/lib/config";

export function AcademyHeader() {
  const { user, login, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [name, setName] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function handleLoginSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    login(name.trim());
    setLoginOpen(false);
    setName("");
  }

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[var(--color-bg)]/90 border-b border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between gap-4">
        <Link
          to="/academy"
          className="flex items-center gap-2 font-bold text-lg"
          style={{ fontFamily: "var(--font-display)" }}
        >
          <GraduationCap size={22} className="text-[var(--color-primary)]" strokeWidth={1.75} />
          <span className="text-[var(--color-fg)]">{config.brandName} — الأكاديمية</span>
        </Link>

        <div className="flex items-center gap-3">
          <ThemeToggle />

          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => (user ? setMenuOpen((o) => !o) : setLoginOpen(true))}
              aria-label={user ? "قائمة الحساب" : "تسجيل الدخول"}
              className="grid place-items-center w-10 h-10 rounded-full border border-[var(--color-border)] bg-[var(--color-card)] hover:border-[var(--color-primary)] transition-colors overflow-hidden"
            >
              {user ? (
                <span
                  className="w-full h-full grid place-items-center bg-[var(--color-primary)] text-white text-sm font-bold"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {user.name.trim().charAt(0)}
                </span>
              ) : (
                <User size={18} strokeWidth={1.75} />
              )}
            </button>

            <AnimatePresence>
              {menuOpen && user && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute end-0 mt-2 w-52 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] shadow-xl overflow-hidden"
                >
                  <div className="px-4 py-3 border-b border-[var(--color-border)]">
                    <p className="font-bold text-sm truncate">{user.name}</p>
                    <p className="text-xs text-[var(--color-muted)]">مشترك في الأكاديمية</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-500 hover:bg-[var(--color-subtle)] transition-colors"
                  >
                    <LogOut size={16} strokeWidth={1.75} />
                    تسجيل الخروج
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {loginOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLoginOpen(false)}
              className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="fixed z-[70] top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 rtl:translate-x-1/2 w-[90%] max-w-sm bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 shadow-2xl"
            >
              <h2
                className="text-xl font-bold mb-1"
                style={{ fontFamily: "var(--font-display)" }}
              >
                تسجيل الدخول للأكاديمية
              </h2>
              <p className="text-sm text-[var(--color-muted)] mb-4">
                سجّل دخولك عشان توصل لمحتوى الكورسات اللي مشترك فيها
              </p>
              <form onSubmit={handleLoginSubmit} className="space-y-3">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="اسمك"
                  autoFocus
                  className="w-full h-11 px-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
                />
                <button
                  type="submit"
                  className="w-full h-11 rounded-lg bg-[var(--color-primary)] text-white font-bold hover:opacity-90 transition-opacity"
                >
                  دخول
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
