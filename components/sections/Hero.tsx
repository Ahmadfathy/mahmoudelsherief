import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Pause, ChevronDown } from "lucide-react";
import { heroContent } from "@/lib/content";
import { config } from "@/lib/config";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    return () => {
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
    };
  }, []);

  function handleVideoToggle() {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.muted = false;
      v.play();
    } else {
      v.pause();
    }
  }

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

        {/* Contained video */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45, ease: EASE }}
          className="relative max-w-5xl mx-auto aspect-video rounded-3xl md:rounded-[32px] overflow-hidden shadow-2xl shadow-black/15 border border-[var(--color-border)] bg-black"
        >
          <video
            ref={videoRef}
            src={config.heroVideo}
            poster={config.heroPoster}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Center play / pause toggle */}
          <button
            type="button"
            onClick={handleVideoToggle}
            aria-label={isPlaying ? "إيقاف الفيديو" : "تشغيل الفيديو"}
            className="absolute inset-0 grid place-items-center group z-10"
          >
            <span
              className={`relative grid place-items-center w-20 h-20 transition-opacity duration-300 ${
                isPlaying ? "opacity-0 group-hover:opacity-100" : "opacity-100"
              }`}
            >
              {!isPlaying && (
                <span
                  aria-hidden
                  className="absolute inset-0 rounded-full bg-[var(--color-secondary)] animate-ping opacity-30"
                />
              )}
              <span className="relative grid place-items-center w-20 h-20 rounded-full bg-[var(--color-secondary)] text-[#1A1A1A] shadow-2xl group-hover:scale-110 transition-transform duration-300">
                {isPlaying ? (
                  <Pause size={26} strokeWidth={2} fill="currentColor" />
                ) : (
                  <Play size={28} strokeWidth={2} fill="currentColor" className="ms-1" />
                )}
              </span>
            </span>
          </button>
        </motion.div>

        {/* Scroll indicator */}
        <a
          href="#course"
          className="mt-10 md:mt-14 inline-flex flex-col items-center gap-1 text-sm tracking-[0.2em] text-[var(--color-secondary)]"
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
