interface ApertureProps {
  className?: string;
  size?: number;
}

export function Aperture({ className = "", size = 200 }: ApertureProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      className={className}
      aria-hidden="true"
    >
      <circle cx="50" cy="50" r="48" />
      <circle cx="50" cy="50" r="35" />
      {/* Aperture blades */}
      <path d="M50 14 L65 44 L50 50 Z" />
      <path d="M81 32 L65 44 L78 56 Z" opacity="0.7" />
      <path d="M86 68 L65 56 L78 78 Z" opacity="0.5" />
      <path d="M50 86 L35 56 L50 50 Z" opacity="0.3" />
      <path d="M19 68 L35 56 L22 44 Z" opacity="0.5" />
      <path d="M14 32 L35 44 L22 22 Z" opacity="0.7" />
      {/* Center dot */}
      <circle cx="50" cy="50" r="2" fill="currentColor" />
    </svg>
  );
}

interface ViewfinderBracketsProps {
  color?: string;
  className?: string;
}

export function ViewfinderBrackets({
  color = "var(--color-secondary)",
  className = "",
}: ViewfinderBracketsProps) {
  return (
    <div
      className={`absolute inset-0 pointer-events-none ${className}`}
      aria-hidden="true"
    >
      {/* Top-left */}
      <div
        className="absolute -top-3 -start-3 w-8 h-8"
        style={{
          borderColor: color,
          borderWidth: "3px 0 0 3px",
          borderStyle: "solid",
        }}
      />
      {/* Top-right */}
      <div
        className="absolute -top-3 -end-3 w-8 h-8"
        style={{
          borderColor: color,
          borderWidth: "3px 3px 0 0",
          borderStyle: "solid",
        }}
      />
      {/* Bottom-left */}
      <div
        className="absolute -bottom-3 -start-3 w-8 h-8"
        style={{
          borderColor: color,
          borderWidth: "0 0 3px 3px",
          borderStyle: "solid",
        }}
      />
      {/* Bottom-right */}
      <div
        className="absolute -bottom-3 -end-3 w-8 h-8"
        style={{
          borderColor: color,
          borderWidth: "0 3px 3px 0",
          borderStyle: "solid",
        }}
      />
    </div>
  );
}
