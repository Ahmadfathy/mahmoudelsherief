import type { ComponentType } from "react";
import { Calendar, Clock, MapPin, Tag, CalendarClock, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { offlineCourseContent as o } from "@/lib/content";
import { config } from "@/lib/config";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

function InfoRow({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: ComponentType<{ size?: number; strokeWidth?: number }>;
  label: string;
  value: string;
  href?: string;
}) {
  const inner = (
    <div className="flex items-start gap-3">
      <span className="shrink-0 grid place-items-center w-10 h-10 rounded-2xl bg-[var(--color-subtle)] text-[var(--color-secondary)]">
        <Icon size={18} strokeWidth={1.75} />
      </span>
      <div className="min-w-0">
        <div className="text-xs uppercase tracking-widest text-[var(--color-muted)] mb-1">{label}</div>
        <div className="text-[var(--color-fg)] font-bold">{value || "—"}</div>
      </div>
    </div>
  );
  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
      {inner}
    </a>
  ) : (
    inner
  );
}

function Scheduled() {
  const s = o.scheduled;
  return (
    <div className="relative bg-[var(--color-card)] border border-[var(--color-border)] rounded-[32px] overflow-hidden">
      <div className="h-1.5 bg-[var(--color-secondary)]" />
      <div className="p-8 md:p-10">
        {s.seatsRemaining && (
          <div className="inline-flex items-center gap-2 bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] px-3 py-1.5 rounded-full text-xs font-bold mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-secondary)] animate-pulse" />
            {s.seatsRemaining}
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
          <InfoRow icon={Calendar} label="التاريخ" value={s.date} />
          <InfoRow icon={Clock} label="الوقت" value={s.time} />
          <InfoRow icon={MapPin} label="المكان" value={s.location} href={s.mapUrl || undefined} />
          <InfoRow icon={Tag} label="السعر" value={s.price} />
        </div>
        <Link
          to={s.ctaHref}
          className="w-full md:w-auto md:inline-flex grid place-items-center h-14 px-8 rounded-2xl bg-[var(--color-fg)] text-[var(--color-bg)] font-bold text-lg transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
        >
          {s.ctaLabel}
        </Link>
      </div>
    </div>
  );
}

function NotScheduled() {
  const n = o.notScheduled;
  return (
    <div className="relative bg-[var(--color-card)] border border-[var(--color-border)] rounded-[32px] overflow-hidden">
      <div className="p-8 md:p-12 text-center">
        <div className="mx-auto grid place-items-center w-16 h-16 rounded-full bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] mb-6">
          <CalendarClock size={28} strokeWidth={1.5} />
        </div>
        <h3
          className="text-2xl md:text-3xl font-bold text-[var(--color-fg)] mb-3"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {n.headline}
        </h3>
        <p className="text-[var(--color-muted)] leading-relaxed max-w-md mx-auto mb-8">
          {n.description}
        </p>
        <a
          href={config.whatsappDetails}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 h-14 px-8 rounded-2xl bg-[#25D366] text-white font-bold text-lg hover:bg-[#1ea856] transition-colors"
        >
          <MessageCircle size={20} strokeWidth={2} />
          {n.ctaLabel}
        </a>
      </div>
    </div>
  );
}

export function OfflineCourse() {
  return (
    <section
      id="offline"
      aria-label={o.eyebrow}
      className="relative py-24 md:py-32 overflow-hidden bg-[var(--color-bg)]"
    >
      <div className="relative max-w-7xl mx-auto px-5 md:px-8">
        <div className="mb-12 md:mb-16">
          <SectionHeading number="07" eyebrow={o.eyebrow} title={o.title} />
        </div>
        <Reveal className="max-w-[800px] mx-auto">
          {o.isScheduled ? <Scheduled /> : <NotScheduled />}
        </Reveal>
      </div>
    </section>
  );
}
