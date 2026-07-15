import { AcademyHeader } from "@/components/academy/AcademyHeader";
import { CourseCard } from "@/components/academy/CourseCard";
import { courses } from "@/lib/academy-data";

export default function Academy() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)]" dir="rtl">
      <AcademyHeader />

      <main className="max-w-7xl mx-auto px-5 md:px-8 py-10 md:py-14">
        <div className="mb-10">
          <h1
            className="text-display-md font-bold mb-2"
            style={{ fontFamily: "var(--font-display)" }}
          >
            الأكاديمية
          </h1>
          <p className="text-[var(--color-muted)]">كل الكورسات المتاحة ليك في مكان واحد</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, i) => (
            <CourseCard key={course.id} course={course} index={i} />
          ))}
        </div>
      </main>
    </div>
  );
}
