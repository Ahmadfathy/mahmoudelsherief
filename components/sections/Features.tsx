import { Download, Infinity, RefreshCw, MessageSquare, Calendar } from "lucide-react";
import { featuresContent } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const iconMap = { Download, Infinity, RefreshCw, MessageSquare, Calendar };

export function Features() {
  return (
    <section
      id="features"
      aria-label={featuresContent.eyebrow}
      className="relative py-24 md:py-32 overflow-hidden bg-[var(--color-bg)]"
    >
      <div className="relative max-w-7xl mx-auto px-5 md:px-8">
        <div className="mb-12 md:mb-16">
          <SectionHeading
            number="05"
            eyebrow={featuresContent.eyebrow}
            title={featuresContent.title}
            brief={featuresContent.brief}
          />
        </div>

        {/* 6-col grid: items 1-3 span 2 (3 per row), items 4-5 span 3 (2 per row) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-5 md:gap-7">
          {featuresContent.items.map((item, i) => {
            const Icon = iconMap[item.icon as keyof typeof iconMap];
            const span =
              i < 3
                ? "lg:col-span-2"
                : "lg:col-span-3";
            const last = i === featuresContent.items.length - 1 ? "md:col-span-2" : "";
            return (
              <Reveal key={i} delay={i * 0.06} className={`${span} ${last}`}>
                <div className="h-full bg-[var(--color-card)] border border-[var(--color-border)] rounded-3xl p-6 md:p-7 transition-all duration-300 hover:border-[var(--color-secondary)]/40 hover:-translate-y-1 hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]">
                  <div className="w-12 h-12 rounded-full bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] grid place-items-center">
                    <Icon size={22} strokeWidth={1.75} />
                  </div>
                  <h3
                    className="text-xl font-bold mt-5 mb-2"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {item.title}
                  </h3>
                  <p className="text-[var(--color-muted)] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
