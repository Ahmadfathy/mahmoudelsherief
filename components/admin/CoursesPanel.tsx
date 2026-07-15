import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ChevronLeft, Plus, Trash2 } from "lucide-react";
import { useCourses } from "@/lib/courses-store";

export function CoursesPanel() {
  const { courses, addCourse, deleteCourse } = useCourses();
  const navigate = useNavigate();
  const [showAddForm, setShowAddForm] = useState(false);

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [instructorName, setInstructorName] = useState("");
  const [instructorTitle, setInstructorTitle] = useState("");
  const [instructorBio, setInstructorBio] = useState("");
  const [requiresSubscription, setRequiresSubscription] = useState(true);

  function handleAddCourse(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    const course = addCourse({
      title: title.trim(),
      subtitle: subtitle.trim(),
      requiresSubscription,
      instructorName: instructorName.trim(),
      instructorTitle: instructorTitle.trim(),
      instructorBio: instructorBio.trim(),
    });
    setTitle("");
    setSubtitle("");
    setInstructorName("");
    setInstructorTitle("");
    setInstructorBio("");
    setRequiresSubscription(true);
    setShowAddForm(false);
    navigate(`/admin/courses/${course.id}`);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-[var(--color-muted)]">{courses.length} كورس</p>
        <button
          type="button"
          onClick={() => setShowAddForm((s) => !s)}
          className="inline-flex items-center gap-1.5 h-9 px-4 rounded-full bg-[var(--color-primary)] text-white text-sm font-bold hover:opacity-90 transition-opacity"
        >
          <Plus size={15} />
          كورس جديد
        </button>
      </div>

      {showAddForm && (
        <form
          onSubmit={handleAddCourse}
          className="space-y-2 p-4 mb-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)]"
        >
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="عنوان الكورس"
            required
            className="w-full h-10 px-3 text-sm rounded-md border border-[var(--color-border)] bg-[var(--color-bg)]"
          />
          <input
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="وصف مختصر"
            className="w-full h-10 px-3 text-sm rounded-md border border-[var(--color-border)] bg-[var(--color-bg)]"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input
              type="text"
              value={instructorName}
              onChange={(e) => setInstructorName(e.target.value)}
              placeholder="اسم المدرب"
              className="h-10 px-3 text-sm rounded-md border border-[var(--color-border)] bg-[var(--color-bg)]"
            />
            <input
              type="text"
              value={instructorTitle}
              onChange={(e) => setInstructorTitle(e.target.value)}
              placeholder="وصف المدرب"
              className="h-10 px-3 text-sm rounded-md border border-[var(--color-border)] bg-[var(--color-bg)]"
            />
          </div>
          <textarea
            value={instructorBio}
            onChange={(e) => setInstructorBio(e.target.value)}
            placeholder="نبذة عن المدرب"
            rows={2}
            className="w-full px-3 py-2 text-sm rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] resize-none"
          />
          <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
            <input
              type="checkbox"
              checked={requiresSubscription}
              onChange={(e) => setRequiresSubscription(e.target.checked)}
              className="w-4 h-4 accent-[var(--color-primary)]"
            />
            يتطلب اشتراك مفعّل
          </label>
          <button
            type="submit"
            className="h-9 px-4 rounded-full bg-[var(--color-primary)] text-white text-sm font-bold hover:opacity-90 transition-opacity"
          >
            إضافة الكورس
          </button>
        </form>
      )}

      <div className="space-y-3">
        {courses.map((course) => (
          <div
            key={course.id}
            className="flex items-center justify-between gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-4"
          >
            <Link
              to={`/admin/courses/${course.id}`}
              className="flex-1 flex items-center justify-between gap-3"
            >
              <div>
                <p className="font-bold">{course.title}</p>
                <p className="text-xs text-[var(--color-muted)]">
                  {course.units.length} وحدة ·{" "}
                  {course.units.reduce((n, u) => n + u.lessons.length, 0)} درس ·{" "}
                  {course.requiresSubscription ? "يتطلب اشتراك" : "مجاني"}
                </p>
              </div>
              <ChevronLeft size={18} className="shrink-0 flip-rtl text-[var(--color-muted)]" />
            </Link>
            <button
              type="button"
              onClick={() => {
                if (confirm(`تحذف كورس "${course.title}" بالكامل؟`)) {
                  deleteCourse(course.id);
                }
              }}
              aria-label="حذف الكورس"
              className="grid place-items-center w-9 h-9 rounded-full text-[var(--color-muted)] hover:bg-red-500/10 hover:text-red-500 transition-colors shrink-0"
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
