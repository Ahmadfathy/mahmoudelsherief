import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Copy, Check, Camera } from "lucide-react";
import { Link } from "react-router-dom";
import { config } from "@/lib/config";
import { useCourses } from "@/lib/courses-store";
import { useAuth } from "@/lib/auth-context";
import { useAuthModal } from "@/lib/auth-modal-context";
import { apiRequest, friendlyApiError, getStudentToken } from "@/lib/api";

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-full border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
    >
      {copied ? (
        <Check size={14} strokeWidth={2.5} className="text-green-500" />
      ) : (
        <Copy size={14} strokeWidth={2} />
      )}
      {copied ? "تم النسخ!" : label}
    </button>
  );
}

function QrPlaceholder({ src, alt }: { src: string; alt: string }) {
  const [error, setError] = useState(false);

  if (!error) {
    return (
      <img
        src={src}
        alt={alt}
        onError={() => setError(true)}
        className="w-52 h-52 object-contain rounded-xl"
      />
    );
  }

  return (
    <div className="w-52 h-52 rounded-xl border-2 border-dashed border-[var(--color-border)] grid place-items-center bg-[var(--color-subtle)]">
      <div className="text-center p-4">
        <svg width="80" height="80" viewBox="0 0 80 80" className="mx-auto mb-3 opacity-30" aria-hidden>
          <rect x="2" y="2" width="22" height="22" rx="3" fill="none" stroke="currentColor" strokeWidth="4"/>
          <rect x="8" y="8" width="10" height="10" rx="1" fill="currentColor"/>
          <rect x="56" y="2" width="22" height="22" rx="3" fill="none" stroke="currentColor" strokeWidth="4"/>
          <rect x="62" y="8" width="10" height="10" rx="1" fill="currentColor"/>
          <rect x="2" y="56" width="22" height="22" rx="3" fill="none" stroke="currentColor" strokeWidth="4"/>
          <rect x="8" y="62" width="10" height="10" rx="1" fill="currentColor"/>
          <rect x="34" y="34" width="4" height="4" fill="currentColor" opacity="0.4"/>
          <rect x="42" y="34" width="4" height="4" fill="currentColor" opacity="0.4"/>
          <rect x="50" y="34" width="4" height="4" fill="currentColor" opacity="0.4"/>
          <rect x="34" y="42" width="4" height="4" fill="currentColor" opacity="0.4"/>
          <rect x="50" y="42" width="4" height="4" fill="currentColor" opacity="0.4"/>
          <rect x="42" y="50" width="4" height="4" fill="currentColor" opacity="0.4"/>
          <rect x="34" y="58" width="4" height="4" fill="currentColor" opacity="0.4"/>
          <rect x="58" y="50" width="4" height="4" fill="currentColor" opacity="0.4"/>
          <rect x="58" y="58" width="4" height="4" fill="currentColor" opacity="0.4"/>
        </svg>
        <p className="text-xs text-[var(--color-muted)]">ضع صورة الـ QR Code هنا</p>
      </div>
    </div>
  );
}

export default function Payment() {
  const { courses } = useCourses();
  const { user } = useAuth();
  const { openLogin } = useAuthModal();
  const [courseId, setCourseId] = useState("");
  const [method, setMethod] = useState<"vodafone_cash" | "instapay">("vodafone_cash");
  const [senderPhone, setSenderPhone] = useState("");
  const [reference, setReference] = useState("");
  const [receipt, setReceipt] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!courseId && courses[0]) setCourseId(courses[0].id);
  }, [courses, courseId]);

  const selectedCourse = courses.find((course) => course.id === courseId);

  async function submitPayment(event: React.FormEvent) {
    event.preventDefault();
    if (!user) {
      openLogin();
      return;
    }
    const token = getStudentToken();
    if (!token || !selectedCourse) return;
    setSubmitting(true);
    setError("");
    setSuccess(false);
    const form = new FormData();
    form.append("course_id", selectedCourse.id);
    form.append("method", method);
    form.append("amount", String(selectedCourse.price || 1));
    form.append("currency", selectedCourse.currency || "EGP");
    if (senderPhone) form.append("sender_phone", senderPhone);
    if (reference) form.append("transaction_reference", reference);
    if (receipt) form.append("receipt", receipt);
    try {
      await apiRequest("/payments", { method: "POST", token, body: form });
      setSuccess(true);
      setReference("");
      setReceipt(null);
    } catch (requestError) {
      setError(friendlyApiError(requestError));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col" dir="rtl">

      <header className="sticky top-0 z-50 backdrop-blur-md bg-[var(--color-bg)]/85 border-b border-[var(--color-border)]">
        <div className="max-w-4xl mx-auto px-5 h-16 flex items-center justify-between gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-fg)] transition-colors"
          >
            <ArrowRight size={16} strokeWidth={2} />
            <span>الرجوع</span>
          </Link>
          <Link to="/" className="flex items-center gap-2 font-bold text-lg" style={{ fontFamily: "var(--font-display)" }}>
            <span className="grid place-items-center w-8 h-8 rounded-full bg-[var(--color-primary)] text-white">
              <Camera size={16} strokeWidth={1.75} />
            </span>
            <span>{config.brandName}</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-5 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12"
        >
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--color-muted)] mb-3">خطوة أخيرة</p>
          <h1 className="text-4xl md:text-5xl font-black text-[var(--color-fg)] mb-4" style={{ fontFamily: "var(--font-display)" }}>
            اختار طريقة الدفع
          </h1>
          <p className="text-[var(--color-muted)] text-lg max-w-md mx-auto leading-relaxed">
            افتح التطبيق وامسح الـ QR Code، أو انسخ الرقم وابعت المبلغ يدوياً
          </p>

          <div className="inline-flex items-baseline gap-2 mt-6 bg-[var(--color-secondary)] text-[#1A1A1A] px-5 py-2 rounded-full">
            <span className="text-2xl font-black" style={{ fontFamily: "var(--font-display)" }}>
              {(selectedCourse?.price ?? 0).toLocaleString("ar-EG")}
            </span>
            <span className="text-sm font-bold">{selectedCourse?.currency ?? "ج.م"}</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => setMethod("vodafone_cash")}
            className={`cursor-pointer bg-[var(--color-card)] border rounded-3xl p-8 flex flex-col items-center gap-6 text-center transition-colors ${method === "vodafone_cash" ? "border-[#E60000] ring-2 ring-[#E60000]/20" : "border-[var(--color-border)] hover:border-[#E60000]/40"}`}
          >
            <div className="flex items-center gap-3">
              <img src="/vodafone-icon.png" alt="Vodafone Cash" className="w-[50px] h-[50px] object-contain rounded-full" />
              <div className="text-start">
                <p className="font-black text-lg text-[var(--color-fg)]" style={{ fontFamily: "var(--font-display)" }}>فودافون كاش</p>
                <p className="text-xs text-[var(--color-muted)] tabular">Vodafone Cash</p>
              </div>
            </div>

            <QrPlaceholder src="/vodafone-cash.jpeg" alt="QR Code فودافون كاش" />

            <div className="w-full">
              <p className="text-xs text-[var(--color-muted)] mb-2 uppercase tracking-widest">رقم المحفظة</p>
              <p className="text-2xl font-black text-[var(--color-fg)] mb-3 tabular" style={{ fontFamily: "var(--font-display)" }}>
                01012205238
              </p>
              <CopyButton text="01012205238" label="نسخ الرقم" />
            </div>

            <p className="text-xs text-[var(--color-muted)] leading-relaxed">
              افتح تطبيق فودافون كاش ← ادفع ← امسح الـ QR أو ابعت على الرقم
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => setMethod("instapay")}
            className={`cursor-pointer bg-[var(--color-card)] border rounded-3xl p-8 flex flex-col items-center gap-6 text-center transition-colors ${method === "instapay" ? "border-[#6C2BD9] ring-2 ring-[#6C2BD9]/20" : "border-[var(--color-border)] hover:border-[#6C2BD9]/40"}`}
          >
            <div className="flex items-center gap-3">
              <img src="/instapay-icon.png" alt="InstaPay" className="w-[50px] h-[50px] object-contain rounded-full" />
              <div className="text-start">
                <p className="font-black text-lg text-[var(--color-fg)]" style={{ fontFamily: "var(--font-display)" }}>إنستاباي</p>
                <p className="text-xs text-[var(--color-muted)] tabular">InstaPay</p>
              </div>
            </div>

            <QrPlaceholder src="/instapay.jpeg" alt="QR Code إنستاباي" />

            <div className="w-full">
              <p className="text-xs text-[var(--color-muted)] mb-2 uppercase tracking-widest">رقم الحساب</p>
              <p className="text-2xl font-black text-[var(--color-fg)] mb-3 tabular" style={{ fontFamily: "var(--font-display)" }}>
                01113010090
              </p>
              <CopyButton text="01113010090" label="نسخ الرقم" />
            </div>

            <p className="text-xs text-[var(--color-muted)] leading-relaxed">
              افتح تطبيق إنستاباي ← تحويل ← امسح الـ QR أو ابعت على الرقم
            </p>
          </motion.div>
        </div>

        <motion.form
          onSubmit={submitPayment}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-10 w-full max-w-xl rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6"
        >
          <h2 className="text-xl font-black mb-4">سجّل عملية الدفع</h2>
          <div className="space-y-3 text-start">
            <select value={courseId} onChange={(event) => setCourseId(event.target.value)} required className="w-full h-11 px-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)]">
              {courses.map((course) => <option key={course.id} value={course.id}>{course.title}</option>)}
            </select>
            <input value={senderPhone} onChange={(event) => setSenderPhone(event.target.value)} placeholder="رقم الهاتف المحوّل منه" className="w-full h-11 px-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)]" />
            <input value={reference} onChange={(event) => setReference(event.target.value)} placeholder="رقم العملية (اختياري)" className="w-full h-11 px-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)]" />
            <label className="block text-sm font-bold">صورة إيصال الدفع</label>
            <input type="file" accept="image/jpeg,image/png,image/webp,application/pdf" onChange={(event) => setReceipt(event.target.files?.[0] ?? null)} className="w-full text-sm" />
            {error && <p className="text-sm text-red-500">{error}</p>}
            {success && <p className="text-sm text-green-500">تم إرسال الدفع للمراجعة بنجاح.</p>}
            <button type="submit" disabled={submitting || !selectedCourse} className="w-full h-12 rounded-full bg-[var(--color-primary)] text-white font-bold disabled:opacity-50">
              {!user ? "سجّل الدخول لإرسال الإيصال" : submitting ? "جاري الإرسال..." : "إرسال الإيصال للمراجعة"}
            </button>
            <p className="text-xs text-center text-[var(--color-muted)]">لو واجهتك مشكلة، <a href={config.whatsappSubscribe} target="_blank" rel="noreferrer" className="text-[#25D366] font-bold">تواصل معنا على واتساب</a>.</p>
          </div>
        </motion.form>
      </main>
    </div>
  );
}
