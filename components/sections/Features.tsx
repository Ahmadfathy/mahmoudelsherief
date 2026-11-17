import { motion, useReducedMotion, type TargetAndTransition } from "framer-motion";
import { Download, Infinity, RefreshCw, MessageSquare, Calendar } from "lucide-react";
import { featuresContent } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const iconMap = { Download, Infinity, RefreshCw, MessageSquare, Calendar };

// Per-icon hover personality — triggered by hovering anywhere on the card
const iconHover: Record<string, TargetAndTransition> = {
  Download: { y: [0, 3, 0], transition: { duration: 0.4, ease: "easeInOut" } },
  Infinity: { rotate: [0, 180, 360], transition: { duration: 0.8, ease: "easeInOut" } },
  RefreshCw: { rotate: 360, transition: { duration: 0.6, ease: "easeInOut" } },
  MessageSquare: { scale: [1, 1.1, 1], rotate: [0, -5, 5, 0], transition: { duration: 0.5, ease: "easeInOut" } },
  Calendar: { rotate: [0, -3, 3, 0], transition: { duration: 0.4, ease: "easeInOut" } },
};

export function Features() {
  const reduceMotion = useReducedMotion();

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
                ? "lg:col-span-3"
                : "lg:col-span-3";
            const last = i === featuresContent.items.length - 1 ? "md:col-span-2" : "";
            return (
              <Reveal key={i} delay={i * 0.06} className={`${span} ${last}`}>
                <motion.div
                  whileHover="hover"
                  className="h-full bg-[var(--color-card)] border border-[var(--color-border)] rounded-3xl p-6 md:p-7 transition-all duration-300 hover:border-[var(--color-secondary)]/40 hover:-translate-y-1 hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]"
                >
                  <div className="w-12 h-12 rounded-full bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] grid place-items-center">
                    <motion.span
                      className="inline-flex"
                      variants={reduceMotion ? undefined : { hover: iconHover[item.icon] }}
                      initial={{ scale: 0.8, opacity: 0 }}
                      whileInView={{
                        scale: 1,
                        opacity: 1,
                        rotate: 0,
                        y: 0,
                        // rotate snaps back (360° ≡ 0°) so spins don't unwind on mouse-leave
                        transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1], rotate: { duration: 0 } },
                      }}
                      viewport={{ once: true, margin: "-50px" }}
                    >
                      {Icon && <Icon size={22} strokeWidth={1.75} />}
                    </motion.span>
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
                </motion.div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
