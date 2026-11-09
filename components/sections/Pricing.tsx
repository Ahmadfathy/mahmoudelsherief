import { Check, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { pricingContent as p } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Pricing() {
  return (
    <section
      id="pricing"
      aria-label={p.eyebrow}
      className="relative py-24 md:py-32 overflow-hidden bg-gradient-to-b from-[var(--color-bg)] via-[var(--color-secondary)]/[0.03] to-[var(--color-bg)]"
    >
      <div className="relative max-w-7xl mx-auto px-5 md:px-8">
        <div className="mb-12 md:mb-16">
          <SectionHeading
            number="08"
            align="center"
            eyebrow={p.eyebrow}
            title={p.title}
            brief={p.brief}
          />
        </div>

        <Reveal>
          <div className="relative mx-auto max-w-[560px]">
            <div className="relative bg-[var(--color-card)] border-2 border-[var(--color-secondary)]/30 rounded-3xl overflow-hidden shadow-[0_20px_60px_-20px_rgba(161,98,7,0.25)]">
              <div className="bg-[var(--color-secondary)] text-[#1A1A1A] text-center py-3 px-5 text-sm font-bold tracking-wide">
                {p.discountBadge}
              </div>

              <div className="p-8 md:p-10">
                <div className="text-center mb-8">
                  <div className="flex items-baseline justify-center gap-3 mb-2">
                    <span className="text-2xl text-[var(--color-muted)] line-through tabular">
                      {p.originalPrice}
                    </span>
                    <span className="text-xs text-[var(--color-muted)] uppercase tracking-widest">
                      {p.currency}
                    </span>
                  </div>
                  <div className="flex items-baseline justify-center gap-2">
                    <span
                      className="text-6xl md:text-7xl font-bold text-[var(--color-fg)] tabular leading-none"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {p.discountedPrice}
                    </span>
                    <span
                      className="text-2xl font-bold text-[var(--color-fg)]"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {p.currency}
                    </span>
                  </div>
                </div>

                <div className="h-px bg-[var(--color-border)] mb-6" />

                <ul className="space-y-3 mb-8">
                  {p.includes.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="shrink-0 mt-1 grid place-items-center w-5 h-5 rounded-full bg-[var(--color-secondary)]/15 text-[var(--color-secondary)]">
                        <Check size={12} strokeWidth={3} />
                      </span>
                      <span className="text-[var(--color-fg)]">{item}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to={p.ctaHref}
                  className="w-full grid place-items-center h-14 rounded-2xl bg-[var(--color-fg)] text-[var(--color-bg)] font-bold text-lg transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-secondary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-card)]"
                >
                  {p.ctaLabel}
                </Link>

                <div className="mt-6 pt-6 border-t border-dashed border-[var(--color-border)]">
                  <div className="flex items-start gap-3">
                    <span className="shrink-0 grid place-items-center w-10 h-10 rounded-full bg-[var(--color-secondary)]/10 text-[var(--color-secondary)]">
                      <ShieldCheck size={20} strokeWidth={1.75} />
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-2 mb-1">
                        <span className="font-bold text-[var(--color-fg)]">{p.guarantee.title}</span>
                        <span className="text-xs tabular text-[var(--color-secondary)] font-bold">
                          {p.guarantee.duration}
                        </span>
                      </div>
                      <p className="text-sm text-[var(--color-muted)] leading-relaxed">
                        {p.guarantee.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
