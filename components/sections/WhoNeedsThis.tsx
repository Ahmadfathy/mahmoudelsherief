import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

/**
 * Placeholder images from picsum.photos — each seed produces a consistent image.
 *
 * TO REPLACE WITH REAL PIXABAY IMAGES:
 * 1. Visit https://pixabay.com and search for an image matching each persona (suggested keywords in comments).
 * 2. Copy the direct image URL (right-click image → Copy image address), which looks like:
 *    https://cdn.pixabay.com/photo/YYYY/MM/DD/HH/MM/filename_1280.jpg
 * 3. Replace the picsum URL below with the Pixabay URL. Keep the 4:5 aspect ratio in mind
 *    (ideally an image that's taller than wide looks best in this slot).
 *
 * `perItem` is indexed in the same order as `audienceContent.items`.
 * The 6th entry is reserved for a future "عايز يتحول للاحتراف" persona.
 */
const personaImages = {
  // Default — shows when no persona is hovered. Suggested Pixabay search: "mobile photography" or "smartphone camera"
  default: "https://picsum.photos/seed/sherief-audience-default/800/1000",
  perItem: [
    // 01 — صاحب موبايل عايز يستفيد منه. Pixabay search: "smartphone hand"
    "https://picsum.photos/seed/sherief-audience-1/800/1000",
    // 02 — مبتدئ في التصوير. Pixabay search: "beginner photographer" or "learning camera"
    "https://picsum.photos/seed/sherief-audience-2/800/1000",
    // 03 — صاحب محتوى سوشيال ميديا. Pixabay search: "content creator instagram" or "social media"
    "https://picsum.photos/seed/sherief-audience-3/800/1000",
    // 04 — صاحب مشروع صغير. Pixabay search: "small business owner" or "handmade product photo"
    "https://picsum.photos/seed/sherief-audience-4/800/1000",
    // 05 — توثيق ذكريات. Pixabay search: "family memories" or "candid moment"
    "https://picsum.photos/seed/sherief-audience-5/800/1000",
    // 06 — عايز يتحول للاحتراف. Pixabay search: "professional photographer" or "portfolio shoot"
    "https://picsum.photos/seed/sherief-audience-6/800/1000",
  ],
};

export function WhoNeedsThis() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const currentImageSrc =
    hoveredIndex === null
      ? personaImages.default
      : personaImages.perItem[hoveredIndex] ?? personaImages.default;

  // Preload all images so hover swaps don't flash
  useEffect(() => {
    [personaImages.default, ...personaImages.perItem].forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  return (
    <section
      id="audience"
      aria-labelledby="audience-heading"
      className="relative py-24 md:py-32 overflow-hidden bg-[var(--color-bg)]"
    >
      <div className="relative max-w-7xl mx-auto px-5 md:px-8">
        {/* Section number */}
        <div
          aria-hidden
          className="section-number text-[10rem] md:text-[14rem] absolute -top-12 md:-top-20 -end-2 md:-end-4 select-none pointer-events-none leading-none"
        >
          03
        </div>

        {/* Heading */}
        <div className="relative max-w-3xl">
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

        {/* Split layout */}
        <div className="relative grid lg:grid-cols-[minmax(0,6fr)_minmax(0,6fr)] gap-10 lg:gap-14 mt-12 md:mt-16">
          {/* RIGHT column in RTL — stacked persona boxes */}
          <div className="flex flex-col gap-3">
            {audienceContent.items.map((item, i) => {
              const Icon = iconMap[item.icon as keyof typeof iconMap];
              const isActive = hoveredIndex === i;
              return (
                <Reveal key={i} delay={i * 0.05}>
                  <button
                    type="button"
                    onMouseEnter={() => setHoveredIndex(i)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    onFocus={() => setHoveredIndex(i)}
                    onBlur={() => setHoveredIndex(null)}
                    className={`group relative w-full flex items-start gap-4 text-start p-5 md:p-6 rounded-2xl md:rounded-3xl border transition-all duration-300 ${
                      isActive
                        ? "bg-[var(--color-card)] border-[var(--color-secondary)] shadow-[0_10px_30px_-10px_rgba(196,113,55,0.25)]"
                        : "bg-[color-mix(in_srgb,var(--color-card)_60%,transparent)] border-[var(--color-border)] hover:border-[var(--color-fg)]/30"
                    }`}
                  >
                    {/* Index */}
                    <span
                      className={`shrink-0 text-xs tabular font-bold mt-1 transition-colors duration-300 ${
                        isActive
                          ? "text-[var(--color-secondary)]"
                          : "text-[var(--color-muted)]"
                      }`}
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      0{i + 1}
                    </span>

                    {/* Icon */}
                    <span
                      className={`shrink-0 grid place-items-center w-10 h-10 md:w-11 md:h-11 rounded-xl transition-colors duration-300 ${
                        isActive
                          ? "bg-[var(--color-secondary)] text-white"
                          : "bg-[var(--color-subtle)] text-[var(--color-fg)]"
                      }`}
                    >
                      {Icon && <Icon size={20} strokeWidth={1.75} />}
                    </span>

                    {/* Text */}
                    <span className="flex-1 min-w-0">
                      <span
                        className="block text-base md:text-lg font-bold text-[var(--color-fg)] mb-0.5"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {item.title}
                      </span>
                      <span className="block text-sm text-[var(--color-muted)] leading-relaxed">
                        {item.description}
                      </span>
                    </span>
                  </button>
                </Reveal>
              );
            })}
          </div>

          {/* LEFT column in RTL — sticky image panel (desktop only) */}
          <div className="hidden lg:block">
            <div className="sticky top-28">
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-[var(--color-border)] bg-[var(--color-card)] shadow-[0_20px_50px_-20px_rgba(44,54,57,0.3)]">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImageSrc}
                    src={currentImageSrc}
                    alt=""
                    aria-hidden="true"
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </AnimatePresence>

                {/* Bottom gradient for depth */}
                <div
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"
                />

                {/* Active persona label */}
                <AnimatePresence>
                  {hoveredIndex !== null && (
                    <motion.div
                      key="persona-label"
                      aria-hidden
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.3 }}
                      className="absolute bottom-5 start-5 bg-[var(--color-card)]/95 backdrop-blur-sm text-[var(--color-fg)] px-4 py-2 rounded-full text-sm font-bold border border-[var(--color-border)]"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {audienceContent.items[hoveredIndex]?.title}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
