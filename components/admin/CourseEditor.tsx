import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Plus, Trash2, Pencil, ChevronDown, ImageUp } from "lucide-react";
import type { Course } from "@/lib/academy-data";
import { useCourses } from "@/lib/courses-store";
import { LessonEditorForm } from "./LessonEditorForm";
import { friendlyApiError } from "@/lib/api";

export function CourseEditor({ course }: { course: Course }) {
  const {
    updateCourse,
    addUnit,
    updateUnit,
    deleteUnit,
    addLesson,
    updateLesson,
    deleteLesson,
  } = useCourses();

  const [title, setTitle] = useState(course.title);
  const [subtitle, setSubtitle] = useState(course.subtitle);
  const [requiresSubscription, setRequiresSubscription] = useState(course.requiresSubscription);
  const [price, setPrice] = useState(String(course.price ?? 0));
  const [isPublished, setIsPublished] = useState(course.isPublished ?? false);
  const [instructorName, setInstructorName] = useState(course.instructor.name);
  const [instructorTitle, setInstructorTitle] = useState(course.instructor.title);
  const [instructorBio, setInstructorBio] = useState(course.instructor.bio);
  const [coverPreview, setCoverPreview] = useState(course.coverImageUrl ?? "");
  const [coverUploading, setCoverUploading] = useState(false);
  const [coverError, setCoverError] = useState("");
  const [lessonNotice, setLessonNotice] = useState("");
  const coverInputRef = useRef<HTMLInputElement>(null);

  const [newUnitTitle, setNewUnitTitle] = useState("");
  const [openUnitId, setOpenUnitId] = useState<string | null>(null);
  const [addingLessonUnitId, setAddingLessonUnitId] = useState<string | null>(null);
  const [editingLesson, setEditingLesson] = useState<{ unitId: string; lessonId: string } | null>(
    null
  );

  useEffect(() => {
    if (!lessonNotice) return;
    const timeout = window.setTimeout(() => setLessonNotice(""), 4500);
    return () => window.clearTimeout(timeout);
  }, [lessonNotice]);

  function saveMeta() {
    updateCourse(course.id, {
      title,
      subtitle,
      requiresSubscription: Number(price) > 0 && requiresSubscription,
      price: Number(price) || 0,
      isPublished,
      instructor: { name: instructorName, title: instructorTitle, bio: instructorBio },
    });
  }

  function handleAddUnit(e: React.FormEvent) {
    e.preventDefault();
    if (!newUnitTitle.trim()) return;
    addUnit(course.id, newUnitTitle.trim());
    setNewUnitTitle("");
  }

  async function handleCoverChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const localPreview = URL.createObjectURL(file);
    setCoverPreview(localPreview);
    setCoverUploading(true);
    setCoverError("");
    try {
      const updated = await updateCourse(course.id, { coverImageFile: file });
      setCoverPreview(updated.coverImageUrl ?? localPreview);
    } catch (uploadError) {
      setCoverPreview(course.coverImageUrl ?? "");
      setCoverError(friendlyApiError(uploadError, "تعذر رفع صورة الكورس."));
    } finally {
      URL.revokeObjectURL(localPreview);
      setCoverUploading(false);
      event.target.value = "";
    }
  }

  return (
    <div className="space-y-5">
      {lessonNotice && (
        <div className="fixed start-1/2 top-5 z-[260] flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center gap-3 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-green-800 shadow-xl" role="status">
          <CheckCircle2 size={22} className="shrink-0" />
          <p className="text-sm font-bold">{lessonNotice}</p>
        </div>
      )}
      {/* Course meta */}
      <div className="space-y-2">
        <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-subtle)]">
          <div className="relative grid aspect-[16/5] place-items-center overflow-hidden">
            {coverPreview ? (
              <img src={coverPreview} alt={`غلاف ${course.title}`} className="h-full w-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-2 text-[var(--color-muted)]">
                <ImageUp size={32} strokeWidth={1.5} />
                <span className="text-sm">لم تتم إضافة صورة للكورس</span>
              </div>
            )}
            <input ref={coverInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleCoverChange} className="hidden" />
            <button type="button" disabled={coverUploading} onClick={() => coverInputRef.current?.click()} className="absolute bottom-3 end-3 inline-flex h-10 items-center gap-2 rounded-full bg-[var(--color-primary)] px-4 text-sm font-bold text-white shadow-lg transition-opacity hover:opacity-90 disabled:opacity-60">
              <ImageUp size={17} />
              {coverUploading ? "جاري رفع الصورة..." : coverPreview ? "تغيير صورة الكورس" : "رفع صورة للكورس"}
            </button>
          </div>
          {coverError && <p className="px-4 py-2 text-sm font-bold text-red-500">{coverError}</p>}
        </div>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={saveMeta}
          placeholder="عنوان الكورس"
          className="w-full h-10 px-3 text-sm rounded-md border border-[var(--color-border)] bg-[var(--color-bg)]"
        />
        <input
          type="number"
          min="0"
          value={price}
          onChange={(e) => {
            setPrice(e.target.value);
            if (Number(e.target.value) <= 0) setRequiresSubscription(false);
          }}
          onBlur={saveMeta}
          placeholder="سعر الكورس بالجنيه"
          className="w-full h-10 px-3 text-sm rounded-md border border-[var(--color-border)] bg-[var(--color-bg)]"
        />
        <input
          type="text"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          onBlur={saveMeta}
          placeholder="وصف مختصر"
          className="w-full h-10 px-3 text-sm rounded-md border border-[var(--color-border)] bg-[var(--color-bg)]"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <input
            type="text"
            value={instructorName}
            onChange={(e) => setInstructorName(e.target.value)}
            onBlur={saveMeta}
            placeholder="اسم المدرب"
            className="h-10 px-3 text-sm rounded-md border border-[var(--color-border)] bg-[var(--color-bg)]"
          />
          <input
            type="text"
            value={instructorTitle}
            onChange={(e) => setInstructorTitle(e.target.value)}
            onBlur={saveMeta}
            placeholder="وصف المدرب"
            className="h-10 px-3 text-sm rounded-md border border-[var(--color-border)] bg-[var(--color-bg)]"
          />
        </div>
        <textarea
          value={instructorBio}
          onChange={(e) => setInstructorBio(e.target.value)}
          onBlur={saveMeta}
          placeholder="نبذة عن المدرب"
          rows={2}
          className="w-full px-3 py-2 text-sm rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] resize-none"
        />
        <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
          <input
            type="checkbox"
            checked={requiresSubscription}
            disabled={Number(price) <= 0}
            onChange={(e) => {
              setRequiresSubscription(e.target.checked);
              updateCourse(course.id, { requiresSubscription: e.target.checked });
            }}
            className="w-4 h-4 accent-[var(--color-primary)]"
          />
          {Number(price) <= 0 ? "مجاني تلقائيًا — لا يحتاج اشتراك" : "يتطلب اشتراك مفعّل"}
        </label>
        <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
          <input
            type="checkbox"
            checked={isPublished}
            onChange={(e) => {
              setIsPublished(e.target.checked);
              void updateCourse(course.id, { isPublished: e.target.checked });
            }}
            className="w-4 h-4 accent-[var(--color-primary)]"
          />
          منشور للطلاب
        </label>
      </div>

      {/* Units */}
      <div>
        <p className="text-sm font-bold mb-2">الوحدات والدروس</p>
        <div className="space-y-2">
          {course.units.map((unit) => {
            const isOpen = openUnitId === unit.id;
            return (
              <div
                key={unit.id}
                className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] overflow-hidden"
              >
                <div className="flex items-center gap-2 p-2.5">
                  <button
                    type="button"
                    onClick={() => setOpenUnitId(isOpen ? null : unit.id)}
                    className="flex-1 flex items-center justify-between gap-2 text-start"
                  >
                    <span className="text-sm font-bold">{unit.title}</span>
                    <ChevronDown
                      size={16}
                      className={`shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const next = prompt("عنوان الوحدة", unit.title);
                      if (next && next.trim()) updateUnit(course.id, unit.id, next.trim());
                    }}
                    aria-label="تعديل عنوان الوحدة"
                    className="grid place-items-center w-8 h-8 rounded-full hover:bg-[var(--color-subtle)] transition-colors"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`تحذف وحدة "${unit.title}" وكل دروسها؟`)) {
                        deleteUnit(course.id, unit.id);
                      }
                    }}
                    aria-label="حذف الوحدة"
                    className="grid place-items-center w-8 h-8 rounded-full hover:bg-red-500/10 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                {isOpen && (
                  <div className="p-2.5 pt-0 space-y-2">
                    {unit.lessons.map((lesson) =>
                      editingLesson?.unitId === unit.id && editingLesson.lessonId === lesson.id ? (
                        <LessonEditorForm
                          key={lesson.id}
                          initial={lesson}
                          onCancel={() => setEditingLesson(null)}
                          onSubmit={async (patch) => {
                            await updateLesson(course.id, unit.id, lesson.id, patch);
                            setLessonNotice(patch.videoFile ? "تم رفع الفيديو وتحديث الدرس بنجاح." : patch.thumbnailFile ? "تم رفع صورة الفيديو وتحديث الدرس بنجاح." : "تم تحديث الدرس بنجاح.");
                            setEditingLesson(null);
                          }}
                        />
                      ) : (
                        <div
                          key={lesson.id}
                          className="flex items-center justify-between gap-2 p-2.5 rounded-md bg-[var(--color-subtle)] text-sm"
                        >
                          <span className="flex min-w-0 items-center gap-3">
                            {lesson.thumbnailImageUrl && <img src={lesson.thumbnailImageUrl} alt="" className="h-10 w-16 shrink-0 rounded-md border border-[var(--color-border)] object-cover" />}
                            <span className="truncate">{lesson.title}</span>
                          </span>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => setEditingLesson({ unitId: unit.id, lessonId: lesson.id })}
                              aria-label="تعديل الدرس"
                              className="grid place-items-center w-7 h-7 rounded-full hover:bg-[var(--color-card)] transition-colors"
                            >
                              <Pencil size={13} />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`تحذف درس "${lesson.title}"؟`)) {
                                  deleteLesson(course.id, unit.id, lesson.id);
                                }
                              }}
                              aria-label="حذف الدرس"
                              className="grid place-items-center w-7 h-7 rounded-full hover:bg-red-500/10 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      )
                    )}

                    {addingLessonUnitId === unit.id ? (
                      <LessonEditorForm
                        onCancel={() => setAddingLessonUnitId(null)}
                        onSubmit={async (lesson) => {
                          await addLesson(course.id, unit.id, lesson);
                          setLessonNotice(lesson.videoFile ? "تم رفع الفيديو وإضافة الدرس بنجاح." : lesson.thumbnailFile ? "تم رفع صورة الفيديو وإضافة الدرس بنجاح." : "تم إضافة الدرس بنجاح.");
                          setAddingLessonUnitId(null);
                        }}
                      />
                    ) : (
                      <button
                        type="button"
                        onClick={() => setAddingLessonUnitId(unit.id)}
                        className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full bg-[var(--color-subtle)] text-xs font-bold hover:bg-[var(--color-border)] transition-colors"
                      >
                        <Plus size={13} />
                        إضافة درس
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <form onSubmit={handleAddUnit} className="flex gap-2 mt-2">
          <input
            type="text"
            value={newUnitTitle}
            onChange={(e) => setNewUnitTitle(e.target.value)}
            placeholder="عنوان وحدة جديدة"
            className="flex-1 h-9 px-3 text-sm rounded-md border border-[var(--color-border)] bg-[var(--color-bg)]"
          />
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-full bg-[var(--color-primary)] text-white text-sm font-bold hover:opacity-90 transition-opacity"
          >
            <Plus size={14} />
            إضافة وحدة
          </button>
        </form>
      </div>
    </div>
  );
}
