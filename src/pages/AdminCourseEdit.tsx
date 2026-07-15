import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { CourseEditor } from "@/components/admin/CourseEditor";
import { useCourses } from "@/lib/courses-store";

export default function AdminCourseEdit() {
  const { courseId } = useParams<{ courseId: string }>();
  const { courses } = useCourses();
  const course = courses.find((c) => c.id === courseId);

  return (
    <AdminGuard>
      <Link
        to="/admin/courses"
        className="inline-flex items-center gap-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-fg)] transition-colors mb-4"
      >
        <ArrowLeft size={16} className="flip-rtl" />
        رجوع للكورسات
      </Link>

      {course ? (
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5">
          <h1 className="text-xl font-bold mb-5" style={{ fontFamily: "var(--font-display)" }}>
            {course.title}
          </h1>
          <CourseEditor course={course} />
        </div>
      ) : (
        <p className="text-[var(--color-muted)] text-sm">الكورس مش موجود.</p>
      )}
    </AdminGuard>
  );
}
