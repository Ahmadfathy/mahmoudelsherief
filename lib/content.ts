/**
 * All user-facing Arabic content.
 * Replace placeholder text with real copy when ready.
 */

export const navItems = [
  { id: "hero", label: "الرئيسية", number: "01" },
  { id: "about", label: "من أنا", number: "02" },
  { id: "audience", label: "لمين الكورس", number: "03" },
  { id: "course", label: "محتوى الكورس", number: "04" },
  { id: "features", label: "المميزات", number: "05" },
  { id: "testimonials", label: "آراء العملاء", number: "06" },
  { id: "offline", label: "كورس أوفلاين", number: "07" },
  { id: "pricing", label: "الاشتراك", number: "08" },
  { id: "faq", label: "الأسئلة الشائعة", number: "09" },
  { id: "contact", label: "تواصل معانا", number: "10" },
] as const;

export const heroContent = {
  eyebrow: "كورس أوفلاين وأونلاين · القاهرة",
  title: "اتقن فن التصوير بالموبايل",
  subtitle: "كورس عملي مع محمود شريف — من الصفر لمستوى احترافي",
};

export const aboutContent = {
  eyebrow: "من أنا",
  title: {
    before: "مصور",
    highlight: "بشغف",
    after: "وحب التعليم",
  },
  paragraphs: [
    "أنا مصور محترف بخبرة تتعدى ٨ سنين في مجال التصوير بالموبايل والكاميرات الاحترافية. اشتغلت مع علامات تجارية كبرى ودربت مئات الطلاب على فن التقاط اللحظة بأبسط الأدوات.",
    "إيماني الكامل إن أحسن كاميرا هي اللي معاك دلوقتي. الكورس ده خلاصة سنين من التجربة، مصمم بطريقة عملية تخليك تشوف نتايج من أول أسبوع.",
  ],
  stats: [
    { value: 8, suffix: "+", label: "سنوات خبرة" },
    { value: 500, suffix: "+", label: "طالب وطالبة" },
    { value: 25, suffix: "", label: "ورشة عمل" },
    { value: 1200, suffix: "+", label: "مشروع منشور" },
  ],
};

export const courseContent = {
  eyebrow: "محتوى الكورس",
  title: {
    before: "رحلة كاملة في",
    highlight: "٤ أقسام",
    after: "متكاملة",
  },
  brief:
    "كل قسم مبني على اللي قبله. هتنتقل من الأساسيات لمستوى احترافي بطريقة منظمة وممتعة.",
  stats: [
    { label: "ساعات", value: "9" },
    { label: "أقسام", value: "4" },
    { label: "محاضرات", value: "25" },
  ],
  sections: [
    {
      number: "01",
      title: "أساسيات التصوير بالموبايل",
      duration: "ساعتين",
      lessons: [
        { title: "تجهيز الموبايل قبل التصوير", isPreview: true, previewSlug: "preview-01" },
        { title: "أفضل إعدادات الكاميرا للتصوير الاحترافي" },
        { title: "فهم جودة الفيديو والفريمات والرزليوشن" },
        { title: "عدسة الموبايل وتحسين جودة الصورة" },
        { title: "أهم الأخطاء اللي بتبوظ الفيديو" },
      ],
    },
    {
      number: "02",
      title: "التصوير الحركي والزوايا",
      duration: "ساعتين",
      lessons: [
        { title: "التحرك بالموبايل بشكل ثابت واحترافي", isPreview: true, previewSlug: "preview-02" },
        { title: "أنواع الحركات السينمائية" },
        { title: "تصوير الـ B-Roll بشكل احترافي" },
        { title: "أفضل الزوايا لتصوير المنتجات والأشخاص" },
        { title: "تصوير المشاهد الـ Slow Motion" },
      ],
    },
    {
      number: "03",
      title: "إتقان الإضاءة",
      duration: "ساعتين",
      lessons: [
        { title: "فهم الإضاءة الطبيعية والصناعية", isPreview: true, previewSlug: "preview-03" },
        { title: "التصوير في ضوء الشمس بشكل صحيح" },
        { title: "توزيع الإضاءة داخل الاستوديو" },
        { title: "التحكم في الظلال والهايلايت" },
        { title: "أفضل أماكن واتجاهات الإضاءة" },
      ],
    },
    {
      number: "04",
      title: "المونتاج وتحرير الفيديو",
      duration: "٣ ساعات",
      lessons: [
        { title: "أساسيات المونتاج للمبتدئين" },
        { title: "ترتيب اللقطات بشكل احترافي" },
        { title: "إضافة الموسيقى والمؤثرات" },
        { title: "تعديل الألوان (Color Correction)" },
        { title: "الترانزيشن" },
        { title: "عزل الخلفية" },
        { title: "الكروما وازالتها" },
        { title: "ازاى استخدم الكى فريم" },
        { title: "ازاى اعمل ماسك" },
        { title: "تصدير الفيديو بأعلى جودة للسوشيال ميدي" },
      ],
    },
  ],
};

export const audienceContent = {
  eyebrow: "لمين الكورس",
  title: {
    before: "الكورس ده",
    highlight: "ليك",
    after: "لو…",
  },
  items: [
    {
      icon: "Smartphone",
      title: "صاحب موبايل وعايز تستفيد منه",
      description: "ومش عارف إزاي تطلع منه أحسن صور ممكنة",
    },
    {
      icon: "Camera",
      title: "مبتدئ في التصوير",
      description: "ومش قادر تشتري كاميرا احترافية دلوقتي",
    },
    {
      icon: "Instagram",
      title: "صاحب محتوى على السوشيال ميديا",
      description: "وعايز ترفع جودة محتواك البصري",
    },
    {
      icon: "Briefcase",
      title: "صاحب مشروع صغير",
      description: "بتصور منتجاتك بنفسك وعايز نتايج احترافية",
    },
    {
      icon: "Heart",
      title: "بتحب توثق ذكرياتك",
      description: "بشكل يستحق إنه يتحفظ ويتشاف",
    },
  ],
};

export const testimonialsContent = {
  eyebrow: "آراء طلابي",
  title: {
    before: "نتايج",
    highlight: "حقيقية",
    after: "لطلاب حقيقيين",
  },
  brief: "مش مجرد كلام — ده شغل طلابي بعد الكورس وردود أفعالهم.",
  imagesHeading: "رسايل من طلابي",
  videosHeading: "أراء بعض الطلاب على إنستجرام",
  // Placeholder testimonial images (WhatsApp screenshots placeholders)
  images: [
    { src: "/testimonials/1.jpeg", alt: "رسالة من طالب", aspect: "tall" },
    { src: "/testimonials/2.jpeg", alt: "رسالة من طالب", aspect: "wide" },
    { src: "/testimonials/3.jpeg", alt: "رسالة من طالب", aspect: "square" },
    { src: "/testimonials/4.jpeg", alt: "رسالة من طالب", aspect: "tall" },
    { src: "/testimonials/5.jpeg", alt: "رسالة من طالب", aspect: "wide" },
  ],
  // Placeholder Instagram embed URLs - replace with real ones
  videos: [
    { permalink: "https://www.instagram.com/reel/DW9pqLgEo6c" },
    { permalink: "https://www.instagram.com/reel/DWzTst7AUhi" },
    { permalink: "https://www.instagram.com/reel/DWhDdSQE15Z" },
  ],
};

export const contactContent = {
  eyebrow: "اتصل بنا",
  title: {
    before: "جاهز",
    highlight: "تبدأ",
    after: "رحلتك؟",
  },
  brief: "اختار الطريقة الأنسب ليك للتواصل، وهنرد عليك في أقرب وقت.",
  buttons: [
    { type: "phone", label: "اتصل بنا", value: "+201012205238", icon: "Phone" },
    { type: "whatsapp", label: "واتساب", value: "ابعت رسالة", icon: "MessageCircle" },
    { type: "email", label: "البريد الإلكتروني", value: "mahmoudsherief6@gmail.com", icon: "Mail" },
  ],
  socialHeading: "تابعنا على السوشيال ميديا",
};

export const featuresContent = {
  eyebrow: "مميزات الكورس",
  title: {
    before: "ليه الكورس ده",
    highlight: "مختلف",
    after: "",
  },
  brief: "مش بس فيديوهات. تجربة تعليم كاملة تفضل معاك طول عمرك.",
  items: [
    {
      icon: "Download",
      title: "ملفات ومراجع للتحميل",
      description: "كل درس معاه الملفات والمراجع اللي تحتاجها (مش الفيديوهات).",
    },
    {
      icon: "Infinity",
      title: "وصول مدى الحياة",
      description: "اشتري الكورس مرة، وادخل عليه في أي وقت — بدون أي اشتراكات.",
    },
    {
      icon: "RefreshCw",
      title: "تحديثات مستمرة",
      description: "الكورس بيتحدّث مع كل جديد في عالم التصوير بالموبايل.",
    },
    {
      icon: "MessageSquare",
      title: "مجتمع واتساب خاص",
      description: "جروب حصري لطلاب الكورس للنقاش والرد على استفساراتك.",
    },
    {
      icon: "Calendar",
      title: "ميتنج شهري",
      description: "لقاء شهري مع محمود للمراجعة والـ feedback على شغلك.",
    },
  ],
};

export const pricingContent = {
  eyebrow: "اشترك دلوقتي",
  title: {
    before: "ابدأ رحلتك بسعر",
    highlight: "الإطلاق",
    after: "",
  },
  brief: "فرصة محدودة بمناسبة إطلاق الكورس.",
  originalPrice: "2,000",
  discountedPrice: "1,000",
  currency: "ج.م",
  discountBadge: "خصم 50% لفترة محدودة",
  ctaLabel: "اشترك الآن",
  ctaHref: "/subscribe",
  includes: [
    "وصول كامل للكورس مدى الحياة",
    "ملفات ومراجع قابلة للتحميل",
    "عضوية في مجتمع الواتساب الخاص",
    "ميتنج شهري مع محمود",
    "تحديثات مستمرة للمحتوى",
  ],
  guarantee: {
    title: "ضمان الاسترجاع",
    description: "لو محتوى الكورس مش عاجبك لأي سبب، نرجّعلك فلوسك كاملة خلال أسبوع من الشراء. بدون أسئلة.",
    duration: "7 أيام",
  },
};

export const offlineCourseContent = {
  eyebrow: "كورس أوفلاين",
  title: {
    before: "تجربة",
    highlight: "ميدانية",
    after: "في القاهرة",
  },
  // Toggle between two states by flipping isScheduled.
  // When true, fill in `scheduled` with real details. When false, show the waitlist CTA.
  isScheduled: false,
  scheduled: {
    date: "",           // e.g. "15 يناير 2026"
    time: "",           // e.g. "من 10 صباحاً لـ 4 عصراً"
    location: "",       // e.g. "مدينة نصر، القاهرة"
    mapUrl: "",         // Google Maps link (optional)
    price: "",          // e.g. "2,500 ج.م"
    seatsRemaining: "", // e.g. "آخر 5 مقاعد"
    ctaLabel: "احجز مكانك",
    ctaHref: "/subscribe", // or specific offline-signup URL
  },
  notScheduled: {
    headline: "مفيش كورس أوفلاين محدد حالياً",
    description: "بنحضّر الدفعة الجاية بكل اهتمام. ابعتلنا رسالة على الواتساب وأول ما نحدّد موعد، هتكون أول واحد يعرف.",
    ctaLabel: "اشترك في القائمة",
    // Uses config.whatsappDetails — the component should import from config
  },
};

export const faqContent = {
  eyebrow: "أسئلة شائعة",
  title: {
    before: "كل اللي محتاج",
    highlight: "تعرفه",
    after: "",
  },
  brief: "لسه عندك سؤال؟ ابعتلنا على الواتساب.",
  items: [
    {
      question: "محتاج أكون عندي خبرة في التصوير قبل الكورس؟",
      answer: "لا خالص. الكورس من الصفر، ومصمم بحيث أي حد معاه موبايل سمارت يقدر يلحق من أول درس.",
    },
    {
      question: "موبايلي عادي، هينفع أستفيد من الكورس؟",
      answer: "أيوة. المطلوب الوحيد هو موبايل سمارت — iPhone أو Android — من أي فئة. الكورس بيعلّمك تطلّع أقصى استفادة من اللي معاك.",
    },
    {
      question: "الدروس بأي لغة ولهجة؟",
      answer: "الكورس كله بالعربي المصري الدارج. بدون أي تعقيد أو مصطلحات صعبة.",
    },
    {
      question: "لما أشتري الكورس، مدة الوصول قد إيه؟",
      answer: "وصول مدى الحياة. دفعة واحدة، وهتقدر تدخل على المحتوى في أي وقت، بدون أي اشتراكات.",
    },
    {
      question: "لو مش عاجبني المحتوى، أقدر أرجّع فلوسي؟",
      answer: "أيوة. عندك ضمان استرجاع كامل خلال أسبوع من الشراء، بدون أسئلة. لو مش عاجبك، نرجّعلك مبلغك بالكامل.",
    },
    {
      question: "إزاي أقدر أدفع؟",
      answer: "دلوقتي بندعم الدفع عن طريق InstaPay و Vodafone Cash. بتدفع وبترفع إيصال الدفع من خلال الموقع، وبيتم تفعيل حسابك خلال ساعات.",
    },
    {
      question: "فيه دروس أقدر أشوفها مجاناً قبل الشراء؟",
      answer: "أيوة. في 2-3 دروس متاحة مجاناً عشان تاخد فكرة عن أسلوب الشرح والمحتوى قبل ما تقرر.",
    },
    {
      question: "الكورس بيتحدّث ولا هو ثابت؟",
      answer: "بيتحدّث بشكل مستمر. أي جديد في عالم التصوير بالموبايل (تطبيقات، تقنيات، إعدادات) بنضيفه للكورس وبيوصلك مجاناً.",
    },
  ],
};

export const footerContent = {
  tagline: "كل صورة بتحكي حكاية. تعلّم تحكي حكايتك.",
  copyright: "© ٢٠٢٥ Mahmoud Sherief. جميع الحقوق محفوظة.",
  navHeading: "روابط سريعة",
};
