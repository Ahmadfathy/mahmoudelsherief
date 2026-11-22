import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Camera, KeyRound, MessageCircle } from "lucide-react";
import { config } from "@/lib/config";

const forgotPasswordWhatsApp =
  `https://wa.me/${config.whatsappNumber}?text=` +
  encodeURIComponent("السلام عليكم، نسيت كلمة السر لحسابي في أكاديمية محمود شريف. رقم موبايلي: ");

export default function ForgotPassword() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)]" dir="rtl">
      <header className="border-b border-[var(--color-border)] bg-[var(--color-bg)]/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-5">
          <Link to="/subscribe" className="flex items-center gap-2 text-sm font-bold text-[var(--color-muted)] transition-colors hover:text-[var(--color-fg)]">
            <ArrowRight size={17} />
            الرجوع لتسجيل الدخول
          </Link>
          <Link to="/" className="flex items-center gap-2 font-bold">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-[var(--color-primary)] text-white">
              <Camera size={16} />
            </span>
            {config.brandName}
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-5 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 md:p-10 text-center"
        >
          <div className="mx-auto mb-6 grid place-items-center w-16 h-16 rounded-full bg-[var(--color-secondary)]/10 text-[var(--color-secondary)]">
            <KeyRound size={28} strokeWidth={1.75} />
          </div>

          <h1
            className="text-2xl md:text-3xl font-black mb-3"
            style={{ fontFamily: "var(--font-display)" }}
          >
            نسيت كلمة السر؟
          </h1>

          <p className="text-[var(--color-muted)] leading-relaxed mb-8">
            مفيش مشكلة. راسلنا على الواتساب وقلنا رقم موبايلك المسجّل، وهنساعدك ترجع لحسابك في دقايق.
          </p>

          <a
            href={forgotPasswordWhatsApp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 h-12 px-8 rounded-full bg-[#25D366] text-white font-bold transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98]"
          >
            <MessageCircle size={18} strokeWidth={2} />
            راسلنا على الواتساب
          </a>

          <div className="mt-8 pt-6 border-t border-dashed border-[var(--color-border)]">
            <p className="text-sm text-[var(--color-muted)]">
              افتكرت كلمة السر؟{" "}
              <Link to="/subscribe" className="text-[var(--color-primary)] font-bold hover:underline">
                رجوع لتسجيل الدخول
              </Link>
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
