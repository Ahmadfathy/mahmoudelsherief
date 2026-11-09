import { Plus } from "lucide-react";
import { faqContent } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function FAQ() {
  return (
    <section
      id="faq"
      aria-label={faqContent.eyebrow}
      className="relative py-24 md:py-32 overflow-hidden bg-[var(--color-bg)]"
    >
      {/* Hide native disclosure marker (Safari) */}
      <style>{`.faq-summary::-webkit-details-marker{display:none}`}</style>

      <div className="relative max-w-7xl mx-auto px-5 md:px-8">
        <div className="mb-12 md:mb-16">
          <SectionHeading
            number="09"
            eyebrow={faqContent.eyebrow}
            title={faqContent.title}
            brief={faqContent.brief}
          />
        </div>

        <div className="max-w-[800px] mx-auto space-y-3">
          {faqContent.items.map((item, i) => (
            <Reveal key={i} delay={i * 0.04}>
              <details className="group bg-[var(--color-card)] border border-[var(--color-border)] rounded-3xl overflow-hidden transition-colors hover:border-[var(--color-fg)]/30 open:border-[var(--color-secondary)]/40">
                <summary className="faq-summary flex items-center justify-between gap-4 p-5 md:p-6 cursor-pointer list-none font-bold text-[var(--color-fg)] text-base md:text-lg">
                  <span>{item.question}</span>
                  <span className="shrink-0 grid place-items-center w-9 h-9 rounded-full bg-[var(--color-subtle)] text-[var(--color-fg)] transition-transform duration-300 group-open:rotate-45 group-open:bg-[var(--color-secondary)] group-open:text-white">
                    <Plus size={18} strokeWidth={2.5} />
                  </span>
                </summary>
                <div className="px-5 md:px-6 pb-6 pt-0 text-[var(--color-muted)] leading-relaxed">
                  {item.answer}
                </div>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
