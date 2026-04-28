"use client";

import { motion } from "framer-motion";
import { aboutContent } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";
import { StatCounter } from "@/components/ui/StatCounter";

export function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="relative py-24 md:py-32 overflow-hidden"
    >
      {/* Background decoration */}
      <div
        aria-hidden
        className="absolute top-1/2 -end-40 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-[0.04] blur-3xl bg-[var(--color-primary)] pointer-events-none"
      />

      <div className="relative max-w-7xl mx-auto px-5 md:px-8">
        {/* Section number — magazine style, large outlined */}
        <div
          aria-hidden
          className="section-number text-[10rem] md:text-[14rem] absolute -top-4 md:-top-12 -end-4 md:end-8 select-none pointer-events-none leading-none"
        >
          02
        </div>

        <div className="grid lg:grid-cols-[5fr_7fr] gap-12 lg:gap-16 items-center">
          {/* Text — 40% */}
          <div className="relative">
            <Reveal>
              <div className="flex items-center gap-3 text-sm font-medium uppercase tracking-[0.2em] text-[var(--color-muted)] mb-5">
                <span className="h-px w-8 bg-[var(--color-fg)]" />
                <span>{aboutContent.eyebrow}</span>
              </div>
            </Reveal>

            <Reveal delay={0.05}>
              <h2
                id="about-heading"
                className="text-display-md text-[var(--color-fg)] mb-6"
              >
                {aboutContent.title.before}{" "}
                <span className="marker-yellow">
                  {aboutContent.title.highlight}
                </span>{" "}
                {aboutContent.title.after}
              </h2>
            </Reveal>

            {aboutContent.paragraphs.map((p, i) => (
              <Reveal key={i} delay={0.1 + i * 0.05}>
                <p className="text-base md:text-lg text-[var(--color-muted)] leading-relaxed mb-4">
                  {p}
                </p>
              </Reveal>
            ))}

            {/* Signature line */}
            <Reveal delay={0.3}>
              <div className="mt-8 pt-6 border-t border-dashed border-[var(--color-border)] flex items-center gap-4">
                <span
                  className="text-2xl"
                  style={{ fontFamily: "var(--font-display)", fontStyle: "italic" }}
                >
                  ~ المدرّب
                </span>
                <span className="flex-1 h-px bg-[var(--color-border)]" />
                <span className="text-xs uppercase tracking-widest text-[var(--color-muted)] tabular">
                  Cairo, EG
                </span>
              </div>
            </Reveal>
          </div>

          {/* Stats — 60% */}
          <div className="grid grid-cols-2 gap-4 md:gap-6">
            {aboutContent.stats.map((stat, i) => (
              <Reveal key={i} delay={0.1 + i * 0.08}>
                <div
                  className={`relative bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 md:p-8 hover:border-[var(--color-primary)] transition-colors duration-300 group overflow-hidden
                    ${i === 0 || i === 3 ? "lg:translate-y-4" : ""}
                  `}
                >
                  {/* Crop marks on hover */}
                  <span className="crop-mark-tl opacity-0 group-hover:opacity-30 transition-opacity duration-300" aria-hidden />
                  <span className="crop-mark-tr opacity-0 group-hover:opacity-30 transition-opacity duration-300" aria-hidden />
                  <span className="crop-mark-bl opacity-0 group-hover:opacity-30 transition-opacity duration-300" aria-hidden />
                  <span className="crop-mark-br opacity-0 group-hover:opacity-30 transition-opacity duration-300" aria-hidden />

                  {/* Number index */}
                  <span className="absolute top-3 end-3 text-xs tabular text-[var(--color-muted)] font-bold">
                    0{i + 1}
                  </span>

                  {/* Big number */}
                  <div className="text-number-mega text-[var(--color-primary)] mb-2 tabular leading-none">
                    <StatCounter value={stat.value} suffix={stat.suffix} />
                  </div>

                  {/* Label */}
                  <div className="text-base md:text-lg text-[var(--color-fg)] font-bold mt-3">
                    {stat.label}
                  </div>

                  {/* Animated underline on hover */}
                  <motion.span
                    initial={{ width: "20%" }}
                    whileHover={{ width: "100%" }}
                    className="absolute bottom-0 inset-x-0 h-px bg-[var(--color-primary)]"
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
