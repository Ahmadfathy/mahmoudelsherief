import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { User, LogOut, GraduationCap, Home } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useAuthModal } from "@/lib/auth-modal-context";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { config } from "@/lib/config";

export function AcademyHeader() {
  const { user, logout } = useAuth();
  const { openLogin } = useAuthModal();
  const [menuOpen, setMenuOpen] = useState(false);
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
          <Link
            to="/"
            className="hidden sm:inline-flex items-center gap-1.5 h-9 px-4 rounded-full border border-[var(--color-border)] text-sm font-bold hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
          >
            <Home size={15} strokeWidth={1.75} />
            عودة للرئيسية
          </Link>
          <Link
            to="/"
            aria-label="عودة للرئيسية"
            className="sm:hidden grid place-items-center w-10 h-10 rounded-full border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
          >
            <Home size={16} strokeWidth={1.75} />
          </Link>
          <ThemeToggle />

          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => (user ? setMenuOpen((o) => !o) : openLogin())}
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
                  className="absolute end-0 mt-2 w-56 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] shadow-xl overflow-hidden"
                >
                  <div className="px-4 py-3 border-b border-[var(--color-border)]">
                    <p className="font-bold text-sm truncate">{user.name}</p>
                    <p className="text-xs text-[var(--color-muted)] truncate">{user.email}</p>
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
    </header>
  );
}
