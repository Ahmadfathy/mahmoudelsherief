
import { Camera, Facebook, Instagram } from "lucide-react";
import { footerContent, navItems } from "@/lib/content";
import { config } from "@/lib/config";

// TikTok inline SVG (not in lucide)
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

export function Footer() {
  return (
    <footer className="relative border-t border-[var(--color-border)] bg-[var(--color-subtle)] mt-20">
      {/* Decorative dotted divider on top */}
      <div className="absolute top-0 inset-x-0 h-2 dotted-divider opacity-40" />

      <div className="max-w-7xl mx-auto px-5 md:px-8 py-12 md:py-16">
        <div className="grid md:grid-cols-3 gap-10 md:gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="grid place-items-center w-9 h-9 rounded-full bg-[var(--color-primary)] text-white">
                <Camera size={18} strokeWidth={1.75} />
              </span>
              <span
                className="font-bold text-xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {config.brandName}
              </span>
            </div>
            <p className="text-[var(--color-muted)] leading-relaxed text-base">
              {footerContent.tagline}
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4
              className="font-bold mb-4 text-lg"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {footerContent.navHeading}
            </h4>
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors text-sm"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4
              className="font-bold mb-4 text-lg"
              style={{ fontFamily: "var(--font-display)" }}
            >
              تابعنا
            </h4>
            <div className="flex items-center gap-3">
              <a
                href={config.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="فيسبوك"
                className="grid place-items-center w-10 h-10 rounded-full border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
              >
                <Facebook size={18} strokeWidth={1.75} />
              </a>
              <a
                href={config.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="إنستجرام"
                className="grid place-items-center w-10 h-10 rounded-full border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
              >
                <Instagram size={18} strokeWidth={1.75} />
              </a>
              <a
                href={config.social.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="تيك توك"
                className="grid place-items-center w-10 h-10 rounded-full border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
              >
                <TikTokIcon size={18} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[var(--color-border)] flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-[var(--color-muted)]">
          <span>{footerContent.copyright}</span>
          <span className="tabular text-xs capitalize tracking-widest">
            Developed by 
            <a
              href="https://wa.me/01155155788"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-primary)] hover:underline bold mx-1"
            >
              Ahmad Fathy
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
