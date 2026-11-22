import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Camera, Shield } from "lucide-react";
import { config } from "@/lib/config";

const LAST_UPDATED = "22 نوفمبر 2026";

type LegalSection = {
  number: string;
  title: string;
  body: string | null;
  list?: string[];
};

const sections: LegalSection[] = [
  {
    number: "01",
    title: "مقدمة",
    body: `بنحترم خصوصيتك، والسياسة دي بتوضحلك إيه البيانات اللي بنجمعها لما تستخدم موقع "${config.brandName}"، ليه بنجمعها، وإزاي بنحميها. باستخدامك للموقع، إنت بتوافق على المذكور في السياسة دي.`,
  },
  {
    number: "02",
    title: "البيانات اللي بنجمعها",
    body: null,
    list: [
      "بيانات التسجيل: الاسم، البريد الإلكتروني، رقم الموبايل، وكلمة السر (مخزّنة مشفّرة).",
      "بيانات الدفع: رقم التليفون المحوّل منه، وصورة إيصال التحويل.",
      "بيانات الاستخدام: الصفحات اللي بتزورها، مدة الاستخدام، ونوع الجهاز والمتصفح.",
      "ملفات تعريف الارتباط (Cookies): لحفظ تفضيلاتك وتحسين تجربة الاستخدام.",
    ],
  },
  {
    number: "03",
    title: "ليه بنجمع البيانات دي",
    body: null,
    list: [
      "تفعيل حسابك والسماح لك بالوصول لمحتوى الكورس.",
      "التواصل معاك بخصوص اشتراكك والتحديثات.",
      "تحسين الخدمة وتجربة الاستخدام على الموقع.",
      "الامتثال للمتطلبات القانونية في جمهورية مصر العربية.",
    ],
  },
  {
    number: "04",
    title: "مع مين بنشارك البيانات",
    body: `إحنا ما بنبيعش بياناتك ولا بنأجّرها لأي طرف تاني. الوصول للبيانات محدود على:`,
    list: [
      "فريق إدارة الموقع لأغراض تشغيل الخدمة والتواصل معاك.",
      "مزوّدي خدمة استضافة الموقع والفيديو (مثل Bunny.net) — لأغراض فنية فقط.",
      "الجهات القانونية المختصة، لو تم طلب بياناتك بشكل رسمي.",
    ],
  },
  {
    number: "05",
    title: "حماية البيانات",
    body: null,
    list: [
      "كلمات السر مخزّنة بصيغة مشفّرة (hashed) ومش قابلة للعرض حتى من فريقنا.",
      "كل الاتصال بالموقع بيتم عبر بروتوكول HTTPS المؤمّن.",
      "الوصول لبيانات المستخدمين محدود للإدارة فقط عبر حسابات محمية.",
    ],
  },
  {
    number: "06",
    title: "حقوقك",
    body: `كمستخدم، عندك الحق في:`,
    list: [
      "طلب نسخة من البيانات اللي عندنا عنك.",
      "تعديل أي بيانات غير صحيحة في حسابك.",
      "طلب حذف حسابك وكل بياناتك المرتبطة بيه.",
      "سحب موافقتك على معالجة بياناتك في أي وقت (مع العلم إن ده بيلغي وصولك للكورس).",
    ],
  },
  {
    number: "07",
    title: "ملفات تعريف الارتباط (Cookies)",
    body: `بنستخدم الكوكيز للحفاظ على جلسة تسجيل الدخول بتاعتك، ولقياس أداء الموقع وتحسينه. تقدر توقّف الكوكيز من إعدادات متصفحك، بس ده ممكن يأثر على وظائف معينة زي البقاء مسجّل دخول.`,
  },
  {
    number: "08",
    title: "تعديل سياسة الخصوصية",
    body: `بنحتفظ بالحق في تعديل السياسة دي في أي وقت. التعديلات بتسري من تاريخ نشرها على الموقع، وهنعلن عن أي تغيير جوهري. استمرار استخدامك للموقع بعد التعديلات يُعتبر موافقة ضمنية عليها.`,
  },
  {
    number: "09",
    title: "التواصل معنا",
    body: `لو عندك أي سؤال أو طلب بخصوص سياسة الخصوصية دي، تواصل معانا:`,
    list: [
      `البريد الإلكتروني: ${config.email}`,
      `واتساب: +${config.whatsappNumber}`,
    ],
  },
];

export default function Privacy() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)]" dir="rtl">
      <header className="border-b border-[var(--color-border)] bg-[var(--color-bg)]/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-5">
          <Link to="/" className="flex items-center gap-2 text-sm font-bold text-[var(--color-muted)] transition-colors hover:text-[var(--color-fg)]">
            <ArrowRight size={17} />
            الرجوع للرئيسية
          </Link>
          <Link to="/" className="flex items-center gap-2 font-bold">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-[var(--color-primary)] text-white">
              <Camera size={16} />
            </span>
            {config.brandName}
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 py-12 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="grid place-items-center w-11 h-11 rounded-2xl bg-[var(--color-secondary)]/10 text-[var(--color-secondary)]">
              <Shield size={20} strokeWidth={1.75} />
            </span>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--color-muted)]">
              الوثائق القانونية
            </p>
          </div>

          <h1
            className="text-3xl md:text-4xl font-black text-[var(--color-fg)] mb-2"
            style={{ fontFamily: "var(--font-display)" }}
          >
            سياسة الخصوصية
          </h1>
          <p className="text-sm text-[var(--color-muted)] mb-10">
            آخر تحديث: {LAST_UPDATED}
          </p>

          <div className="space-y-8">
            {sections.map((section) => (
              <section key={section.number} className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 md:p-7">
                <div className="flex items-baseline gap-3 mb-4">
                  <span
                    className="text-2xl font-black text-[var(--color-secondary)] tabular shrink-0"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {section.number}
                  </span>
                  <h2
                    className="text-xl md:text-2xl font-black text-[var(--color-fg)]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {section.title}
                  </h2>
                </div>
                {section.body && (
                  <p className="text-[var(--color-fg)] leading-loose mb-3">
                    {section.body}
                  </p>
                )}
                {section.list && (
                  <ul className="space-y-2">
                    {section.list.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-[var(--color-fg)] leading-loose">
                        <span className="shrink-0 mt-2.5 w-1.5 h-1.5 rounded-full bg-[var(--color-secondary)]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          <div className="mt-10 pt-6 border-t border-dashed border-[var(--color-border)] text-center">
            <p className="text-sm text-[var(--color-muted)]">
              شوف كمان:{" "}
              <Link to="/terms" className="text-[var(--color-primary)] font-bold hover:underline">
                الشروط والأحكام
              </Link>
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
