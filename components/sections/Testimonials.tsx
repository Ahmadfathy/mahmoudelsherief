import { useEffect } from "react";
import { MessageCircle, Check } from "lucide-react";
import { testimonialsContent } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";
import { TiltCard } from "@/components/ui/TiltCard";

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}

export function Testimonials() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://www.instagram.com/embed.js";
    script.async = true;
    script.onload = () => window.instgrm?.Embeds.process();
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);



  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-heading"
      className="relative py-24 md:py-32 overflow-hidden bg-[var(--color-subtle)]"
    >

<div className="relative max-w-7xl mx-auto px-5 md:px-8">
        {/* Section number */}
        <div
          aria-hidden
          className="section-number text-[10rem] md:text-[14rem] absolute -top-12 md:-top-20 -start-2 md:-start-4 select-none pointer-events-none leading-none"
        >
          05
        </div>

        {/* Heading */}
        <div className="relative max-w-3xl mb-12 md:mb-16">
          <Reveal>
            <div className="flex items-center gap-3 text-sm font-medium uppercase tracking-[0.2em] text-[var(--color-muted)] mb-5">
              <span className="h-px w-8 bg-[var(--color-fg)]" />
              <span>{testimonialsContent.eyebrow}</span>
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <h2
              id="testimonials-heading"
              className="text-display-md text-[var(--color-fg)] mb-6"
            >
              {testimonialsContent.title.before}{" "}
              <span className="marker-yellow">
                {testimonialsContent.title.highlight}
              </span>{" "}
              {testimonialsContent.title.after}
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="text-lg text-[var(--color-muted)] leading-relaxed">
              {testimonialsContent.brief}
            </p>
          </Reveal>
        </div>

        {/* WhatsApp messages — bento grid */}
        <div className="mb-20">
          <Reveal>
            <div className="flex items-center gap-3 mb-8">
              <span className="grid place-items-center w-10 h-10 rounded-full bg-[#25D366] text-white">
                <MessageCircle size={18} strokeWidth={2} />
              </span>
              <h3
                className="text-2xl font-bold"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {testimonialsContent.imagesHeading}
              </h3>
            </div>
          </Reveal>

          <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
            {testimonialsContent.images.map((img, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <div className="relative rounded-2xl overflow-hidden shadow-md break-inside-avoid border border-[var(--color-border)]">
                  <img
                    src={img.src}
                    alt={img.alt || "Testimonial"}
                    className="w-full h-auto object-cover"
                    loading="lazy"
                  />
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Instagram videos */}
        <div>
          <Reveal>
            <div className="flex items-center gap-3 mb-8">
              <span
                className="grid place-items-center w-10 h-10 rounded-full text-white"
                style={{
                  background:
                    "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </span>
              <h3
                className="text-2xl font-bold"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {testimonialsContent.videosHeading}
              </h3>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonialsContent.videos.map((video, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div className="relative bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl overflow-hidden p-3">
                  <div className="text-xs text-[var(--color-muted)] uppercase tracking-widest mb-2 px-1 tabular flex items-center justify-between">
                    <span>POST {String(i + 1).padStart(2, "0")}</span>
                    <span>@instagram</span>
                  </div>
                  <blockquote
                    className="instagram-media"
                    data-instgrm-permalink={video.permalink}
                    data-instgrm-version="14"
                    style={{
                      background: "transparent",
                      border: 0,
                      margin: 0,
                      maxWidth: "540px",
                      minWidth: "100%",
                      padding: 0,
                      width: "100%",
                    }}
                  >
                    {/* Fallback if embed fails */}
                    <div className="aspect-[9/16] grid place-items-center bg-[var(--color-subtle)] rounded-xl text-center text-[var(--color-muted)] p-4">
                      <div>
                        <div className="text-xs uppercase tracking-widest mb-2">
                          Instagram Post
                        </div>
                        <a
                          href={video.permalink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[var(--color-primary)] underline text-sm"
                        >
                          عرض على إنستجرام
                        </a>
                      </div>
                    </div>
                  </blockquote>
                </div>
              </Reveal>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
