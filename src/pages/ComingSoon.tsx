import { motion, useReducedMotion } from "framer-motion";
import { Camera, Facebook, Instagram } from "lucide-react";
import type { ReactNode } from "react";
import { config } from "@/lib/config";

const C = {
  bg: "#0C0A09",
  fg: "#FAFAF9",
  gold: "#D4A446",
  muted: "#A09789",
};

const serif = { fontFamily: "'Cormorant', serif" };
const sans = { fontFamily: "'Montserrat', sans-serif" };

const focusRing =
  "outline-none focus-visible:ring-2 focus-visible:ring-[#D4A446] focus-visible:ring-offset-4 focus-visible:ring-offset-[#0C0A09]";

// Not available in lucide-react
function TikTokIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
  );
}

function WhatsAppIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.42.25-.7.25-1.29.17-1.42-.07-.12-.27-.2-.57-.34zM12.05 21.5h-.01a9.43 9.43 0 0 1-4.81-1.32l-.35-.2-3.58.94.96-3.49-.23-.36a9.43 9.43 0 0 1-1.45-5.03c0-5.21 4.24-9.45 9.46-9.45 2.53 0 4.9.99 6.69 2.78a9.4 9.4 0 0 1 2.77 6.69c0 5.21-4.24 9.45-9.45 9.45zm8.04-17.5A11.3 11.3 0 0 0 12.05.67C5.78.67.68 5.77.68 12.04c0 2 .52 3.96 1.52 5.68L.58 23.33l5.75-1.51a11.35 11.35 0 0 0 5.71 1.46h.01c6.27 0 11.37-5.1 11.37-11.37 0-3.04-1.18-5.89-3.33-8.04z" />
    </svg>
  );
}

const socials: { label: string; href: string; icon: ReactNode }[] = [
  { label: "Facebook", href: config.social.facebook, icon: <Facebook size={20} strokeWidth={1.5} /> },
  { label: "Instagram", href: config.social.instagram, icon: <Instagram size={20} strokeWidth={1.5} /> },
  { label: "TikTok", href: config.social.tiktok, icon: <TikTokIcon size={20} /> },
];

export default function ComingSoon() {
  const reduce = useReducedMotion();

  return (
    <motion.main
      dir="ltr"
      lang="en"
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative flex min-h-[100svh] w-full flex-col items-center justify-between overflow-x-hidden px-4 py-10 text-center"
      style={{ backgroundColor: C.bg, color: C.fg, ...sans }}
    >
      {/* Mark */}
      <div className="flex items-center gap-3">
        <span
          className="grid h-9 w-9 place-items-center rounded-full border"
          style={{ borderColor: `${C.gold}66`, color: C.gold }}
          aria-hidden="true"
        >
          <Camera size={16} strokeWidth={1.5} />
        </span>
        <span className="text-xl tracking-wide" style={serif}>
          {config.brandName}
        </span>
      </div>

      {/* Center */}
      <div className="flex flex-col items-center">
        <h1
          className="leading-[0.95] font-normal"
          style={{ ...serif, fontSize: "clamp(3rem, 12vw, 7rem)" }}
        >
          Coming <em className="font-semibold italic" style={{ color: C.gold }}>Soon</em>
        </h1>

        <p
          className="mt-6 max-w-md text-sm font-light leading-relaxed sm:text-base"
          style={{ color: C.muted }}
        >
          Mobile photography academy by {config.brandName} — launching soon.
        </p>

        <ul className="mt-10 flex items-center gap-8">
          {socials.map((s) => (
            <li key={s.label}>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${s.label} (opens in a new tab)`}
                className={`block rounded-full p-1 text-[#FAFAF9] transition-colors duration-200 hover:text-[#D4A446] ${focusRing}`}
              >
                {s.icon}
              </a>
            </li>
          ))}
        </ul>

        <motion.a
          href={`https://wa.me/${config.whatsappNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp (opens in a new tab)"
          animate={reduce ? undefined : { scale: [1, 1.02, 1] }}
          transition={reduce ? undefined : { duration: 3, ease: "easeInOut", repeat: Infinity }}
          className={`mt-10 inline-flex items-center gap-2.5 rounded-full border border-[#D4A446]/60 px-6 py-3 text-sm font-medium tracking-wide text-[#D4A446] transition-colors duration-200 hover:bg-[#D4A446] hover:text-[#0C0A09] ${focusRing}`}
        >
          <WhatsAppIcon />
          Chat on WhatsApp
        </motion.a>
      </div>

      {/* Footer */}
      <footer className="text-xs tracking-wide" style={{ color: C.muted }}>
        © 2026 {config.brandName}
      </footer>
    </motion.main>
  );
}
