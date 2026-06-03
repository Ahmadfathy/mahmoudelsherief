import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Copy, Check, Camera } from "lucide-react";
import { Link } from "react-router-dom";
import { config } from "@/lib/config";

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-full border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
    >
      {copied ? (
        <Check size={14} strokeWidth={2.5} className="text-green-500" />
      ) : (
        <Copy size={14} strokeWidth={2} />
      )}
      {copied ? "تم النسخ!" : label}
    </button>
  );
}

function QrPlaceholder({ src, alt }: { src: string; alt: string }) {
  const [error, setError] = useState(false);

  if (!error) {
    return (
      <img
        src={src}
        alt={alt}
        onError={() => setError(true)}
        className="w-52 h-52 object-contain rounded-xl"
      />
    );
  }

  return (
    <div className="w-52 h-52 rounded-xl border-2 border-dashed border-[var(--color-border)] grid place-items-center bg-[var(--color-subtle)]">
      <div className="text-center p-4">
        <svg width="80" height="80" viewBox="0 0 80 80" className="mx-auto mb-3 opacity-30" aria-hidden>
          <rect x="2" y="2" width="22" height="22" rx="3" fill="none" stroke="currentColor" strokeWidth="4"/>
          <rect x="8" y="8" width="10" height="10" rx="1" fill="currentColor"/>
          <rect x="56" y="2" width="22" height="22" rx="3" fill="none" stroke="currentColor" strokeWidth="4"/>
          <rect x="62" y="8" width="10" height="10" rx="1" fill="currentColor"/>
          <rect x="2" y="56" width="22" height="22" rx="3" fill="none" stroke="currentColor" strokeWidth="4"/>
          <rect x="8" y="62" width="10" height="10" rx="1" fill="currentColor"/>
          <rect x="34" y="34" width="4" height="4" fill="currentColor" opacity="0.4"/>
          <rect x="42" y="34" width="4" height="4" fill="currentColor" opacity="0.4"/>
          <rect x="50" y="34" width="4" height="4" fill="currentColor" opacity="0.4"/>
          <rect x="34" y="42" width="4" height="4" fill="currentColor" opacity="0.4"/>
          <rect x="50" y="42" width="4" height="4" fill="currentColor" opacity="0.4"/>
          <rect x="42" y="50" width="4" height="4" fill="currentColor" opacity="0.4"/>
          <rect x="34" y="58" width="4" height="4" fill="currentColor" opacity="0.4"/>
          <rect x="58" y="50" width="4" height="4" fill="currentColor" opacity="0.4"/>
          <rect x="58" y="58" width="4" height="4" fill="currentColor" opacity="0.4"/>
        </svg>
        <p className="text-xs text-[var(--color-muted)]">ضع صورة الـ QR Code هنا</p>
      </div>
    </div>
  );
}

export default function Payment() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col" dir="rtl">

      <header className="sticky top-0 z-50 backdrop-blur-md bg-[var(--color-bg)]/85 border-b border-[var(--color-border)]">
        <div className="max-w-4xl mx-auto px-5 h-16 flex items-center justify-between gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-fg)] transition-colors"
          >
            <ArrowRight size={16} strokeWidth={2} />
            <span>الرجوع</span>
          </Link>
          <Link to="/" className="flex items-center gap-2 font-bold text-lg" style={{ fontFamily: "var(--font-display)" }}>
            <span className="grid place-items-center w-8 h-8 rounded-full bg-[var(--color-primary)] text-white">
              <Camera size={16} strokeWidth={1.75} />
            </span>
            <span>{config.brandName}</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-5 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12"
        >
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--color-muted)] mb-3">خطوة أخيرة</p>
          <h1 className="text-4xl md:text-5xl font-black text-[var(--color-fg)] mb-4" style={{ fontFamily: "var(--font-display)" }}>
            اختار طريقة الدفع
          </h1>
          <p className="text-[var(--color-muted)] text-lg max-w-md mx-auto leading-relaxed">
            افتح التطبيق وامسح الـ QR Code، أو انسخ الرقم وابعت المبلغ يدوياً
          </p>

          <div className="inline-flex items-baseline gap-2 mt-6 bg-[var(--color-secondary)] text-[#1A1A1A] px-5 py-2 rounded-full">
            <span className="text-2xl font-black" style={{ fontFamily: "var(--font-display)" }}>1,999</span>
            <span className="text-sm font-bold">ج.م</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-3xl p-8 flex flex-col items-center gap-6 text-center hover:border-[#E60000]/40 transition-colors"
          >
            <div className="flex items-center gap-3">
              <img src="/vodafone-icon.png" alt="Vodafone Cash" className="w-[50px] h-[50px] object-contain rounded-full" />
              <div className="text-start">
                <p className="font-black text-lg text-[var(--color-fg)]" style={{ fontFamily: "var(--font-display)" }}>فودافون كاش</p>
                <p className="text-xs text-[var(--color-muted)] tabular">Vodafone Cash</p>
              </div>
            </div>

            <QrPlaceholder src="/vodafone-cash.jpeg" alt="QR Code فودافون كاش" />

            <div className="w-full">
              <p className="text-xs text-[var(--color-muted)] mb-2 uppercase tracking-widest">رقم المحفظة</p>
              <p className="text-2xl font-black text-[var(--color-fg)] mb-3 tabular" style={{ fontFamily: "var(--font-display)" }}>
                01012205238
              </p>
              <CopyButton text="01012205238" label="نسخ الرقم" />
            </div>

            <p className="text-xs text-[var(--color-muted)] leading-relaxed">
              افتح تطبيق فودافون كاش ← ادفع ← امسح الـ QR أو ابعت على الرقم
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-3xl p-8 flex flex-col items-center gap-6 text-center hover:border-[#6C2BD9]/40 transition-colors"
          >
            <div className="flex items-center gap-3">
              <img src="/instapay-icon.png" alt="InstaPay" className="w-[50px] h-[50px] object-contain rounded-full" />
              <div className="text-start">
                <p className="font-black text-lg text-[var(--color-fg)]" style={{ fontFamily: "var(--font-display)" }}>إنستاباي</p>
                <p className="text-xs text-[var(--color-muted)] tabular">InstaPay</p>
              </div>
            </div>

            <QrPlaceholder src="/instapay.jpeg" alt="QR Code إنستاباي" />

            <div className="w-full">
              <p className="text-xs text-[var(--color-muted)] mb-2 uppercase tracking-widest">رقم الحساب</p>
              <p className="text-2xl font-black text-[var(--color-fg)] mb-3 tabular" style={{ fontFamily: "var(--font-display)" }}>
                01113010090
              </p>
              <CopyButton text="01113010090" label="نسخ الرقم" />
            </div>

            <p className="text-xs text-[var(--color-muted)] leading-relaxed">
              افتح تطبيق إنستاباي ← تحويل ← امسح الـ QR أو ابعت على الرقم
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-10 text-center"
        >
          <p className="text-[var(--color-muted)] mb-4">بعد الدفع ابعتلنا إيصال الدفع على واتساب لتأكيد التسجيل</p>
          <a
            href={config.whatsappSubscribe}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] text-white font-bold px-7 py-3.5 rounded-full hover:opacity-90 active:scale-95 transition-all duration-200"
            style={{ fontFamily: "var(--font-display)" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            ابعت إيصال الدفع
          </a>
        </motion.div>
      </main>
    </div>
  );
}
