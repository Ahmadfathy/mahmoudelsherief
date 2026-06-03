
import { Reveal } from "./Reveal";

interface SectionHeadingProps {
  number: string;
  eyebrow: string;
  title: {
    before: string;
    highlight: string;
    after: string;
  };
  brief?: string;
  align?: "start" | "center";
}

export function SectionHeading({
  number,
  eyebrow,
  title,
  brief,
  align = "start",
}: SectionHeadingProps) {
  return (
    <div
      className={`relative ${align === "center" ? "text-center mx-auto max-w-3xl" : ""}`}
    >
      {/* Section number — large, outlined, editorial */}
      <div
        aria-hidden
        className={`section-number text-[10rem] md:text-[14rem] absolute -top-12 md:-top-20 select-none pointer-events-none
          ${align === "center" ? "start-1/2 -translate-x-1/2 rtl:translate-x-1/2" : "-start-2"}`}
      >
        {number}
      </div>

      <Reveal>
        <div className={`relative ${align === "center" ? "" : "ps-2"}`}>
          {/* Eyebrow with hairline */}
          <div
            className={`flex items-center gap-3 text-sm font-medium uppercase tracking-[0.2em] text-[var(--color-muted)] mb-5
              ${align === "center" ? "justify-center" : ""}`}
          >
            <span className="h-px w-8 bg-[var(--color-fg)]" />
            <span>{eyebrow}</span>
            <span className="h-px w-8 bg-[var(--color-fg)]" />
          </div>

          {/* Title with yellow marker highlight */}
          <h2 className="text-display-md text-[var(--color-fg)]">
            {title.before}{" "}
            <span className="marker-yellow">{title.highlight}</span>{" "}
            {title.after}
          </h2>

          {brief && (
            <p
              className={`mt-6 text-lg text-[var(--color-muted)] leading-relaxed
                ${align === "center" ? "max-w-2xl mx-auto" : "max-w-2xl"}`}
            >
              {brief}
            </p>
          )}
        </div>
      </Reveal>
    </div>
  );
}
