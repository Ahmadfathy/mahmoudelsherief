import { MessageCircle, Calendar, Clock, MapPin, Tag, Sparkles, Landmark, ArrowLeft, type LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { offlineCourseContent } from "@/lib/content";
import { config } from "@/lib/config";
import { Reveal } from "@/components/ui/Reveal";

const { isScheduled, scheduled, notScheduled } = offlineCourseContent;

// Bento gallery on a 6-col grid: big left (3×4), wide top-right (3×2),
// two small cells under it (2×2 + 1×2), full-width stripe at the bottom (6×2).
// Placeholder photos — swap src for real workshop photos; keep the spans.
const bentoImages = [
  { src: "/offline/1.jpeg", span: "col-span-3 row-span-4" },
  { src: "/offline/2.jpeg", span: "col-span-3 row-span-2" },
  { src: "/offline/3.jpeg", span: "col-span-2 row-span-2" },
  { src: "/offline/4.jpeg", span: "col-span-1 row-span-2" },
  { src: "/offline/5.jpeg", span: "col-span-6 row-span-2" },
];

const ctaClass =
  "inline-flex items-center gap-3 h-14 rounded-2xl bg-[var(--color-fg)] text-[var(--color-bg)] font-bold text-lg transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-secondary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] shadow-[0_15px_40px_-15px_rgba(44,54,57,0.4)]";

const dots = `radial-gradient(circle, color-mix(in srgb, var(--color-fg) 10%, transparent) 1px, transparent 3px)`;

// Soft pastel glows: terracotta top-right, faint slate bottom-left, light terracotta bottom-right
const glows = `
  radial-gradient(ellipse 50% 40% at 100% 0%, color-mix(in srgb, var(--color-secondary) 18%, transparent) 0%, transparent 70%),
  radial-gradient(ellipse 45% 35% at 0% 100%, color-mix(in srgb, var(--color-primary) 8%, transparent) 0%, transparent 70%),
  radial-gradient(ellipse 35% 30% at 85% 100%, color-mix(in srgb, var(--color-secondary) 10%, transparent) 0%, transparent 75%)
`;

function WaitlistBlock() {
  return (
    <div>
      <div className="inline-flex items-center gap-2 bg-[var(--color-card)] border border-[var(--color-border)] px-4 py-2 rounded-full text-sm text-[var(--color-muted)] mb-5">
        <span className="w-2 h-2 rounded-full bg-[var(--color-secondary)] animate-pulse" />
        {notScheduled.headline}
      </div>
      <p className="text-[var(--color-fg)] leading-relaxed mb-6 max-w-md">{notScheduled.description}</p>
      <a href={config.whatsappDetails} target="_blank" rel="noopener noreferrer" className={`${ctaClass} px-8`}>
        <MessageCircle size={20} strokeWidth={2} />
        {notScheduled.ctaLabel}
      </a>
    </div>
  );
}

function ScheduledBlock() {
  const details = [
    { icon: Calendar, label: "التاريخ", value: scheduled.date },
    { icon: Clock, label: "الوقت", value: scheduled.time },
    { icon: MapPin, label: "المكان", value: scheduled.location, href: scheduled.mapUrl },
    { icon: Tag, label: "السعر", value: scheduled.price },
  ];

  return (
    <div>
      {scheduled.seatsRemaining && (
        <div className="inline-flex items-center gap-2 bg-[color-mix(in_srgb,var(--color-secondary)_12%,transparent)] text-[var(--color-secondary)] px-4 py-2 rounded-full text-sm font-bold mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-secondary)] animate-pulse" />
          {scheduled.seatsRemaining}
        </div>
      )}

      <ul className="space-y-3 mb-8">
        {details.map((item, i) => {
          const Icon = item.icon;
          const content = (
            <div className="flex items-center gap-3">
              <Icon size={18} strokeWidth={1.75} className="text-[var(--color-secondary)] shrink-0" />
              <span className="text-sm text-[var(--color-muted)] shrink-0 w-14">{item.label}</span>
              <span className="text-[var(--color-fg)] font-bold">{item.value || "—"}</span>
            </div>
          );
          return (
            <li key={i}>
              {item.href ? (
                <a href={item.href} target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">
                  {content}
                </a>
              ) : (
                content
              )}
            </li>
          );
        })}
      </ul>

      <Link to={scheduled.ctaHref} className={`${ctaClass} px-10`}>
        {scheduled.ctaLabel}
      </Link>
    </div>
  );
}

// REVIEW-ONLY: preview of the scheduled-course details, rendered below the waitlist
// while offlineCourseContent.showScheduledPreview is true.
function ScheduledPreviewBlock() {
  return (
    <div className="mt-8 pt-8 border-t border-dashed border-[var(--color-border)]">
      {/* Early-bird badge */}
      {scheduled.earlyBirdNote && (
        <div className="inline-flex items-center gap-2 bg-[var(--color-secondary)] text-[#1A1A1A] px-3 py-1.5 rounded-full text-xs font-bold mb-4">
          <Sparkles size={12} strokeWidth={2.5} />
          {scheduled.earlyBirdNote}
        </div>
      )}

      {/* Seats remaining */}
      {scheduled.seatsRemaining && (
        <p className="flex items-center gap-2 text-sm text-[var(--color-muted)] mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-secondary)] animate-pulse" />
          {scheduled.seatsRemaining}
        </p>
      )}

      {/* Details card — 2-column grid of (icon + label + value) rows */}
      <div className="mb-5 p-5 bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl">
        <div className="grid grid-cols-2 gap-x-4 gap-y-4">
          <DetailItem icon={Landmark} label="المحافظة" value={scheduled.governorate} />
          <DetailItem icon={Calendar} label="التاريخ" value={scheduled.date} />
          <DetailItem icon={Clock} label="الوقت" value={scheduled.time} />
          <DetailItem icon={MapPin} label="المكان" value={scheduled.location} href={scheduled.mapUrl || undefined} />
        </div>
      </div>

      {/* Price card */}
      <div className="mb-6 p-5 bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl text-center">
        <p className="text-xs uppercase tracking-widest text-[var(--color-muted)] mb-2">سعر الاشتراك</p>
        <div className="flex flex-wrap items-baseline justify-center gap-x-3 gap-y-1">
          <span className="text-xl md:text-2xl text-[var(--color-muted)] line-through tabular">{scheduled.price}</span>
          <span
            className="text-3xl md:text-4xl font-black text-[var(--color-secondary)] tabular"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {scheduled.earlyBirdPrice}
          </span>
        </div>
      </div>

      {/* CTA */}
      <Link
        to={scheduled.ctaHref}
        className="inline-flex w-full items-center justify-center gap-3 h-14 px-8 rounded-2xl bg-[var(--color-fg)] text-[var(--color-bg)] font-bold text-lg transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-secondary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] shadow-[0_15px_40px_-15px_rgba(44,54,57,0.4)]"
      >
        {scheduled.ctaLabel}
        <ArrowLeft size={18} strokeWidth={2.5} />
      </Link>
    </div>
  );
}

// Small internal helper for detail rows
function DetailItem({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  href?: string;
}) {
  const inner = (
    <div className="flex items-start gap-2.5">
      <Icon size={16} strokeWidth={1.75} className="text-[var(--color-secondary)] shrink-0 mt-0.5" />
      <div className="min-w-0">
        <div className="text-xs text-[var(--color-muted)] mb-0.5">{label}</div>
        <div className="text-sm font-bold text-[var(--color-fg)] break-words">{value || "—"}</div>
      </div>
    </div>
  );
  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">
      {inner}
    </a>
  ) : (
    inner
  );
}

export function OfflineCourse() {
  return (
    <section
      id="offline"
      aria-labelledby="offline-heading"
      className="relative py-24 md:py-32 overflow-hidden bg-[var(--color-bg)]"
    >
      {/* Dotted pattern overlay */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: dots, backgroundSize: "18px 18px", opacity: 0.35 }}
      />
      {/* Pastel radial glows */}
      <div aria-hidden className="absolute inset-0 pointer-events-none" style={{ backgroundImage: glows }} />

      <div className="relative max-w-7xl mx-auto px-5 md:px-8">
        {/* Section number */}
        <div
          aria-hidden
          className="section-number text-[10rem] md:text-[14rem] absolute -top-12 md:-top-20 -start-2 md:-start-4 select-none pointer-events-none leading-none"
        >
          07
        </div>

        <div className="relative grid lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-10 lg:gap-16 items-center">
          {/* Start column — text + CTA */}
          <div>
            <Reveal>
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-[color-mix(in_srgb,var(--color-secondary)_15%,transparent)] text-[var(--color-secondary)] text-sm font-bold mb-6">
                {offlineCourseContent.eyebrow}
              </span>
            </Reveal>

            <Reveal delay={0.08}>
              <h2 id="offline-heading" className="text-display-md text-[var(--color-fg)] mb-5">
                {offlineCourseContent.title.before}{" "}
                <span className="marker-yellow">{offlineCourseContent.title.highlight}</span>{" "}
                {offlineCourseContent.title.after}
              </h2>
            </Reveal>

            <Reveal delay={0.12}>
              <p className="text-lg text-[var(--color-muted)] leading-relaxed mb-8 max-w-md">
                ورشة حضورية بتطبّق فيها كل ما تعلّمته على الطبيعة، بإشراف مباشر من محمود شريف.
              </p>
            </Reveal>

            <Reveal delay={0.16}>{isScheduled ? <ScheduledBlock /> : <WaitlistBlock />}</Reveal>

            {/* REVIEW-ONLY: scheduled preview, shown below the waitlist for design review.
                Controlled by offlineCourseContent.showScheduledPreview — flip off when done reviewing. */}
            {!isScheduled && offlineCourseContent.showScheduledPreview && (
              <Reveal delay={0.22}>
                <ScheduledPreviewBlock />
              </Reveal>
            )}
          </div>

          {/* End column — bento gallery (Reveal is the grid item, so it carries the span) */}
          <div className="grid grid-cols-6 auto-rows-[90px] md:auto-rows-[110px] gap-3 md:gap-4" dir="ltr">
            {bentoImages.map((img, i) => (
              <Reveal key={i} delay={0.2 + i * 0.07} className={img.span}>
                <div className="group h-full overflow-hidden rounded-2xl md:rounded-3xl border border-[var(--color-border)] bg-[var(--color-card)] shadow-[0_8px_24px_-12px_rgba(44,54,57,0.15)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_35px_-15px_rgba(44,54,57,0.3)]">
                  <img
                    src={img.src}
                    alt="من ورشة التصوير"
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
