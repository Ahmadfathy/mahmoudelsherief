
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Camera } from "lucide-react";
import { navItems } from "@/lib/content";
import { ThemeToggle } from "./ThemeToggle";
import { config } from "@/lib/config";
import { Link } from "react-router-dom";

export function Header() {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeId, setActiveId] = useState<string>("hero");
  const [mobileOpen, setMobileOpen] = useState(false);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  // Hide on scroll down, show on scroll up
  useEffect(() => {
    function onScroll() {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 40);

        // Only act after threshold to avoid jitter at top
        if (y < 80) {
          setHidden(false);
        } else if (y > lastScrollY.current + 5) {
          setHidden(true);
        } else if (y < lastScrollY.current - 5) {
          setHidden(false);
        }
        lastScrollY.current = y;
        ticking.current = false;
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Active section observer
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    navItems.forEach((item) => {
      const el = document.getElementById(item.id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveId(item.id);
        },
        { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Close mobile menu on escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMobileOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: 0 }}
        animate={{ y: hidden ? "-100%" : 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 backdrop-blur-md bg-[var(--color-bg)]/80
          ${scrolled ? "border-b border-[var(--color-border)]" : ""}`}
      >
        <div className="max-w-7xl mx-auto px-5 md:px-8 h-16 md:h-20 flex items-center justify-between gap-4">
          {/* Logo */}
          <a
            href="#hero"
            className="flex items-center gap-2 font-bold text-xl group"
            style={{ fontFamily: "var(--font-display)" }}
          >
            <img
              src="/logo.jpg"
              alt="Logo"
              className="w-9 h-9 rounded-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <span className="text-[var(--color-fg)] hidden md:inline">{config.brandName}</span>
            <span className="text-[var(--color-fg)] md:hidden">MS</span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = activeId === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="relative px-4 py-2 text-sm font-medium transition-colors duration-200 hover:text-[var(--color-primary)]"
                >
                  <span
                    className={`relative z-10 ${isActive ? "text-[var(--color-primary)]" : "text-[var(--color-fg)]"}`}
                  >
                    {item.label}
                  </span>
                  {isActive && (
                    <motion.span
                      layoutId="active-pill"
                      className="absolute inset-0 bg-[var(--color-primary)]/10 rounded-full"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                  {isActive && (
                    <motion.span
                      layoutId="active-underline"
                      className="absolute -bottom-0.5 inset-x-3 h-0.5 bg-[var(--color-primary)] rounded-full"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/payment"
              className="hidden md:inline-flex items-center justify-center bg-[var(--color-primary)] text-white text-sm font-bold px-5 py-2 rounded-full hover:scale-105 transition-transform"
            >
              اشترك الآن
            </Link>
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="فتح القائمة"
              className="md:hidden grid place-items-center w-10 h-10 rounded-full border border-[var(--color-border)] hover:border-[var(--color-fg)] transition-colors"
            >
              <Menu size={20} strokeWidth={1.75} />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm md:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-0 bottom-0 end-0 z-[70] w-[85%] max-w-sm bg-[var(--color-bg)] border-s border-[var(--color-border)] flex flex-col md:hidden"
            >
              <div className="flex items-center justify-between p-5 border-b border-[var(--color-border)]">
                <span
                  className="font-bold text-lg"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  MS
                </span>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  aria-label="إغلاق القائمة"
                  className="grid place-items-center w-10 h-10 rounded-full hover:bg-[var(--color-subtle)] transition-colors"
                >
                  <X size={20} strokeWidth={1.75} />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto p-5">
                <ul className="space-y-1">
                  {navItems.map((item, i) => (
                    <motion.li
                      key={item.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: 0.05 * i,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    >
                      <a
                        href={`#${item.id}`}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-4 p-4 rounded-xl transition-colors
                          ${activeId === item.id ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)]" : "hover:bg-[var(--color-subtle)]"}`}
                      >
                        <span
                          className="text-xs tabular text-[var(--color-muted)]"
                          style={{ fontFamily: "var(--font-display)" }}
                        >
                          {item.number}
                        </span>
                        <span className="text-lg font-bold">{item.label}</span>
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </nav>

              <div className="p-5 border-t border-[var(--color-border)] flex flex-col gap-5">
                <Link
                  to="/payment"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center w-full bg-[var(--color-primary)] text-white text-base font-bold py-3.5 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all"
                >
                  اشترك الآن
                </Link>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--color-muted)]">
                    المظهر
                  </span>
                  <ThemeToggle />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
