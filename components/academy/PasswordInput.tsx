import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

type PasswordInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoComplete?: "current-password" | "new-password";
  minLength?: number;
  invalid?: boolean;
  className?: string;
};

export function PasswordInput({
  value,
  onChange,
  placeholder = "كلمة السر",
  autoComplete = "current-password",
  minLength,
  invalid = false,
  className = "h-12 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4",
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        type={visible ? "text" : "password"}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        minLength={minLength}
        required
        aria-invalid={invalid}
        className={`${className} pe-12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]`}
      />
      <button
        type="button"
        onClick={() => setVisible((current) => !current)}
        aria-label={visible ? "إخفاء كلمة السر" : "إظهار كلمة السر"}
        title={visible ? "إخفاء كلمة السر" : "إظهار كلمة السر"}
        className="absolute end-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-[var(--color-muted)] transition-colors hover:bg-[var(--color-subtle)] hover:text-[var(--color-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
      >
        {visible ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}
