
import { Phone, MessageCircle, Mail, Facebook, Instagram, ArrowLeft } from "lucide-react";
import { contactContent } from "@/lib/content";
import { config } from "@/lib/config";
import { Reveal } from "@/components/ui/Reveal";

const iconMap = {
  Phone,
  MessageCircle,
  Mail,
};

function TikTokIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
  );
}

export function Contact() {
  const buttonHrefs: Record<string, string> = {
    phone: config.tel,
    whatsapp: config.whatsappContact,
    email: config.mailto,
  };

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative py-24 md:py-32 overflow-hidden"
    >
      {/* Subtle yellow glow */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, color-mix(in srgb, var(--color-primary) 15%, transparent) 0%, transparent 60%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-5 md:px-8">
        {/* Section number */}
        <div
          aria-hidden
          className="section-number text-[10rem] md:text-[14rem] absolute -top-12 md:-top-20 -end-2 md:-end-4 select-none pointer-events-none leading-none"
        >
          06
        </div>

        {/* Heading — centered */}
        <div className="relative max-w-3xl mx-auto mb-12 md:mb-16 text-center">
          <Reveal>
            <div className="inline-flex items-center gap-3 text-sm font-medium uppercase tracking-[0.2em] text-[var(--color-muted)] mb-5">
              <span className="h-px w-8 bg-[var(--color-fg)]" />
              <span>{contactContent.eyebrow}</span>
              <span className="h-px w-8 bg-[var(--color-fg)]" />
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <h2
              id="contact-heading"
              className="text-display-md text-[var(--color-fg)] mb-6"
            >
              {contactContent.title.before}{" "}
              <span className="marker-yellow">
                {contactContent.title.highlight}
              </span>{" "}
              {contactContent.title.after}
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="text-lg text-[var(--color-muted)] leading-relaxed">
              {contactContent.brief}
            </p>
          </Reveal>
        </div>

        {/* Contact buttons — ticket stub style */}
        <div className="grid md:grid-cols-3 gap-5 md:gap-6 mb-16 max-w-5xl mx-auto">
          {contactContent.buttons.map((btn, i) => {
            const Icon = iconMap[btn.icon as keyof typeof iconMap];
            const href = buttonHrefs[btn.type];
            return (
              <Reveal key={i} delay={i * 0.08}>
                <a
                  href={href}
                  target={btn.type !== "phone" ? "_blank" : undefined}
                  rel={btn.type !== "phone" ? "noopener noreferrer" : undefined}
                  className="group relative block bg-[var(--color-card)] border border-[var(--color-border)] hover:border-[var(--color-primary)] rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Ticket perforation lines (top and bottom edges) */}
                  <div className="absolute top-3 inset-x-3 h-px border-t border-dashed border-[var(--color-border)] opacity-50" />
                  <div className="absolute bottom-3 inset-x-3 h-px border-t border-dashed border-[var(--color-border)] opacity-50" />

                  {/* Stub indicator at top */}
                  <span className="absolute top-0 inset-x-0 mx-auto w-12 h-1 bg-[var(--color-primary)] rounded-b-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="flex items-center gap-4">
                    <div className="grid place-items-center w-14 h-14 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] group-hover:bg-[var(--color-primary)] group-hover:text-white transition-colors duration-300">
                      <Icon size={24} strokeWidth={1.75} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs uppercase tracking-widest text-[var(--color-muted)] mb-1">
                        {btn.label}
                      </div>
                      <div
                        className="text-base md:text-lg font-bold text-[var(--color-fg)] truncate"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {btn.value}
                      </div>
                    </div>
                  </div>

                  {/* Action indicator */}
                  <div className="mt-4 pt-4 border-t border-dashed border-[var(--color-border)] flex items-center justify-between text-xs uppercase tracking-widest text-[var(--color-muted)]">
                    <span>اضغط للتواصل</span>
                    <ArrowLeft
                      size={14}
                      strokeWidth={2}
                      className="text-[var(--color-primary)] group-hover:-translate-x-1 transition-transform duration-300"
                    />
                  </div>
                </a>
              </Reveal>
            );
          })}
        </div>

        {/* Social media */}
        <Reveal>
          <div className="text-center">
            <p className="text-sm uppercase tracking-[0.25em] text-[var(--color-muted)] mb-5">
              {contactContent.socialHeading}
            </p>
            <div className="flex items-center justify-center gap-4">
              <a
                href={config.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="فيسبوك"
                className="grid place-items-center w-12 h-12 rounded-full border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-all duration-300"
              >
                <Facebook size={20} strokeWidth={1.75} />
              </a>
              <a
                href={config.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="إنستجرام"
                className="grid place-items-center w-12 h-12 rounded-full border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-all duration-300"
              >
                <Instagram size={20} strokeWidth={1.75} />
              </a>
              <a
                href={config.social.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="تيك توك"
                className="grid place-items-center w-12 h-12 rounded-full border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-all duration-300"
              >
                <TikTokIcon size={20} />
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
