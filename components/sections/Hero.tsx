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
      className="relative min-h-[100svh] w-full overflow-hidden bg-black"
    >
      {/* Full-bleed video */}
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

      {/* Bottom scrim */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-1/2 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 100%)",
        }}
      />

      {/* Text overlay */}
      <div className="absolute bottom-24 md:bottom-28 inset-x-0 px-6 md:px-14 lg:px-16 pointer-events-none">
        <div className="max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0, ease: EASE }}
            className="flex items-center gap-3 text-sm tracking-[0.2em] text-[var(--color-secondary)] mb-5"
          >
            <span className="h-px w-8 bg-[var(--color-secondary)]" />
            <span>{heroContent.eyebrow}</span>
          </motion.p>

          <motion.h1
            id="hero-heading"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.15, ease: EASE }}
            className="text-display-xl text-white max-w-[16ch] mb-5"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {heroContent.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
            className="text-xl md:text-2xl text-[#E5E5E5] leading-relaxed max-w-[42ch]"
          >
            {heroContent.subtitle}
          </motion.p>
        </div>
      </div>

      {/* Play / pause toggle */}
      <button
        type="button"
        onClick={handleVideoToggle}
        aria-label={isPlaying ? "إيقاف الفيديو" : "تشغيل الفيديو"}
        className="absolute bottom-6 end-6 z-10 grid place-items-center w-10 h-10 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white hover:bg-white/25 transition-colors"
      >
        {isPlaying ? (
          <Pause size={16} strokeWidth={2} fill="currentColor" />
        ) : (
          <Play size={16} strokeWidth={2} fill="currentColor" className="ms-0.5" />
        )}
      </button>

      {/* Scroll indicator */}
      <a
        href="#about"
        className="absolute bottom-6 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 z-10 flex flex-col items-center gap-1 text-sm text-[var(--color-secondary)]"
      >
        <span>اكتشف الكورس</span>
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden
        >
          <ChevronDown size={18} strokeWidth={2} />
        </motion.span>
      </a>
    </section>
  );
}
