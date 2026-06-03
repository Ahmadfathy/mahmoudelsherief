
import { motion } from "framer-motion";
import { Camera, Sparkles, Aperture } from "lucide-react";
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

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image — Right side in RTL */}
          <Reveal>
            <motion.div 
              className="relative"
              animate={{ y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            >
              {/* Subtle glowing background effect */}
              <motion.div 
                className="absolute top-1/4 left-1/4 right-1/4 bottom-1/4 bg-[var(--color-primary)] rounded-full blur-3xl pointer-events-none"
                animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.1, 0.25, 0.1] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              />
              <img
                src="/logo-preview.png"
                alt="Mahmoud Sherief"
                className="relative z-10 w-full h-auto object-contain"
              />

              {/* Animated Floating Icons */}
              <motion.div
                className="absolute top-[15%] -left-[5%] md:-left-[10%] z-20 text-[var(--color-primary)] opacity-60 backdrop-blur-sm bg-[var(--color-bg)]/40 p-3 rounded-2xl border border-[var(--color-primary)]/20 shadow-lg"
                animate={{ y: [0, -12, 0], rotate: [-5, 5, -5] }}
                transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 0.2 }}
              >
                <Camera size={26} strokeWidth={1.5} />
              </motion.div>

              <motion.div
                className="absolute top-[60%] -right-[5%] md:-right-[8%] z-20 text-[var(--color-fg)] opacity-60 backdrop-blur-sm bg-[var(--color-bg)]/40 p-2.5 rounded-full border border-[var(--color-fg)]/20 shadow-lg"
                animate={{ y: [0, 15, 0], scale: [0.95, 1.05, 0.95], rotate: [0, 45, 0] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 1 }}
              >
                <Aperture size={30} strokeWidth={1.5} />
              </motion.div>

              <motion.div
                className="absolute bottom-[10%] left-[15%] md:left-[5%] z-20 text-[var(--color-primary)] opacity-50 backdrop-blur-sm bg-[var(--color-bg)]/40 p-2 rounded-xl border border-[var(--color-primary)]/20 shadow-lg"
                animate={{ y: [0, -8, 0], rotate: [0, 15, 0] }}
                transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut", delay: 0.5 }}
              >
                <Sparkles size={22} strokeWidth={1.5} />
              </motion.div>
            </motion.div>
          </Reveal>

          {/* Text — Left side in RTL */}
          <div className="relative">
            <Reveal delay={0.1}>
              <div className="flex items-center gap-3 text-sm font-medium uppercase tracking-[0.2em] text-[var(--color-muted)] mb-5">
                <span className="h-px w-8 bg-[var(--color-fg)]" />
                <span>{aboutContent.eyebrow}</span>
              </div>
            </Reveal>

            <Reveal delay={0.15}>
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
              <Reveal key={i} delay={0.2 + i * 0.05}>
                <p className="text-base md:text-lg text-[var(--color-muted)] leading-relaxed mb-4">
                  {p}
                </p>
              </Reveal>
            ))}

            {/* Signature line */}
            <Reveal delay={0.4}>
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
        </div>
      </div>
    </section>
  );
}
