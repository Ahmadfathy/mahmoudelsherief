import { useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronDown, ArrowLeft, MapPin } from "lucide-react";
import Plyr, { type APITypes, type PlyrProps } from "plyr-react";
import "plyr-react/plyr.css";
import { heroContent } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";
import { config } from "@/lib/config";

const EASE = [0.16, 1, 0.3, 1] as const;

// Module-scope so Plyr doesn't re-initialise on every render
const PLYR_SOURCE: PlyrProps["source"] = {
  type: "video",
  poster: config.heroPoster,
  sources: [{ src: config.heroVideo, type: "video/mp4" }],
};

const PLYR_OPTIONS: PlyrProps["options"] = {
  controls: [
    "play-large",
    "play",
    "progress",
    "current-time",
    "duration",
    "mute",
    "volume",
    "captions",
    "settings",
    "pip",
    "airplay",
    "fullscreen",
  ],
  settings: ["captions", "quality", "speed"],
  speed: { selected: 1, options: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2] },
  autoplay: false,
  loop: { active: false },
  muted: false,
  hideControls: true,
  ratio: "16:9",
  keyboard: { focused: true, global: false },
  tooltips: { controls: true, seek: true },
  invertTime: false,
};

export function Hero() {
  const videoRef = useRef<APITypes>(null);

  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="relative pt-28 md:pt-32 pb-16 md:pb-24 bg-[var(--color-bg)]"
    >
      <div className="max-w-7xl mx-auto px-5 md:px-8 text-center">
        {/* Eyebrow */}
        {/* <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0, ease: EASE }}
          className="flex items-center justify-center gap-3 text-sm tracking-[0.2em] text-[var(--color-secondary)] mb-6"
        >
          <span className="h-px w-8 bg-[var(--color-secondary)]" />
          <span>{heroContent.eyebrow}</span>
          <span className="h-px w-8 bg-[var(--color-secondary)]" />
        </motion.p> */}

        {/* Title */}
        <motion.h1
          id="hero-heading"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.15, ease: EASE }}
          className="text-display-md text-[var(--color-fg)] max-w-4xl mx-auto mb-5 md:mb-6"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {heroContent.title}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
          className="text-sm md:text-xl text-[var(--color-muted)] leading-relaxed max-w-[48ch] mx-auto mb-10 md:mb-14"
        >
          {heroContent.subtitle}
        </motion.p>

        {/* Plyr video player */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45, ease: EASE }}
          dir="ltr"
          className="relative max-w-5xl mx-auto aspect-video rounded-3xl md:rounded-[32px] overflow-hidden shadow-2xl shadow-black/15 border border-[var(--color-border)] bg-black text-start"
        >
          <Plyr ref={videoRef} source={PLYR_SOURCE} options={PLYR_OPTIONS} />
        </motion.div>

        {/* Primary CTA */}
        <Reveal delay={0.6}>
          <div className="mt-10 md:mt-12 flex flex-wrap items-center justify-center gap-3 md:gap-4">
            <Link
              to="/payment"
              className="inline-flex items-center gap-3 h-14 px-10 rounded-2xl bg-[var(--color-fg)] text-[var(--color-bg)] font-bold text-lg transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-secondary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] shadow-[0_15px_40px_-15px_rgba(44,54,57,0.4)]"
            >
              اشترك الآن
              <ArrowLeft size={20} strokeWidth={2.5} />
            </Link>

            {/* Secondary — scrolls to the Offline section */}
            <a
              href="#offline"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("offline")?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className="inline-flex items-center gap-2 h-14 px-8 rounded-2xl border-2 border-[var(--color-fg)] text-[var(--color-fg)] font-bold text-base md:text-lg transition-colors duration-200 hover:bg-[var(--color-fg)] hover:text-[var(--color-bg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-secondary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]"
            >
              <MapPin size={18} strokeWidth={2} />
              بتحب الكورس حضوري؟
            </a>
          </div>
        </Reveal>

        {/* Scroll indicator */}
        <a
          href="#course"
          className="mt-8 md:mt-10 inline-flex flex-col items-center gap-1 text-sm tracking-[0.2em] text-[var(--color-secondary)]"
        >
          <span>اكتشف الكورس</span>
          <motion.span
            aria-hidden
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown size={18} strokeWidth={2} />
          </motion.span>
        </a>
      </div>
    </section>
  );
}
