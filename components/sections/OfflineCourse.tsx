import { Camera, Users, HandMetal, MessageCircle, Calendar, Clock, MapPin, Tag } from "lucide-react";
import { Link } from "react-router-dom";
import { offlineCourseContent } from "@/lib/content";
import { config } from "@/lib/config";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const experienceTiles = [
  { icon: Camera, title: "تصوير ميداني", description: "جلسات تصوير حقيقية في مواقع مختارة حول القاهرة." },
  { icon: Users, title: "نقاش جماعي", description: "مراجعة شغل كل طالب ومناقشة مع المجموعة لحظة بلحظة." },
  { icon: HandMetal, title: "تطبيق مباشر", description: "تمارين عملية وفيدباك فوري من محمود على شغلك." },
];

const ctaClass =
  "inline-flex items-center gap-3 h-14 rounded-2xl bg-[var(--color-fg)] text-[var(--color-bg)] font-bold text-lg transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-secondary)] focus-visible:ring-offset-2";

// Studio-light glow: gold at top-start / bottom-end, faint dark wash at the other two corners
const glow = `
  radial-gradient(ellipse 60% 50% at 0% 0%, color-mix(in srgb, var(--color-secondary) 12%, transparent) 0%, transparent 60%),
  radial-gradient(ellipse 60% 50% at 100% 100%, color-mix(in srgb, var(--color-secondary) 10%, transparent) 0%, transparent 60%),
  radial-gradient(ellipse 50% 40% at 100% 0%, color-mix(in srgb, var(--color-fg) 4%, transparent) 0%, transparent 55%),
  radial-gradient(ellipse 50% 40% at 0% 100%, color-mix(in srgb, var(--color-fg) 4%, transparent) 0%, transparent 55%)
`;

export function OfflineCourse() {
  const { isScheduled, scheduled, notScheduled } = offlineCourseContent;

  const details = [
    { icon: Calendar, label: "التاريخ", value: scheduled.date },
    { icon: Clock, label: "الوقت", value: scheduled.time },
    { icon: MapPin, label: "المكان", value: scheduled.location, href: scheduled.mapUrl },
    { icon: Tag, label: "السعر", value: scheduled.price },
  ];

  return (
    <section
      id="offline"
      aria-labelledby="offline-heading"
      className="relative py-24 md:py-32 overflow-hidden bg-[var(--color-bg)]"
    >
      <div aria-hidden className="absolute inset-0 pointer-events-none" style={{ backgroundImage: glow }} />

      <div className="relative max-w-7xl mx-auto px-5 md:px-8">
        <div id="offline-heading">
          <SectionHeading
            number="07"
            align="center"
            eyebrow={offlineCourseContent.eyebrow}
            title={offlineCourseContent.title}
          />
        </div>
        <Reveal delay={0.1}>
          <p className="mt-6 text-lg md:text-xl text-[var(--color-muted)] max-w-2xl mx-auto text-center leading-relaxed">
            ورشة مكثفة في القاهرة — تجربة ميدانية بإيدك، تحت إشراف مباشر من محمود.
          </p>
        </Reveal>

        {/* Experience tiles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-7 mt-16 mb-16 max-w-5xl mx-auto">
          {experienceTiles.map((tile, i) => {
            const Icon = tile.icon;
            return (
              <Reveal key={i} delay={i * 0.08} className="h-full">
                <div className="relative h-full bg-[var(--color-card)] border border-[var(--color-border)] rounded-3xl p-7 md:p-8 transition-all duration-300 hover:border-[var(--color-secondary)]/50 hover:-translate-y-1 hover:shadow-[0_15px_40px_-15px_rgba(161,98,7,0.25)]">
                  <div className="grid place-items-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--color-secondary)]/15 to-[var(--color-secondary)]/5 text-[var(--color-secondary)] mb-6">
                    <Icon size={26} strokeWidth={1.75} />
                  </div>
                  <h3
                    className="text-xl md:text-2xl font-bold text-[var(--color-fg)] mb-2"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {tile.title}
                  </h3>
                  <p className="text-[var(--color-muted)] leading-relaxed">{tile.description}</p>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* State-dependent bottom block */}
        <Reveal delay={0.3}>
          {isScheduled ? (
            <div className="max-w-4xl mx-auto">
              {scheduled.seatsRemaining && (
                <div className="flex justify-center mb-6">
                  <div className="inline-flex items-center gap-2 bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] px-4 py-2 rounded-full text-sm font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-secondary)] animate-pulse" />
                    {scheduled.seatsRemaining}
                  </div>
                </div>
              )}

              {/* Tailwind v4 dividers use logical properties, so md:divide-x is already RTL-correct */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-0 mb-10 bg-[var(--color-card)] border border-[var(--color-border)] rounded-3xl p-6 md:p-8 md:divide-x divide-[var(--color-border)]">
                {details.map((item, i) => {
                  const Icon = item.icon;
                  const inner = (
                    <div className="flex flex-col items-center text-center md:px-4 py-3 md:py-0">
                      <Icon size={20} strokeWidth={1.75} className="text-[var(--color-secondary)] mb-2" />
                      <div className="text-xs uppercase tracking-widest text-[var(--color-muted)] mb-1">{item.label}</div>
                      <div className="text-[var(--color-fg)] font-bold text-base md:text-lg">{item.value || "—"}</div>
                    </div>
                  );
                  return item.href ? (
                    <a key={i} href={item.href} target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">
                      {inner}
                    </a>
                  ) : (
                    <div key={i}>{inner}</div>
                  );
                })}
              </div>

              <div className="text-center">
                <Link to={scheduled.ctaHref} className={`${ctaClass} px-10`}>
                  {scheduled.ctaLabel}
                </Link>
              </div>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-[var(--color-card)] border border-[var(--color-border)] px-4 py-2 rounded-full text-sm text-[var(--color-muted)] mb-5">
                <span className="w-2 h-2 rounded-full bg-[var(--color-secondary)]" />
                {notScheduled.headline}
              </div>
              <p
                className="text-[var(--color-fg)] text-lg md:text-xl leading-relaxed mb-8"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {notScheduled.description}
              </p>
              <a href={config.whatsappDetails} target="_blank" rel="noopener noreferrer" className={`${ctaClass} px-8`}>
                <MessageCircle size={20} strokeWidth={2} />
                {notScheduled.ctaLabel}
              </a>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}
