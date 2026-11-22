import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight, ArrowLeft, Camera,
  Sparkles, Landmark, Calendar, Clock, MapPin,
  Download, Infinity as InfinityIcon, RefreshCw, MessageSquare,
  Send, UserPlus, HelpCircle,
  Copy, Check,
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { config } from "@/lib/config";
import { pricingContent, featuresContent, offlineCourseContent } from "@/lib/content";

type Variant = "online" | "offline";

const featureIconMap = {
  Download,
  Infinity: InfinityIcon,
  RefreshCw,
  MessageSquare,
  Calendar,
};

/**
 * Mask an Arabic (or any) full name for privacy display.
 * Shows the FIRST word fully; each subsequent word becomes its first letter + "***".
 * Example: "محمود شريف محمد علي" → "محمود ش*** م*** ع***"
 */
function maskHolderName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0];
  const [first, ...rest] = parts;
  // Array.from splits by code point, so a non-BMP first character isn't cut in half.
  return [first, ...rest.map((w) => (Array.from(w)[0] ?? "") + "***")].join(" ");
}

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
      className="flex shrink-0 items-center gap-2 text-sm font-bold px-4 py-2 rounded-full border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
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
        className="w-36 h-36 object-contain rounded-xl bg-white"
      />
    );
  }

  return (
    <div className="w-36 h-36 rounded-xl border-2 border-dashed border-[var(--color-border)] grid place-items-center bg-[var(--color-subtle)]">
      <p className="text-xs text-[var(--color-muted)] p-3 text-center">ضع صورة الـ QR Code هنا</p>
    </div>
  );
}

function CombinedSummaryCard({ isOffline }: { isOffline: boolean }) {
  const { scheduled } = offlineCourseContent;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-3xl overflow-hidden"
    >
      {/* Price section — top of card */}
      <div className="p-6 md:p-7 text-center border-b border-dashed border-[var(--color-border)]">
        {isOffline ? (
          <>
            <div className="inline-flex items-center gap-2 bg-[var(--color-secondary)] text-[#1A1A1A] px-3 py-1 rounded-full text-xs font-bold mb-3">
              <Sparkles size={11} strokeWidth={2.5} />
              {scheduled.earlyBirdNote}
            </div>
            <div className="flex items-baseline justify-center gap-2 mb-1">
              <span className="text-lg text-[var(--color-muted)] line-through tabular">{scheduled.price}</span>
            </div>
            <div className="flex items-baseline justify-center gap-2">
              <span
                className="text-4xl md:text-5xl font-black text-[var(--color-secondary)] tabular leading-none"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {scheduled.earlyBirdPrice}
              </span>
            </div>
            <p className="mt-3 text-xs text-[var(--color-muted)]">{scheduled.seatsRemaining}</p>
          </>
        ) : (
          <>
            <div className="inline-flex items-center gap-2 bg-[var(--color-secondary)] text-[#1A1A1A] px-3 py-1 rounded-full text-xs font-bold mb-3">
              {pricingContent.discountBadge}
            </div>
            <div className="flex items-baseline justify-center gap-2 mb-1">
              <span className="text-lg text-[var(--color-muted)] line-through tabular">{pricingContent.originalPrice}</span>
              <span className="text-xs text-[var(--color-muted)] uppercase tracking-widest">{pricingContent.currency}</span>
            </div>
            <div className="flex items-baseline justify-center gap-2">
              <span
                className="text-4xl md:text-5xl font-black text-[var(--color-fg)] tabular leading-none"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {pricingContent.discountedPrice}
              </span>
              <span className="text-base font-bold text-[var(--color-fg)]" style={{ fontFamily: "var(--font-display)" }}>
                {pricingContent.currency}
              </span>
            </div>
            <p className="mt-3 text-xs text-[var(--color-muted)]">هو ده المبلغ المطلوب تحويله</p>
          </>
        )}
      </div>

      {/* Features / Details section — bottom of card */}
      <div className="p-6 md:p-7">
        <h3
          className="text-sm font-black text-[var(--color-fg)] mb-4 uppercase tracking-wider"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {isOffline ? "تفاصيل الورشة" : "اللي هتحصل عليه"}
        </h3>

        {isOffline ? (
          <ul className="space-y-3">
            {[
              { icon: Landmark, label: "المحافظة", value: scheduled.governorate },
              { icon: Calendar, label: "التاريخ", value: scheduled.date },
              { icon: Clock, label: "الوقت", value: scheduled.time },
              { icon: MapPin, label: "المكان", value: scheduled.location },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.label} className="flex items-start gap-2.5">
                  <Icon size={16} strokeWidth={1.75} className="text-[var(--color-secondary)] shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <div className="text-xs text-[var(--color-muted)] mb-0.5">{item.label}</div>
                    <div className="text-sm font-bold text-[var(--color-fg)]">{item.value || "—"}</div>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <ul className="space-y-3">
            {featuresContent.items.map((feature) => {
              const Icon = featureIconMap[feature.icon as keyof typeof featureIconMap];
              return (
                <li key={feature.title} className="flex items-start gap-2.5">
                  <span className="grid place-items-center w-6 h-6 shrink-0 rounded-full bg-[var(--color-secondary)]/15 text-[var(--color-secondary)] mt-0.5">
                    {Icon && <Icon size={12} strokeWidth={2.5} />}
                  </span>
                  <span className="text-sm text-[var(--color-fg)]">{feature.title}</span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </motion.div>
  );
}

function PaymentMethodsBlock() {
  const { paymentAccounts } = config;
  const methods = [
    {
      key: "vodafone",
      title: "فودافون كاش",
      subtitle: "Vodafone Cash",
      icon: "/vodafone-icon.png",
      qr: "/vodafone-cash.jpeg",
      numberLabel: "رقم المحفظة",
      number: paymentAccounts.vodafone.number,
      holderName: paymentAccounts.vodafone.holderName,
      instruction: "افتح تطبيق فودافون كاش ← ادفع ← امسح الـ QR أو ابعت على الرقم",
    },
    {
      key: "instapay",
      title: "إنستاباي",
      subtitle: "InstaPay",
      icon: "/instapay-icon.png",
      qr: "/instapay.jpeg",
      numberLabel: "رقم الحساب",
      number: paymentAccounts.instapay.number,
      holderName: paymentAccounts.instapay.holderName,
      instruction: "افتح تطبيق إنستاباي ← تحويل ← امسح الـ QR أو ابعت على الرقم",
    },
  ];

  return (
    <div>
      <h2
        className="text-xl md:text-2xl font-black text-[var(--color-fg)] mb-5"
        style={{ fontFamily: "var(--font-display)" }}
      >
        طريقة الدفع
      </h2>

      <div className="space-y-4">
        {methods.map((method, i) => (
          <motion.div
            key={method.key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-3xl p-5 md:p-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-start gap-5">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={method.icon}
                    alt=""
                    className="h-10 w-10 object-contain rounded-full"
                    onError={(e) => { e.currentTarget.style.display = "none"; }}
                  />
                  <div>
                    <h3 className="text-lg font-black text-[var(--color-fg)]" style={{ fontFamily: "var(--font-display)" }}>
                      {method.title}
                    </h3>
                    <p className="text-xs text-[var(--color-muted)] tabular">{method.subtitle}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {/* Account number */}
                  <div>
                    <p className="text-xs text-[var(--color-muted)] mb-1.5 uppercase tracking-widest">{method.numberLabel}</p>
                    <div className="flex flex-wrap items-center gap-3">
                      <p
                        className="text-xl md:text-2xl font-black text-[var(--color-fg)] tabular"
                        style={{ fontFamily: "var(--font-display)" }}
                        dir="ltr"
                      >
                        {method.number}
                      </p>
                      <CopyButton text={method.number} label="نسخ" />
                    </div>
                  </div>

                  {/* Account holder — MASKED */}
                  <div>
                    <p className="text-xs text-[var(--color-muted)] mb-1.5 uppercase tracking-widest">اسم صاحب الحساب</p>
                    <p className="text-base font-bold text-[var(--color-fg)]">{maskHolderName(method.holderName)}</p>
                  </div>
                </div>
              </div>

              {/* QR code */}
              <div className="self-center sm:self-start">
                <QrPlaceholder src={method.qr} alt={`QR Code ${method.title}`} />
              </div>
            </div>

            {/* Instruction */}
            <p className="mt-4 text-xs text-[var(--color-muted)] leading-relaxed pt-3 border-t border-dashed border-[var(--color-border)]">
              {method.instruction}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ActionStepsBlock({ isOffline, variant }: { isOffline: boolean; variant: Variant }) {
  const paymentConfirmationWhatsApp =
    `https://wa.me/${config.whatsappNumber}?text=` +
    encodeURIComponent(
      isOffline
        ? "السلام عليكم، حولت مبلغ حجز الورشة الأوفلاين. دي صورة التحويل والرقم المحوّل منه. شكراً."
        : "السلام عليكم، حولت مبلغ الكورس الأون لاين. دي صورة التحويل والرقم المحوّل منه. شكراً."
    );

  const actionSteps = [
    {
      key: "whatsapp",
      showFor: ["online", "offline"],
      icon: Send,
      title: "ابعت سكرين التحويل على واتساب",
      description: isOffline
        ? "بعد تحويل المبلغ، ابعتلنا سكرين لعملية التحويل مع الرقم المحوّل منه، وقلنا إنك بتحجز للورشة الأوفلاين."
        : "بعد ما تحوّل المبلغ، ابعتلنا سكرين لعملية التحويل مع الرقم المحوّل منه على واتساب بتاعنا.",
      ctaLabel: "ابعت على واتساب",
      ctaHref: paymentConfirmationWhatsApp,
      ctaExternal: true,
    },
    {
      key: "account",
      showFor: ["online"], // NOT shown for offline
      icon: UserPlus,
      title: "لسه مش عندك حساب؟ اعمل حساب جديد",
      description: "لو أول مرة معانا، سجّل حساب جديد على المنصة عشان نقدر نفعّل وصولك للكورس بعد تأكيد التحويل.",
      ctaLabel: "إنشاء حساب جديد",
      ctaHref: "/subscribe",
      ctaExternal: false,
    },
    {
      key: "help",
      showFor: ["online", "offline"],
      icon: HelpCircle,
      title: "محتاج مساعدة؟",
      description: "لو واجهتك أي مشكلة أو حاجة مش واضحة في الخطوات دي، راسلنا على واتساب وهنساعدك على طول.",
      ctaLabel: "راسلنا على واتساب",
      ctaHref: config.whatsappContact,
      ctaExternal: true,
    },
  ];

  const visibleSteps = actionSteps
    .filter((s) => s.showFor.includes(variant))
    .map((s, i) => ({ ...s, number: `0${i + 1}` })); // renumber sequentially

  const ctaClass =
    "inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-[var(--color-fg)] text-[var(--color-bg)] text-sm font-bold transition-transform duration-200 hover:scale-[1.02]";

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }}>
      <div className="mb-8">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--color-muted)] mb-3">بعد تحويل المبلغ</p>
        <h2 className="text-xl md:text-2xl font-black text-[var(--color-fg)]" style={{ fontFamily: "var(--font-display)" }}>
          {isOffline ? "خطوتين بس وتبقى في الورشة" : "3 خطوات بس وتبقى معانا"}
        </h2>
      </div>

      <div className="space-y-4">
        {visibleSteps.map((step, i) => {
          const Icon = step.icon;
          const CTA = step.ctaExternal ? (
            <a href={step.ctaHref} target="_blank" rel="noopener noreferrer" className={ctaClass}>
              {step.ctaLabel}
              <ArrowLeft size={16} strokeWidth={2.5} />
            </a>
          ) : (
            <Link to={step.ctaHref} className={ctaClass}>
              {step.ctaLabel}
              <ArrowLeft size={16} strokeWidth={2.5} />
            </Link>
          );

          return (
            <motion.div
              key={step.key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex items-start gap-4 md:gap-5 bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl md:rounded-3xl p-5 md:p-6"
            >
              <span
                className="shrink-0 text-2xl md:text-3xl font-black tabular text-[var(--color-secondary)]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {step.number}
              </span>

              <span className="shrink-0 grid place-items-center w-11 h-11 md:w-12 md:h-12 rounded-xl bg-[var(--color-secondary)]/10 text-[var(--color-secondary)]">
                <Icon size={20} strokeWidth={1.75} />
              </span>

              <div className="flex-1 min-w-0">
                <h3 className="text-base md:text-lg font-bold text-[var(--color-fg)] mb-1.5" style={{ fontFamily: "var(--font-display)" }}>
                  {step.title}
                </h3>
                <p className="text-sm text-[var(--color-muted)] leading-relaxed mb-4">{step.description}</p>
                {CTA}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

export default function Payment() {
  const [searchParams] = useSearchParams();
  const variant: Variant = searchParams.get("type") === "offline" ? "offline" : "online";
  const isOffline = variant === "offline";

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

      <main className="flex-1 px-5 py-12 md:py-16">
        <div className="mx-auto max-w-6xl">

          {/* Page heading — spans full width above the grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-10 md:mb-12"
          >
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--color-muted)] mb-3">
              {isOffline ? "حجز ورشة أوفلاين" : "اشتراك الكورس الأون لاين"}
            </p>
            <h1 className="text-3xl md:text-5xl font-black text-[var(--color-fg)]" style={{ fontFamily: "var(--font-display)" }}>
              {isOffline ? "تفاصيل الحجز" : "اختار طريقة الدفع"}
            </h1>
          </motion.div>

          {/* Split grid — 30/65 with 5% gap. In RTL the first child (aside) sits on the right. */}
          <div className="grid grid-cols-1 lg:grid-cols-[30%_65%] gap-8 lg:gap-x-[5%] lg:gap-y-0">

            {/* Combined price + features/details, sticky on desktop (top-24 clears the 64px header) */}
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <CombinedSummaryCard isOffline={isOffline} />
            </aside>

            {/* Payment methods + action steps */}
            <div className="min-w-0 space-y-10">
              <PaymentMethodsBlock />
              <ActionStepsBlock isOffline={isOffline} variant={variant} />
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
