"use client";

import { useEffect } from "react";
import Script from "next/script";
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
  // Process Instagram embeds when available
  useEffect(() => {
    if (typeof window !== "undefined" && window.instgrm) {
      window.instgrm.Embeds.process();
    }
  }, []);

  const whatsappChats = [
    {
      name: "سارة محمود",
      avatar: "س",
      avatarColor: "#7c3aed",
      time: "10:43 ص",
      messages: [
        { text: "والله يا أستاذ الكورس دا غيّر طريقة تصويري ١٨٠ درجة 🔥", fromMe: false },
        { text: "شغلي على إنستجرام دلوقتي مختلف تماماً", fromMe: false },
        { text: "الحمد لله 🙏 ده اللي بنشتغل عشانه", fromMe: true },
      ],
    },
    {
      name: "أحمد خالد",
      avatar: "أ",
      avatarColor: "#0ea5e9",
      time: "2:15 م",
      messages: [
        { text: "أحسن استثمار عملته في تطوير نفسي بجد", fromMe: false },
        { text: "رجعت اشتريت كاميرا بعد ما خلصت الكورس 😄", fromMe: false },
        { text: "ماشاء الله تبارك الله 💪", fromMe: true },
      ],
    },
    {
      name: "نورا حسن",
      avatar: "ن",
      avatarColor: "#f59e0b",
      time: "9:05 م",
      messages: [
        { text: "مدرّب صبور وشرح بسيط جداً ❤️", fromMe: false },
        { text: "تعلمت الـ Lightroom من الصفر وبقيت بيديت وحدي", fromMe: false },
        { text: "ربنا يوفقك يا نورا 🌟", fromMe: true },
      ],
    },
    {
      name: "محمد علي",
      avatar: "م",
      avatarColor: "#10b981",
      time: "11:58 ص",
      messages: [
        { text: "بعد الكورس بدأت أبيع صوري وأشتغل freelance 🎉", fromMe: false },
        { text: "تجربة قلبت حياتي فعلاً", fromMe: false },
        { text: "ده أجمل كلام بسمعه 🙏", fromMe: true },
      ],
    },
    {
      name: "ياسمين رمزي",
      avatar: "ي",
      avatarColor: "#ec4899",
      time: "4:30 م",
      messages: [
        { text: "الكورس practical جداً ومحتاره على نفسي 😂", fromMe: false },
        { text: "Worth every penny بجد", fromMe: false },
        { text: "يسعدنا يا ياسمين 💛", fromMe: true },
      ],
    },
    {
      name: "ليلى أحمد",
      avatar: "ل",
      avatarColor: "#ef4444",
      time: "7:22 م",
      messages: [
        { text: "تعلمت حاجات في الـ Lightroom مكنتش متخيلة الموبايل يعملها!", fromMe: false },
        { text: "الحمد لله كتير 🎨", fromMe: true },
      ],
    },
  ];

  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-heading"
      className="relative py-24 md:py-32 overflow-hidden bg-[var(--color-subtle)]"
    >
      <Script
        src="https://www.instagram.com/embed.js"
        strategy="lazyOnload"
        onLoad={() => {
          if (typeof window !== "undefined" && window.instgrm) {
            window.instgrm.Embeds.process();
          }
        }}
      />

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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {whatsappChats.map((chat, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <TiltCard className="h-full">
                  {/* WhatsApp chat window */}
                  <div className="rounded-2xl overflow-hidden border border-[var(--color-border)] shadow-md h-full flex flex-col" dir="ltr">
                    {/* Header bar */}
                    <div className="flex items-center gap-3 px-4 py-3" style={{ background: "#075E54" }}>
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                        style={{ background: chat.avatarColor }}
                      >
                        {chat.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-semibold leading-tight truncate">{chat.name}</p>
                        <p className="text-[#25D366] text-xs">online</p>
                      </div>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="white" opacity={0.7} aria-hidden>
                        <circle cx="5" cy="12" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="19" cy="12" r="1.5" />
                      </svg>
                    </div>

                    {/* Chat body */}
                    <div className="flex-1 px-3 py-4 space-y-2 text-sm" style={{ background: "#ECE5DD" }}>
                      {/* Date chip */}
                      <div className="flex justify-center mb-3">
                        <span className="bg-white/80 text-gray-500 text-[10px] px-3 py-0.5 rounded-full">اليوم</span>
                      </div>

                      {chat.messages.map((msg, j) => (
                        <div key={j} className={`flex ${msg.fromMe ? "justify-end" : "justify-start"}`}>
                          <div
                            className="relative max-w-[80%] rounded-xl px-3 py-2 shadow-sm"
                            style={{
                              background: msg.fromMe ? "#DCF8C6" : "#FFFFFF",
                              borderBottomRightRadius: msg.fromMe ? "2px" : undefined,
                              borderBottomLeftRadius: !msg.fromMe ? "2px" : undefined,
                            }}
                          >
                            <p className="text-gray-800 leading-snug" style={{ direction: "rtl" }}>{msg.text}</p>
                            <div className={`flex items-center gap-1 mt-0.5 ${msg.fromMe ? "justify-end" : "justify-start"}`}>
                              <span className="text-[10px] text-gray-400">{chat.time}</span>
                              {msg.fromMe && (
                                <span className="text-[#34B7F1]">
                                  <Check size={12} strokeWidth={2.5} className="inline -mr-1" />
                                  <Check size={12} strokeWidth={2.5} className="inline" />
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Input bar (decorative) */}
                    <div className="flex items-center gap-2 px-3 py-2 bg-[#F0F0F0] border-t border-gray-200">
                      <div className="flex-1 bg-white rounded-full px-4 py-1.5 text-xs text-gray-300">اكتب رسالة...</div>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "#25D366" }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="white" aria-hidden>
                          <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </TiltCard>
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
