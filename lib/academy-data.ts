// بيانات الأكاديمية — placeholder مؤقت لحد ما تتعمل لوحة التحكم
// شكل البيانات دا مصمم عشان يتحط بدل الملف دا مباشرة لو جه من API لاحقاً

export type LessonResourceLink = {
  label: string;
  url: string;
};

export type LessonResourceFile = {
  label: string;
  url: string;
};

export type Lesson = {
  id: string;
  title: string;
  durationLabel?: string;
  videoUrl?: string;
  description?: string;
  links?: LessonResourceLink[];
  files?: LessonResourceFile[];
};

export type Unit = {
  id: string;
  title: string;
  lessons: Lesson[];
};

export type Instructor = {
  name: string;
  title: string;
  avatarUrl?: string;
  bio: string;
};

export type Course = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  coverImageUrl?: string;
  requiresSubscription: boolean;
  instructor: Instructor;
  units: Unit[];
};

export const courses: Course[] = [
  {
    id: "photography-101",
    slug: "photography-101",
    title: "كورس التصوير بالموبايل",
    subtitle: "من الصفر للاحتراف — تصوير، إضاءة، وتعديل بالموبايل بس",
    requiresSubscription: true,
    instructor: {
      name: "محمود الشريف",
      title: "مصور ومدرب تصوير بالموبايل",
      bio: "مصور محترف بخبرة أكتر من 4 سنين في تصوير المنتجات والبورتريه بالموبايل، درّب مئات المصورين المبتدئين.",
    },
    units: [
      {
        id: "unit-0",
        title: 'الوحدة "صـفـر": مقدمة مهمة للكورس قبل ما تبدأ',
        lessons: [
          {
            id: "l-0-1",
            title: "هام جداً: تابع إيميلك اللي سجلت بيه علشان أي تحديث بيحصل بعدين",
            videoUrl: "",
            description: "تأكد إنك بتفتح الإيميل اللي سجلت بيه في الكورس بشكل دوري.",
          },
          {
            id: "l-0-2",
            title: "الكورس ده هيمشي إزاي؟ - محتوى الكورس",
            videoUrl: "",
          },
          {
            id: "l-0-3",
            title: "أهمية مهارة إدارة قنوات اليوتيوب",
            videoUrl: "",
          },
          {
            id: "l-0-4",
            title: "إزاي تفتكر سواء علي اللي بتتعلمه في الكورس؟",
            videoUrl: "",
          },
        ],
      },
      {
        id: "unit-1",
        title: "الوحدة الأولي: أساسيات التصوير",
        lessons: [
          {
            id: "l-1-1",
            title: "أساسيات الكادر والإضاءة",
            durationLabel: "12:30",
            videoUrl: "",
          },
          {
            id: "l-1-2",
            title: "إعدادات الكاميرا في الموبايل",
            durationLabel: "09:10",
            videoUrl: "",
            files: [{ label: "تحميل ملف إعدادات الكاميرا (PDF)", url: "#" }],
          },
        ],
      },
      {
        id: "unit-2",
        title: "الوحدة الثانية: إنشاء قناة يوتيوب من الصفر",
        lessons: [
          {
            id: "l-2-1",
            title: "خطوات إنشاء القناة",
            videoUrl: "",
          },
        ],
      },
      {
        id: "unit-3",
        title: "الوحدة الثالثة: شرح الـ YOUTUBE STUDIO بالتفصيل (السكان السحري لإدارة اليوتيوب)",
        lessons: [
          {
            id: "l-3-1",
            title: "جولة كاملة في اليوتيوب ستوديو",
            videoUrl: "",
            links: [{ label: "رابط اليوتيوب ستوديو", url: "https://studio.youtube.com" }],
          },
        ],
      },
      {
        id: "unit-4",
        title: "الوحدة الرابعة: أدوات لا غني عنها في إدارة قنوات اليوتيوب",
        lessons: [
          {
            id: "l-4-1",
            title: "أفضل الأدوات المجانية والمدفوعة",
            videoUrl: "",
          },
        ],
      },
    ],
  },
];

export function getCourseBySlug(slug: string): Course | undefined {
  return courses.find((c) => c.slug === slug);
}
