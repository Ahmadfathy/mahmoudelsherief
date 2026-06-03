
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { type ReactNode, type MouseEvent, useRef } from "react";

type ButtonVariant = "primary" | "outline" | "ghost";
type ButtonSize = "md" | "lg";

interface ButtonProps {
  children: ReactNode;
  href?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  magnetic?: boolean;
  className?: string;
  onClick?: () => void;
  external?: boolean;
  ariaLabel?: string;
}

const baseStyles =
  "inline-flex items-center justify-center gap-2 font-bold transition-colors duration-200 relative overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]";

const sizeStyles: Record<ButtonSize, string> = {
  md: "h-11 px-5 text-base rounded-full",
  lg: "h-14 px-8 text-lg rounded-full",
};

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--color-secondary)] text-[#1A1A1A] hover:bg-[var(--color-secondary-warm)] shadow-[0_8px_24px_-8px_rgba(255,216,77,0.6)]",
  outline:
    "border-2 border-[var(--color-fg)] text-[var(--color-fg)] hover:bg-[var(--color-fg)] hover:text-[var(--color-bg)]",
  ghost:
    "text-[var(--color-fg)] hover:bg-[var(--color-subtle)]",
};

export function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  magnetic = false,
  className = "",
  onClick,
  external = false,
  ariaLabel,
}: ButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 200, damping: 20, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 200, damping: 20, mass: 0.5 });

  // Children also slightly more pronounced movement
  const childX = useTransform(springX, (v) => v * 1.2);
  const childY = useTransform(springY, (v) => v * 1.2);

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    if (!magnetic || !ref.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(hover: none)").matches) return;

    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;

    x.set(dx * 0.18);
    y.set(dy * 0.25);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  const classes = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`;

  const inner = (
    <motion.span
      style={magnetic ? { x: childX, y: childY } : undefined}
      className="inline-flex items-center gap-2"
    >
      {children}
    </motion.span>
  );

  const Wrapper = (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={magnetic ? { x: springX, y: springY } : undefined}
      className="inline-block"
    >
      {href ? (
        <a
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          className={classes}
          aria-label={ariaLabel}
        >
          {inner}
        </a>
      ) : (
        <button
          type="button"
          onClick={onClick}
          className={classes}
          aria-label={ariaLabel}
        >
          {inner}
        </button>
      )}
    </motion.div>
  );

  return Wrapper;
}
