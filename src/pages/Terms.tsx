import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Camera, FileText } from "lucide-react";
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
    body: `باستخدامك موقع "${config.brandName}" وأي من خدماته، إنت بتوافق على الشروط والأحكام دي. لو مش موافق على أي من البنود، بنرجّاك ما تستخدمش الموقع.`,
  },
  {
    number: "02",
    title: "التسجيل والحساب",
    body: null,
    list: [
      "لازم تكون عمرك 18 سنة أو أكتر لإنشاء حساب. القاصرين لازم يكون عندهم موافقة ولي الأمر.",
      "البيانات اللي بتدخلها في التسجيل لازم تكون صحيحة وحديثة.",
      "إنت المسؤول الوحيد عن حماية كلمة السر بتاعتك وأي نشاط يتم من حسابك.",
      "حساب واحد لكل مستخدم — ممنوع مشاركة الحساب مع أي شخص تاني بأي شكل من الأشكال.",
    ],
  },
  {
    number: "03",
    title: "المحتوى والملكية الفكرية",
    body: `كل محتوى الكورس — من فيديوهات، ملفات مكتوبة، صور، أمثلة، تقنيات، وأي مواد أخرى — هو ملكية فكرية خاصة بـ "${config.brandName}" ومحمي بقوانين حقوق الملكية الفكرية في جمهورية مصر العربية والدول الأخرى.`,
    list: [
      "ممنوع تحميل أو تنزيل أو تسجيل أو نسخ أي جزء من المحتوى بأي طريقة.",
      "ممنوع إعادة نشر أو توزيع أو بيع المحتوى، سواء كامل أو جزئي.",
      "ممنوع استخدام المحتوى لإنشاء أي أعمال مشتقة بهدف تجاري.",
      "مخالفة أي من ده بتؤدي لإنهاء حسابك فوراً بدون استرجاع المبلغ، مع الاحتفاظ بحقنا القانوني في المطالبة بالتعويض.",
    ],
  },
  {
    number: "04",
    title: "السعر والدفع",
    body: null,
    list: [
      "الأسعار معلنة على الموقع بالجنيه المصري وقابلة للتغيير في أي وقت، مع احترام الأسعار المدفوعة قبل التغيير.",
      "الدفع بيتم عبر فودافون كاش أو إنستاباي عن طريق التحويل لرقم الحساب المعلن على صفحة الدفع.",
      "بعد تحويل المبلغ، لازم تبعتلنا سكرين التحويل مع رقم التليفون المحوّل منه على الواتساب.",
      "تفعيل حسابك بيتم خلال 24 ساعة من استلام إيصال التحويل والتأكد منه.",
    ],
  },
  {
    number: "05",
    title: "سياسة الاسترجاع",
    body: `بنقدّم ضمان استرجاع كامل خلال 48 ساعة من تاريخ الشراء، بدون الحاجة لتبرير سبب الاسترجاع.`,
    list: [
      "طلب الاسترجاع لازم يتم خلال 48 ساعة من إتمام الدفع.",
      "بعد مرور الـ 48 ساعة، ما بيكونش في استرجاع لأي سبب.",
      "الاسترجاع بيتم عبر نفس طريقة الدفع الأصلية خلال 7 أيام عمل من قبول الطلب.",
      "الاسترجاع ما بيشملش أي رسوم تحويل تحمّلتها من مزوّد خدمة الدفع.",
    ],
  },
  {
    number: "06",
    title: "التحديثات والتغييرات على المحتوى",
    body: null,
    list: [
      "بنحدّث محتوى الكورس بشكل مستمر لمواكبة الجديد في مجال التصوير بالموبايل.",
      "كل التحديثات متاحة مجاناً لكل المشتركين.",
      "بنحتفظ بالحق في تعديل أو حذف أي جزء من الكورس أو إيقاف الخدمة بالكامل، مع إشعار مسبق للمشتركين.",
    ],
  },
  {
    number: "07",
    title: "السلوك المحظور",
    body: `بالإضافة للممنوعات في بند الملكية الفكرية، ممنوع:`,
    list: [
      "استخدام حسابك لأي غرض غير قانوني أو مخالف للأخلاق العامة.",
      "محاولة الوصول لأجزاء من الموقع غير متاحة لك، أو اختراق أنظمة الحماية.",
      "إنشاء حسابات متعددة أو انتحال شخصية شخص تاني.",
      "نشر أو مشاركة معلومات مضللة أو مسيئة عن الكورس أو عن مستخدمين آخرين.",
      "استخدام الموقع لأي أغراض تجارية غير مصرّح بها.",
    ],
  },
  {
    number: "08",
    title: "حدود المسؤولية",
    body: null,
    list: [
      `الكورس بيتقدّم "كما هو" بدون أي ضمانات ضمنية خارج اللي مذكور في السياسة دي.`,
      "مش مسؤولين عن أي أضرار غير مباشرة أو تبعية ناتجة عن استخدام الكورس.",
      "مسؤوليتنا القصوى في أي حالة محدودة بإجمالي المبلغ اللي دفعته للكورس.",
    ],
  },
  {
    number: "09",
    title: "تعديل الشروط",
    body: `بنحتفظ بالحق في تعديل الشروط والأحكام دي في أي وقت. التعديلات بتسري من تاريخ نشرها على الموقع. استمرار استخدامك للموقع بعد التعديل يُعتبر موافقة على الشروط الجديدة. لو مش موافق على أي تعديل، بنرجّاك توقّف استخدام الموقع.`,
  },
  {
    number: "10",
    title: "القانون الحاكم",
    body: `الشروط والأحكام دي بتخضع لقوانين جمهورية مصر العربية. أي نزاع ينشأ عنها بيتم حله أمام المحاكم المصرية المختصة.`,
  },
  {
    number: "11",
    title: "التواصل معنا",
    body: `لأي استفسار أو شكوى بخصوص الشروط والأحكام دي:`,
    list: [
      `البريد الإلكتروني: ${config.email}`,
      `واتساب: +${config.whatsappNumber}`,
    ],
  },
];

export default function Terms() {
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
              <FileText size={20} strokeWidth={1.75} />
            </span>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--color-muted)]">
              الوثائق القانونية
            </p>
          </div>

          <h1
            className="text-3xl md:text-4xl font-black text-[var(--color-fg)] mb-2"
            style={{ fontFamily: "var(--font-display)" }}
          >
            الشروط والأحكام
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
              <Link to="/privacy" className="text-[var(--color-primary)] font-bold hover:underline">
                سياسة الخصوصية
              </Link>
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
