type EgyptPhoneInputProps = {
  value: string;
  onChange: (value: string) => void;
  invalid?: boolean;
  autoFocus?: boolean;
  className?: string;
  inputBackgroundClassName?: string;
};

export function normalizeEgyptPhoneInput(value: string) {
  let digits = value.replace(/\D/g, "");

  if (digits.startsWith("0020")) digits = digits.slice(4);
  else if (digits.startsWith("20")) digits = digits.slice(2);

  // The country code already contains Egypt's leading zero. Accept it when
  // pasted or typed, but do not keep it in the visible local number.
  digits = digits.replace(/^0+/, "");

  return digits.slice(0, 10);
}

export function isValidEgyptPhoneInput(value: string) {
  return /^1[0125][0-9]{8}$/.test(normalizeEgyptPhoneInput(value));
}

export function formatEgyptPhone(value: string) {
  const localNumber = normalizeEgyptPhoneInput(value);
  return localNumber ? `+20 ${localNumber}` : "";
}

export function EgyptPhoneInput({
  value,
  onChange,
  invalid = false,
  autoFocus = false,
  className = "h-12 rounded-xl",
  inputBackgroundClassName = "bg-[var(--color-card)]",
}: EgyptPhoneInputProps) {
  return (
    <div
      dir="ltr"
      className={`flex w-full overflow-hidden border transition-colors focus-within:ring-2 ${className} ${
        invalid
          ? "border-red-400 bg-red-50/40 focus-within:ring-red-200"
          : "border-[var(--color-border)] focus-within:ring-[var(--color-primary)]"
      }`}
    >
      <div
        className="flex shrink-0 items-center gap-2 border-r border-[var(--color-border)] bg-[var(--color-subtle)] px-3"
        aria-label="كود مصر زائد عشرين"
      >
        <span className="text-xl leading-none" aria-hidden="true">🇪🇬</span>
        <span className="font-bold text-[var(--color-fg)]" dir="ltr">+20</span>
      </div>
      <input
        type="tel"
        inputMode="numeric"
        autoComplete="tel-national"
        value={value}
        onChange={(event) => onChange(normalizeEgyptPhoneInput(event.target.value))}
        placeholder="1xxxxxxxxx"
        maxLength={10}
        autoFocus={autoFocus}
        required
        aria-invalid={invalid}
        aria-label="رقم الموبايل بدون الصفر الأول"
        className={`h-full min-w-0 flex-1 px-4 text-left tracking-wide text-[var(--color-fg)] outline-none ${inputBackgroundClassName}`}
      />
    </div>
  );
}
