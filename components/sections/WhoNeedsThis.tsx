import { useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  type TargetAndTransition,
} from "framer-motion";
import {
  Smartphone,
  Camera,
  Instagram,
  Briefcase,
  Heart,
  ShoppingBag,
} from "lucide-react";
import { audienceContent } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";

const iconMap = {
  Smartphone,
  Camera,
  Instagram,
  Briefcase,
  Heart,
  ShoppingBag,
};

// Per-icon hover personality — triggered by hovering/focusing anywhere on the box
const iconHover: Record<string, TargetAndTransition> = {
  Camera: { rotate: [0, -8, 8, 0], transition: { duration: 0.4, ease: "easeInOut" } },
  Smartphone: { rotate: [0, 10, -5, 0], scale: 1.05, transition: { duration: 0.5, ease: "easeInOut" } },
  Instagram: { scale: [1, 1.15, 1], rotate: [0, 8, 0], transition: { duration: 0.5, ease: "easeInOut" } },
  Briefcase: { y: [0, -3, 0], transition: { duration: 0.3, ease: "easeInOut" } },
  Heart: { scale: [1, 1.2, 1], transition: { duration: 0.5, ease: "easeInOut" } },
  ShoppingBag: { y: [0, -4, 0], rotate: [0, -6, 0], transition: { duration: 0.4, ease: "easeInOut" } },
};

/**
 * Placeholder images from picsum.photos — each seed produces a consistent image.
 *
 * TO REPLACE WITH REAL PIXABAY IMAGES:
 * 1. Visit https://pixabay.com and search for an image matching each persona (suggested keywords in comments).
 * 2. Copy the direct image URL (right-click image → Copy image address), which looks like:
 *    https://cdn.pixabay.com/photo/YYYY/MM/DD/HH/MM/filename_1280.jpg
 * 3. Replace the picsum URL below with the Pixabay URL. The panel stretches to the height of
 *    the card stack (object-cover crops it), so a portrait image that's taller than wide fits best.
 *
 * `perItem` is indexed in the same order as `audienceContent.items`.
 */
const personaImages = {
  // Default — shows when no persona is hovered. Suggested Pixabay search: "mobile photography" or "smartphone camera"
  default: "https://picsum.photos/seed/sherief-audience-default/800/1000",
  perItem: [
    // 01 — بتبيع منتجات أون لاين. Pixabay search: "ecommerce product photography flat lay"
    "https://picsum.photos/seed/sherief-audience-ecommerce/800/1000",
    // 02 — صاحب محتوى سوشيال ميديا. Pixabay search: "content creator phone"
    "https://picsum.photos/seed/sherief-audience-social/800/1000",
    // 03 — صاحب مشروع صغير. Pixabay search: "small business owner handmade"
    "https://picsum.photos/seed/sherief-audience-business/800/1000",
    // 04 — مبتدئ في التصوير. Pixabay search: "beginner photographer learning"
    "https://picsum.photos/seed/sherief-audience-beginner/800/1000",
    // 05 — صاحب موبايل. Pixabay search: "smartphone photography hand"
    "https://picsum.photos/seed/sherief-audience-phone/800/1000",
    // 06 — بتوثق ذكرياتك. Pixabay search: "family candid memories"
    "https://picsum.photos/seed/sherief-audience-memories/800/1000",
  ],
};

export function WhoNeedsThis() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const reduceMotion = useReducedMotion();

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
        <div className="relative grid lg:grid-cols-[minmax(0,6fr)_minmax(0,6fr)] items-stretch gap-10 lg:gap-14 mt-12 md:mt-16">
          {/* RIGHT column in RTL — stacked persona boxes */}
          <div className="flex flex-col gap-3">
            {audienceContent.items.map((item, i) => {
              const Icon = iconMap[item.icon as keyof typeof iconMap];
              const isActive = hoveredIndex === i;
              return (
                <Reveal key={i} delay={i * 0.05}>
                  <motion.button
                    type="button"
                    whileHover="hover"
                    whileFocus="hover"
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
                      <motion.span
                        className="inline-flex"
                        variants={reduceMotion ? undefined : { hover: iconHover[item.icon] }}
                        initial={{ scale: 0.8, opacity: 0 }}
                        whileInView={{
                          scale: 1,
                          opacity: 1,
                          rotate: 0,
                          y: 0,
                          transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1], rotate: { duration: 0 } },
                        }}
                        viewport={{ once: true, margin: "-50px" }}
                      >
                        {Icon && <Icon size={20} strokeWidth={1.75} />}
                      </motion.span>
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
                  </motion.button>
                </Reveal>
              );
            })}
          </div>

          {/* LEFT column in RTL — image panel (desktop only), stretched to the card stack's height */}
          <div className="hidden lg:block h-full">
            <div className="h-full">
              <div className="relative w-full h-full min-h-[500px] rounded-3xl overflow-hidden border border-[var(--color-border)] bg-[var(--color-card)] shadow-[0_20px_50px_-20px_rgba(44,54,57,0.3)]">
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
