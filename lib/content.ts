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
    highlight: "٦ أقسام",
    after: "متكاملة",
  },
  brief:
    "كل قسم مبني على اللي قبله. هتنتقل من الأساسيات لمستوى احترافي بطريقة منظمة وممتعة.",
  stats: [
    { label: "ساعات", value: "15" },
    { label: "أقسام", value: "6" },
    { label: "محاضرات", value: "10" },
  ],
  sections: [
    {
      number: "01",
      title: "أساسيات التصوير بالموبايل",
      duration: "ساعتين",
      lessons: [
        "إعدادات الكاميرا الاحترافية في موبايلك",
        "فهم الإضاءة الطبيعية والصناعية",
        "قواعد التكوين الأساسية",
      ],
    },
    {
      number: "02",
      title: "فن التكوين والإطار",
      duration: "٣ ساعات",
      lessons: [
        "قاعدة الأثلاث والخطوط الإرشادية",
        "التماثل والتباين البصري",
        "استخدام العمق والمنظور",
      ],
    },
    {
      number: "03",
      title: "إتقان الإضاءة",
      duration: "٣ ساعات",
      lessons: [
        "الساعة الذهبية والساعة الزرقاء",
        "التصوير في الإضاءة الصعبة",
        "استخدام الإضاءة الاصطناعية",
      ],
    },
    {
      number: "04",
      title: "التصوير حسب النوع",
      duration: "٣ ساعات",
      lessons: [
        "تصوير البورتريه والأشخاص",
        "تصوير الطعام والمنتجات",
        "تصوير الشوارع والمعمار",
      ],
    },
    {
      number: "05",
      title: "تحرير الصور (Editing)",
      duration: "ساعتين",
      lessons: [
        "أساسيات Lightroom Mobile",
        "إنشاء presets خاصة بك",
        "تنسيق ألوان متّسق لحسابك",
      ],
    },
    {
      number: "06",
      title: "بناء هويتك البصرية",
      duration: "ساعتين",
      lessons: [
        "تطوير أسلوبك الخاص",
        "بناء portfolio احترافي",
        "تحويل الشغف لمصدر دخل",
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
    {
      icon: "TrendingUp",
      title: "عايز تتحول للاحتراف",
      description: "وتبدأ شغل freelance في التصوير",
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
    { src: "/testimonials/t1.jpg", alt: "رسالة من طالب", aspect: "tall" },
    { src: "/testimonials/t2.jpg", alt: "رسالة من طالب", aspect: "wide" },
    { src: "/testimonials/t3.jpg", alt: "رسالة من طالب", aspect: "square" },
    { src: "/testimonials/t4.jpg", alt: "رسالة من طالب", aspect: "tall" },
    { src: "/testimonials/t5.jpg", alt: "رسالة من طالب", aspect: "wide" },
    { src: "/testimonials/t6.jpg", alt: "رسالة من طالب", aspect: "square" },
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
  copyright: "© ٢٠٢٥ حووووودة. جميع الحقوق محفوظة.",
  navHeading: "روابط سريعة",
};
