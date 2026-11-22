import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight, ArrowLeft, Camera,
  Sparkles, Landmark, Calendar, Clock, MapPin,
  Download, Infinity as InfinityIcon, RefreshCw, MessageSquare,
  Send, UserPlus, HelpCircle,
  Copy, Check, Info,
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
  // Both methods share the same account (see the note above paymentAccounts in lib/config.ts).
  const sharedNumber = paymentAccounts.vodafone.number;
  const sharedHolder = paymentAccounts.vodafone.holderName;

  return (
    <div>
      <h2
        className="text-xl md:text-2xl font-black text-[var(--color-fg)] mb-5"
        style={{ fontFamily: "var(--font-display)" }}
      >
        طريقة الدفع
      </h2>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-3xl p-5 md:p-7"
      >
        {/* Top row — both method logos */}
        <div className="flex items-center gap-3 md:gap-4 mb-5 pb-5 border-b border-dashed border-[var(--color-border)]">
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <img
              src="/wallet.png"
              alt=""
              className="h-10 w-10 object-contain shrink-0"
              onError={(e) => { e.currentTarget.style.display = "none"; }}
            />
            <span className="font-black text-[var(--color-fg)]" style={{ fontFamily: "var(--font-display)" }}>
              محفظة
            </span>
          </div>

          <span className="text-[var(--color-muted)] font-bold text-sm shrink-0">أو</span>

          <div className="flex items-center gap-2.5 flex-1 min-w-0 justify-end">
            <span className="font-black text-[var(--color-fg)]" style={{ fontFamily: "var(--font-display)" }}>
              إنستاباي
            </span>
            <img
              src="/instapay-icon.png"
              alt=""
              className="h-10 w-10 object-contain shrink-0"
              onError={(e) => { e.currentTarget.style.display = "none"; }}
            />
          </div>
        </div>

        {/* Shared number */}
        <div className="mb-5">
          <p className="text-xs text-[var(--color-muted)] mb-1.5 uppercase tracking-widest">رقم الحساب</p>
          <div className="flex items-center gap-3 flex-wrap">
            <p
              className="text-2xl md:text-3xl font-black text-[var(--color-fg)] tabular"
              style={{ fontFamily: "var(--font-display)" }}
              dir="ltr"
            >
              {sharedNumber}
            </p>
            <CopyButton text={sharedNumber} label="نسخ الرقم" />
          </div>
        </div>

        {/* Shared holder — masked */}
        <div className="mb-5">
          <p className="text-xs text-[var(--color-muted)] mb-1.5 uppercase tracking-widest">اسم صاحب الحساب</p>
          <p className="text-base font-bold text-[var(--color-fg)]">{maskHolderName(sharedHolder)}</p>
        </div>

        {/* Shared-number note */}
        <div className="pt-4 border-t border-dashed border-[var(--color-border)]">
          <p className="text-xs text-[var(--color-secondary)] font-bold flex items-center gap-2">
            <Info size={13} strokeWidth={2.5} />
            نفس الرقم شغّال مع محفظة و إنستاباي
          </p>
          <ul className="mt-3 space-y-1.5 text-xs text-[var(--color-muted)] leading-relaxed">
            <li>• <span className="font-bold text-[var(--color-fg)]">محفظة:</span> افتح التطبيق ← تحويل ← رقم محفظة</li>
            <li>• <span className="font-bold text-[var(--color-fg)]">إنستاباي:</span> افتح التطبيق ← تحويل ← ابعت على الرقم</li>
          </ul>
        </div>
      </motion.div>
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
