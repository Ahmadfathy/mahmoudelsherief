"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface AccordionItemData {
  number: string;
  title: string;
  duration: string;
  lessons: string[];
}

interface AccordionProps {
  items: AccordionItemData[];
  defaultOpen?: number;
  onItemChange?: (index: number) => void;
}

export function Accordion({ items, defaultOpen = 0, onItemChange }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number>(defaultOpen);

  function toggle(i: number) {
    const newIndex = openIndex === i ? -1 : i;
    setOpenIndex(newIndex);
    if (onItemChange && newIndex !== -1) onItemChange(newIndex);
  }

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <AccordionItem
          key={i}
          item={item}
          isOpen={openIndex === i}
          onClick={() => toggle(i)}
        />
      ))}
    </div>
  );
}

function AccordionItem({
  item,
  isOpen,
  onClick,
}: {
  item: AccordionItemData;
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <div
      className={`relative border overflow-hidden rounded-2xl transition-colors duration-300
        ${
          isOpen
            ? "border-[var(--color-primary)] bg-[var(--color-card)]"
            : "border-[var(--color-border)] bg-[var(--color-card)] hover:border-[var(--color-fg)]"
        }`}
    >
      {/* Crop marks */}
      {isOpen && (
        <>
          <span className="crop-mark-tl" aria-hidden />
          <span className="crop-mark-tr" aria-hidden />
          <span className="crop-mark-bl" aria-hidden />
          <span className="crop-mark-br" aria-hidden />
        </>
      )}

      {/* Header */}
      <button
        type="button"
        onClick={onClick}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between gap-4 p-5 md:p-6 text-start group"
      >
        <div className="flex items-center gap-4 md:gap-6 flex-1 min-w-0">
          <span
            className={`shrink-0 text-2xl md:text-3xl font-bold tabular transition-colors duration-300
              ${isOpen ? "text-[var(--color-primary)]" : "text-[var(--color-muted)]"}`}
            style={{ fontFamily: "var(--font-display)" }}
          >
            {item.number}
          </span>

          <div className="flex-1 min-w-0">
            <h3
              className="text-lg md:text-xl font-bold leading-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {item.title}
            </h3>
            <span className="text-sm text-[var(--color-muted)] mt-1 block">
              {item.duration} · {item.lessons.length} دروس
            </span>
          </div>
        </div>

        {/* Chevron */}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className={`shrink-0 grid place-items-center w-10 h-10 rounded-full transition-colors duration-300
            ${
              isOpen
                ? "bg-[var(--color-primary)] text-white"
                : "bg-[var(--color-subtle)] text-[var(--color-fg)] group-hover:bg-[var(--color-fg)] group-hover:text-[var(--color-bg)]"
            }`}
        >
          <ChevronDown size={18} strokeWidth={2.5} />
        </motion.div>
      </button>

      {/* Content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, .5] }}
            style={{ overflow: "hidden" }}
          >
            <div className="px-5 md:px-6 pb-6 pt-0">
              <div className="ps-12 md:ps-16 border-t border-dashed border-[var(--color-border)] pt-5">
                <ul className="space-y-3">
                  {item.lessons.map((lesson, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 text-[var(--color-fg)]"
                    >
                      <span className="mt-[0.55rem] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-secondary)]" />
                      <span className="text-base md:text-lg leading-relaxed">
                        {lesson}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
