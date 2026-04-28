"use client";

import { Clock, BookOpen, Layers } from "lucide-react";
import { courseContent } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";
import { Accordion } from "@/components/ui/Accordion";

export function CourseContent() {

  return (
    <section
      id="course"
      aria-labelledby="course-heading"
      className="relative py-24 md:py-32 overflow-hidden bg-[var(--color-subtle)]"
    >
      {/* Decorative grid pattern */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-fg) 1px, transparent 1px), linear-gradient(to right, var(--color-fg) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-5 md:px-8">
        {/* Section number */}
        <div
          aria-hidden
          className="section-number text-[10rem] md:text-[14rem] absolute -top-12 md:-top-20 -start-2 md:-start-4 select-none pointer-events-none leading-none"
        >
          03
        </div>

        {/* Heading */}
        <div className="relative max-w-3xl mb-12 md:mb-16">
          <Reveal>
            <div className="flex items-center gap-3 text-sm font-medium uppercase tracking-[0.2em] text-[var(--color-muted)] mb-5">
              <span className="h-px w-8 bg-[var(--color-fg)]" />
              <span>{courseContent.eyebrow}</span>
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <h2
              id="course-heading"
              className="text-display-md text-[var(--color-fg)] mb-6"
            >
              {courseContent.title.before}{" "}
              <span className="marker-yellow">
                {courseContent.title.highlight}
              </span>{" "}
              {courseContent.title.after}
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="text-lg text-[var(--color-muted)] leading-relaxed">
              {courseContent.brief}
            </p>
          </Reveal>
        </div>

        {/* Stats chips */}
        <Reveal>
          <div className="flex flex-wrap items-stretch gap-3 mb-12">
            {[
              {
                icon: Clock,
                value: courseContent.stats[0].value,
                label: courseContent.stats[0].label,
              },
              {
                icon: Layers,
                value: courseContent.stats[1].value,
                label: courseContent.stats[1].label,
              },
              {
                icon: BookOpen,
                value: courseContent.stats[2].value,
                label: courseContent.stats[2].label,
              },
            ].map((s, i) => (
              <div
                key={i}
                className="flex items-center gap-3 bg-[var(--color-card)] border border-[var(--color-border)] rounded-full ps-3 pe-5 py-2"
              >
                <span className="grid place-items-center w-8 h-8 rounded-full bg-[var(--color-primary)] text-white">
                  <s.icon size={14} strokeWidth={2} />
                </span>
                <span className="text-2xl font-bold tabular text-[var(--color-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                  {s.value}
                </span>
                <span className="text-sm text-[var(--color-muted)] font-medium">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Accordion */}
        <Reveal>
          <Accordion
            items={courseContent.sections}
            defaultOpen={0}
          />
        </Reveal>
      </div>
    </section>
  );
}
