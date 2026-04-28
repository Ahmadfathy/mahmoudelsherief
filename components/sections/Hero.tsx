"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Pause } from "lucide-react";
import { heroContent } from "@/lib/content";
import { config } from "@/lib/config";
import { Button } from "@/components/ui/Button";

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
      className="relative min-h-[100svh] overflow-hidden"
    >
      <div className="grid lg:grid-cols-2 min-h-[100svh]">

        {/* ── VIDEO COLUMN ── */}
        <div className="relative order-1 lg:order-2 h-[56vw] lg:h-auto min-h-[300px] bg-[var(--color-subtle)]">
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

          {/* Play / Pause toggle overlay */}
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
                <span className="absolute inset-0 rounded-full bg-[var(--color-secondary)] animate-ping opacity-30" aria-hidden />
              )}
              <span className="relative grid place-items-center w-20 h-20 rounded-full bg-[var(--color-secondary)] text-[#1A1A1A] shadow-2xl group-hover:scale-110 transition-transform duration-300">
                {isPlaying
                  ? <Pause size={26} strokeWidth={2} fill="currentColor" />
                  : <Play size={28} strokeWidth={2} fill="currentColor" className="ms-1" />
                }
              </span>
            </span>
          </button>

          {/* REC badge */}
          <div className="absolute top-6 end-6 z-20 flex items-center gap-2 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full font-bold tabular uppercase tracking-widest pointer-events-none">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B3B] animate-pulse" />
            REC
          </div>

          {/* Vertical accent text */}
          <div
            className="hidden lg:block absolute bottom-8 end-5 z-20 text-[9px] uppercase tracking-[0.45em] text-white/40 select-none pointer-events-none"
            style={{ writingMode: "vertical-rl" }}
            aria-hidden
          >
            SHOT ON MOBILE · 2025
          </div>
        </div>

        {/* ── TEXT COLUMN ── */}
        <div className="relative order-2 lg:order-1 flex flex-col justify-center px-8 md:px-14 lg:px-16 py-28 lg:py-20 bg-[var(--color-bg)]">

          {/* Warm tinted background */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 110% 0%, color-mix(in srgb, var(--color-secondary) 18%, transparent) 0%, transparent 70%), radial-gradient(ellipse 60% 50% at -10% 100%, color-mix(in srgb, var(--color-primary) 8%, transparent) 0%, transparent 70%)",
            }}
          />

          <div className="relative max-w-xl">
            {/* Eyebrow */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-[var(--color-muted)] mb-8"
            >
              <span>📸</span>
              <span>{heroContent.eyebrow}</span>
            </motion.p>

            {/* Giant headline */}
            <h1
              id="hero-heading"
              className="leading-[0.9] tracking-tight mb-10"
              style={{ fontFamily: "var(--font-display)" }}
            >
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="block text-[clamp(2.8rem,5.5vw,5rem)] font-black text-[var(--color-fg)]"
              >
                {heroContent.title.before}
              </motion.span>

              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="block text-[clamp(3rem,6vw,5.5rem)] font-black text-[var(--color-primary)] relative"
              >
                {heroContent.title.highlight}
                {/* Floating camera bubble */}
                <span
                  className="absolute -top-5 -start-6 w-14 h-14 bg-[var(--color-secondary)] rounded-2xl grid place-items-center shadow-lg -rotate-6 hidden lg:grid select-none"
                  aria-hidden
                >
                  <span className="text-2xl">📷</span>
                </span>
              </motion.span>

              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="block text-[clamp(2rem,4.5vw,4rem)] font-black text-[var(--color-muted)]"
              >
                {heroContent.title.after}
              </motion.span>
            </h1>

            {/* Brief */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.42 }}
              className="text-lg text-[var(--color-muted)] leading-relaxed mb-8"
            >
              {heroContent.brief}
            </motion.p>

            {/* Price block — above buttons */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex items-baseline gap-4 mb-8"
            >
              <div className="flex items-baseline gap-2">
                <span className="text-number-mega text-[var(--color-primary)]">
                  {heroContent.discountedPrice}
                </span>
                <span
                  className="text-xl font-bold text-[var(--color-primary)]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {heroContent.currency}
                </span>
              </div>
              <span className="text-xl text-[var(--color-muted)] line-through tabular">
                {heroContent.originalPrice}
              </span>
              <span className="bg-[var(--color-secondary)] text-[#1A1A1A] text-xs font-bold px-2 py-1 rounded-full tabular">
                خصم %43
              </span>
            </motion.div>

            {/* CTAs — original Button components */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.58 }}
              className="flex flex-wrap items-center gap-3"
            >
              <Button href="/payment" variant="primary" size="lg" magnetic>
                {heroContent.ctaPrimary}
              </Button>
              <Button href={config.whatsappDetails} variant="outline" size="lg" external>
                {heroContent.ctaSecondary}
              </Button>
            </motion.div>

            {/* Trust micro-line */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="mt-8 flex items-center gap-3 text-sm text-[var(--color-muted)]"
            >
              <div className="flex -space-x-2 rtl:space-x-reverse">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-7 h-7 rounded-full border-2 border-[var(--color-bg)]"
                    style={{
                      background: `linear-gradient(135deg, var(--color-primary) ${i * 20}%, var(--color-secondary))`,
                    }}
                  />
                ))}
              </div>
              <span>+500 طالب التحقوا بالكورس</span>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
