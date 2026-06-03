
import {
  Smartphone,
  Camera,
  Instagram,
  Briefcase,
  Heart,
  TrendingUp,
} from "lucide-react";
import { audienceContent } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";

const iconMap = {
  Smartphone,
  Camera,
  Instagram,
  Briefcase,
  Heart,
  TrendingUp,
};

export function WhoNeedsThis() {
  return (
    <section
      id="audience"
      aria-labelledby="audience-heading"
      className="relative py-24 md:py-32 overflow-hidden"
    >
      <div className="relative max-w-7xl mx-auto px-5 md:px-8">
        {/* Section number */}
        <div
          aria-hidden
          className="section-number text-[10rem] md:text-[14rem] absolute -top-12 md:-top-20 -end-2 md:-end-4 select-none pointer-events-none leading-none"
        >
          04
        </div>

        {/* Heading */}
        <div className="relative max-w-3xl mb-12 md:mb-16">
          <Reveal>
            <div className="flex items-center gap-3 text-sm font-medium uppercase tracking-[0.2em] text-[var(--color-muted)] mb-5">
              <span className="h-px w-8 bg-[var(--color-fg)]" />
              <span>{audienceContent.eyebrow}</span>
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <h2
              id="audience-heading"
              className="text-display-md text-[var(--color-fg)]"
            >
              {audienceContent.title.before}{" "}
              <span className="marker-yellow">
                {audienceContent.title.highlight}
              </span>{" "}
              {audienceContent.title.after}
            </h2>
          </Reveal>
        </div>

        {/* Cards grid */}
        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
          {audienceContent.items.map((item, i) => {
            const Icon = iconMap[item.icon as keyof typeof iconMap];
            return (
              <Reveal key={i} delay={i * 0.05}>
                <div
                  className="group relative bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 md:p-7 hover:border-[var(--color-primary)] hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                >
                  {/* Index number — top-end corner */}
                  <span
                    className="absolute top-4 end-5 text-3xl tabular text-[var(--color-muted)]/30 font-bold"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    0{i + 1}
                  </span>

                  {/* Yellow accent bar — appears on hover */}
                  <span className="absolute top-0 inset-x-0 h-1 bg-[var(--color-secondary)] origin-start scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />

                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="shrink-0 grid place-items-center w-12 h-12 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] group-hover:bg-[var(--color-primary)] group-hover:text-white transition-colors duration-300">
                      <Icon size={22} strokeWidth={1.75} />
                    </div>

                    <div className="flex-1 min-w-0 pe-8">
                      <h3
                        className="text-lg md:text-xl font-bold mb-2 leading-snug"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {item.title}
                      </h3>
                      <p className="text-[var(--color-muted)] leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
