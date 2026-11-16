import type { LucideIcon } from "lucide-react";
import { Camera, Users, HandMetal, MessageCircle, Calendar, Clock, MapPin, Tag } from "lucide-react";
import { Link } from "react-router-dom";
import { offlineCourseContent } from "@/lib/content";
import { config } from "@/lib/config";
import { Reveal } from "@/components/ui/Reveal";

const { isScheduled, scheduled, notScheduled } = offlineCourseContent;

type PillTileProps = { icon: LucideIcon; title: string; description: string };

const experienceTiles: PillTileProps[] = [
  { icon: Camera, title: "تصوير ميداني", description: "جلسات تصوير حقيقية في مواقع مختارة حول القاهرة." },
  { icon: Users, title: "نقاش جماعي", description: "مراجعة شغل كل طالب ومناقشة مع المجموعة لحظة بلحظة." },
  { icon: HandMetal, title: "تطبيق مباشر", description: "تمارين عملية وفيدباك فوري من محمود على شغلك." },
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

function PillTile({ icon: Icon, title, description }: PillTileProps) {
  return (
    <div className="flex items-center gap-4 bg-[var(--color-card)] border border-[var(--color-border)] rounded-[32px] p-3 md:p-4 pe-6 md:pe-8 transition-all duration-300 hover:border-[var(--color-secondary)]/50 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-10px_rgba(196,113,55,0.25)]">
      <div className="shrink-0 grid place-items-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-[color-mix(in_srgb,var(--color-secondary)_20%,transparent)] to-[color-mix(in_srgb,var(--color-secondary)_8%,transparent)] text-[var(--color-secondary)]">
        <Icon size={24} strokeWidth={1.75} />
      </div>
      <div className="flex-1 min-w-0">
        <h3
          className="text-base md:text-lg font-bold text-[var(--color-fg)] mb-0.5"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {title}
        </h3>
        <p className="text-sm text-[var(--color-muted)] leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

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
                ورشة مكثفة في القاهرة — تجربة ميدانية بإيدك، تحت إشراف مباشر من محمود.
              </p>
            </Reveal>

            <Reveal delay={0.16}>{isScheduled ? <ScheduledBlock /> : <WaitlistBlock />}</Reveal>
          </div>

          {/* End column — pill tiles */}
          <div className="flex flex-col gap-3 md:gap-4">
            {experienceTiles.map((tile, i) => (
              <Reveal key={i} delay={0.2 + i * 0.08}>
                <PillTile {...tile} />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
