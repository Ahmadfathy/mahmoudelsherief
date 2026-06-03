/**
 * All user-facing Arabic content.
 * Replace placeholder text with real copy when ready.
 */

export const navItems = [
  { id: "hero", label: "الرئيسية", number: "01" },
  { id: "about", label: "من أنا", number: "02" },
  { id: "course", label: "محتوى الكورس", number: "03" },
  { id: "audience", label: "لمين الكورس", number: "04" },
  { id: "testimonials", label: "آراء العملاء", number: "05" },
  { id: "contact", label: "اتصل بنا", number: "06" },
] as const;

export const heroContent = {
  eyebrow: "كورس أوفلاين · القاهرة",
  title: {
    before: "اتقن فن",
    highlight: "التصوير بالموبايل",
    after: "خطوة بخطوة",
  },
  brief:
    "كورس عملي مكثف يحوّل موبايلك من مجرد كاميرا إلى أداة احترافية. هتتعلم الإضاءة، التكوين، التحرير، والـ storytelling من الصفر للاحتراف.",
  originalPrice: "3,500",
  discountedPrice: "1,999",
  currency: "ج.م",
  ctaPrimary: "اشترك الآن",
  ctaSecondary: "اعرف التفاصيل",
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
        "تجهيز الموبايل قبل التصوير",
        "أفضل إعدادات الكاميرا للتصوير الاحترافي",
        "فهم جودة الفيديو والفريمات والرزليوشن",
        "عدسة الموبايل وتحسين جودة الصورة",
        "أهم الأخطاء اللي بتبوظ الفيديو",
      ],
    },
    {
      number: "02",
      title: "التصوير الحركي والزوايا",
      duration: "ساعتين",
      lessons: [
        "التحرك بالموبايل بشكل ثابت واحترافي",
        "أنواع الحركات السينمائية",
        "تصوير الـ B-Roll بشكل احترافي",
        "أفضل الزوايا لتصوير المنتجات والأشخاص",
        "تصوير المشاهد الـ Slow Motion",
      ],
    },
    {
      number: "03",
      title: "إتقان الإضاءة",
      duration: "ساعتين",
      lessons: [
        "فهم الإضاءة الطبيعية والصناعية",
        "التصوير في ضوء الشمس بشكل صحيح",
        "توزيع الإضاءة داخل الاستوديو",
        "التحكم في الظلال والهايلايت",
        "أفضل أماكن واتجاهات الإضاءة",
      ],
    },
    {
      number: "04",
      title: "المونتاج وتحرير الفيديو",
      duration: "٣ ساعات",
      lessons: [
        "أساسيات المونتاج للمبتدئين",
        "ترتيب اللقطات بشكل احترافي",
        "إضافة الموسيقى والمؤثرات",
        "تعديل الألوان (Color Correction)",
        "الترانزيشن",
        "عزل الخلفية",
        "الكروما وازالتها",
        "ازاى استخدم الكى فريم",
        "ازاى اعمل ماسك",
        "تصدير الفيديو بأعلى جودة للسوشيال ميدي",
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
    { type: "email", label: "البريد الإلكتروني", value: "info@example.com", icon: "Mail" },
  ],
  socialHeading: "تابعنا على السوشيال ميديا",
};

export const footerContent = {
  tagline: "كل صورة بتحكي حكاية. تعلّم تحكي حكايتك.",
  copyright: "© ٢٠٢٥ Mahmoud Sherief. جميع الحقوق محفوظة.",
  navHeading: "روابط سريعة",
};
