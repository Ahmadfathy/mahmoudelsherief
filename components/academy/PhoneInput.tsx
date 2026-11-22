import { useEffect, useRef, useState } from "react";

export type Country = {
  code: string;      // ISO 2-letter, e.g. "EG"
  name: string;      // Arabic name, e.g. "مصر"
  flag: string;      // emoji flag
  dialCode: string;  // without +, e.g. "20"
  maxDigits: number; // local number max digits (without dial code or leading 0)
};

export const COUNTRIES: Country[] = [
  { code: "EG", name: "مصر", flag: "🇪🇬", dialCode: "20", maxDigits: 10 },
  { code: "SA", name: "السعودية", flag: "🇸🇦", dialCode: "966", maxDigits: 9 },
  { code: "AE", name: "الإمارات", flag: "🇦🇪", dialCode: "971", maxDigits: 9 },
  { code: "KW", name: "الكويت", flag: "🇰🇼", dialCode: "965", maxDigits: 8 },
  { code: "QA", name: "قطر", flag: "🇶🇦", dialCode: "974", maxDigits: 8 },
  { code: "BH", name: "البحرين", flag: "🇧🇭", dialCode: "973", maxDigits: 8 },
  { code: "OM", name: "عمان", flag: "🇴🇲", dialCode: "968", maxDigits: 8 },
  { code: "JO", name: "الأردن", flag: "🇯🇴", dialCode: "962", maxDigits: 9 },
  { code: "LB", name: "لبنان", flag: "🇱🇧", dialCode: "961", maxDigits: 8 },
  { code: "MA", name: "المغرب", flag: "🇲🇦", dialCode: "212", maxDigits: 9 },
  { code: "TN", name: "تونس", flag: "🇹🇳", dialCode: "216", maxDigits: 8 },
  { code: "DZ", name: "الجزائر", flag: "🇩🇿", dialCode: "213", maxDigits: 9 },
  { code: "SD", name: "السودان", flag: "🇸🇩", dialCode: "249", maxDigits: 9 },
  { code: "IQ", name: "العراق", flag: "🇮🇶", dialCode: "964", maxDigits: 10 },
  { code: "YE", name: "اليمن", flag: "🇾🇪", dialCode: "967", maxDigits: 9 },
  { code: "LY", name: "ليبيا", flag: "🇱🇾", dialCode: "218", maxDigits: 9 },
  { code: "PS", name: "فلسطين", flag: "🇵🇸", dialCode: "970", maxDigits: 9 },
  { code: "SY", name: "سوريا", flag: "🇸🇾", dialCode: "963", maxDigits: 9 },
];

export const DEFAULT_COUNTRY = COUNTRIES[0]; // Egypt

export function normalizePhoneInput(value: string, country: Country = DEFAULT_COUNTRY) {
  let digits = value.replace(/\D/g, "");
  // Strip common prefixes if user pasted international format
  if (digits.startsWith("00" + country.dialCode)) digits = digits.slice(2 + country.dialCode.length);
  else if (digits.startsWith(country.dialCode)) digits = digits.slice(country.dialCode.length);
  // Strip a single leading zero (common local prefix in many countries)
  digits = digits.replace(/^0+/, "");
  return digits.slice(0, country.maxDigits);
}

export function isValidPhoneInput(value: string, country: Country = DEFAULT_COUNTRY) {
  const digits = normalizePhoneInput(value, country);
  // Egypt keeps its stricter regex (starts with 1, second digit 0/1/2/5)
  if (country.code === "EG") return /^1[0125][0-9]{8}$/.test(digits);
  // Other countries: match the exact expected local length
  return digits.length === country.maxDigits;
}

export function formatPhone(value: string, country: Country = DEFAULT_COUNTRY) {
  const localNumber = normalizePhoneInput(value, country);
  return localNumber ? `+${country.dialCode} ${localNumber}` : "";
}

export function fullInternationalPhone(value: string, country: Country = DEFAULT_COUNTRY) {
  const digits = normalizePhoneInput(value, country);
  return digits ? `+${country.dialCode}${digits}` : "";
}

/**
 * The phone value sent to the backend.
 * Egypt keeps the legacy format (local digits only, e.g. "1012345678") so
 * accounts registered before the country picker keep matching on login.
 * Other countries are sent in full international format ("+9665xxxxxxxx").
 */
export function phoneForSubmit(value: string, country: Country = DEFAULT_COUNTRY) {
  return country.code === DEFAULT_COUNTRY.code
    ? normalizePhoneInput(value, country)
    : fullInternationalPhone(value, country);
}

/**
 * Detect the country of a stored phone value. Values with an explicit
 * international prefix ("+966…" / "00966…") are matched by dial code;
 * anything else is treated as a legacy Egyptian local number.
 */
export function detectCountry(value: string | null | undefined): Country {
  const raw = (value ?? "").trim();
  if (!raw.startsWith("+") && !raw.startsWith("00")) return DEFAULT_COUNTRY;
  const digits = raw.replace(/\D/g, "").replace(/^00/, "");
  const match = [...COUNTRIES]
    .sort((a, b) => b.dialCode.length - a.dialCode.length)
    .find((c) => digits.startsWith(c.dialCode));
  return match ?? DEFAULT_COUNTRY;
}

type PhoneInputProps = {
  value: string;
  onChange: (value: string) => void;
  country?: Country;
  onCountryChange?: (country: Country) => void;
  invalid?: boolean;
  autoFocus?: boolean;
  className?: string;
  inputBackgroundClassName?: string;
};

export function PhoneInput({
  value,
  onChange,
  country: controlledCountry,
  onCountryChange,
  invalid = false,
  autoFocus = false,
  className = "h-12 rounded-xl",
  inputBackgroundClassName = "bg-[var(--color-card)]",
}: PhoneInputProps) {
  // Internal country state if not controlled from outside
  const [internalCountry, setInternalCountry] = useState<Country>(DEFAULT_COUNTRY);
  const country = controlledCountry ?? internalCountry;
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const setCountry = (next: Country) => {
    if (onCountryChange) onCountryChange(next);
    else setInternalCountry(next);
    onChange(""); // reset number when country changes to avoid mixed formats
    setOpen(false);
  };

  // Close dropdown when clicking outside or pressing Escape
  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} dir="ltr" className="relative w-full">
      <div
        className={`flex w-full overflow-hidden border transition-colors focus-within:ring-2 ${className} ${
          invalid
            ? "border-red-400 bg-red-50/40 focus-within:ring-red-200"
            : "border-[var(--color-border)] focus-within:ring-[var(--color-primary)]"
        }`}
      >
        {/* Country selector */}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex shrink-0 items-center gap-2 border-r border-[var(--color-border)] bg-[var(--color-subtle)] px-3 hover:bg-[var(--color-card)] transition-colors cursor-pointer focus:outline-none"
          aria-label="اختر الدولة"
          aria-expanded={open}
          aria-haspopup="listbox"
        >
          <span className="text-xl leading-none" aria-hidden="true">{country.flag}</span>
          <span className="font-bold text-[var(--color-fg)] text-sm" dir="ltr">+{country.dialCode}</span>
          <svg width="10" height="10" viewBox="0 0 10 10" className="text-[var(--color-muted)]" aria-hidden="true">
            <path d="M2 4l3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <input
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          value={value}
          onChange={(event) => onChange(normalizePhoneInput(event.target.value, country))}
          placeholder={country.code === "EG" ? "1xxxxxxxxx" : "x".repeat(country.maxDigits)}
          maxLength={country.maxDigits}
          autoFocus={autoFocus}
          required
          aria-invalid={invalid}
          aria-label="رقم الموبايل بدون الصفر الأول"
          className={`h-full min-w-0 flex-1 px-4 text-left tracking-wide text-[var(--color-fg)] outline-none ${inputBackgroundClassName}`}
        />
      </div>

      {/* Dropdown — outside the overflow-hidden wrapper so it isn't clipped */}
      {open && (
        <div
          role="listbox"
          aria-label="الدول"
          className="absolute top-full start-0 end-0 mt-1 z-50 max-h-64 overflow-y-auto rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] shadow-2xl"
          dir="rtl"
        >
          {COUNTRIES.map((c) => (
            <button
              key={c.code}
              type="button"
              role="option"
              aria-selected={c.code === country.code}
              onClick={() => setCountry(c)}
              className={`flex w-full items-center gap-3 px-4 py-2.5 text-start hover:bg-[var(--color-subtle)] transition-colors ${
                c.code === country.code ? "bg-[var(--color-secondary)]/10" : ""
              }`}
            >
              <span className="text-xl leading-none" aria-hidden="true">{c.flag}</span>
              <span className="flex-1 text-[var(--color-fg)] font-medium">{c.name}</span>
              <span className="text-[var(--color-muted)] text-sm tabular" dir="ltr">+{c.dialCode}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
