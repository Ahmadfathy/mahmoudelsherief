import { useMemo, useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  CheckCircle2,
  Circle,
  PlayCircle,
  Lock,
  Link2,
  FileDown,
  ArrowLeft,
} from "lucide-react";
import { AcademyHeader } from "@/components/academy/AcademyHeader";
import type { Lesson } from "@/lib/academy-data";
import { useCourses } from "@/lib/courses-store";
import { useAuth } from "@/lib/auth-context";
import { useCourseProgress } from "@/lib/progress";

function getEmbedUrl(url: string): string | null {
  const yt = url.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=|youtube\.com\/embed\/)([\w-]+)/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return null;
}

export default function CourseDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { user, hasAccess } = useAuth();
  const { courses } = useCourses();
  const course = courses.find((c) => c.slug === slug);

  const flatLessons = useMemo(
    () => course?.units.flatMap((u) => u.lessons) ?? [],
    [course]
  );

  const [openUnitId, setOpenUnitId] = useState(course?.units[0]?.id ?? "");
  const [activeLessonId, setActiveLessonId] = useState(flatLessons[0]?.id ?? "");

  const { isCompleted, markCompleted } = useCourseProgress(course?.id ?? "");

  if (!course) {
    return <Navigate to="/academy" replace />;
  }

  const locked = course.requiresSubscription && !hasAccess(course.slug);
  const activeLesson: Lesson | undefined =
    flatLessons.find((l) => l.id === activeLessonId) ?? flatLessons[0];
  const activeIndex = flatLessons.findIndex((l) => l.id === activeLesson?.id);
  const nextLesson = activeIndex >= 0 ? flatLessons[activeIndex + 1] : undefined;

  function selectLesson(lessonId: string) {
    setActiveLessonId(lessonId);
  }

  function goNext() {
    if (!activeLesson) return;
    markCompleted(activeLesson.id);
    if (nextLesson) setActiveLessonId(nextLesson.id);
  }

  const embedUrl = activeLesson?.videoUrl ? getEmbedUrl(activeLesson.videoUrl) : null;

  return (
    <div className="min-h-screen bg-[var(--color-bg)]" dir="rtl">
      <AcademyHeader />

      <div className="max-w-7xl mx-auto px-5 md:px-8 py-6">
        <Link
          to="/academy"
          className="inline-flex items-center gap-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-fg)] transition-colors mb-4"
        >
          <ArrowLeft size={16} className="flip-rtl" />
          رجوع للأكاديمية
        </Link>

        {locked ? (
          <PaywallCard courseTitle={course.title} isLoggedIn={!!user} />
        ) : (
          <div className="flex flex-col-reverse lg:flex-row gap-6">
            {/* Main content */}
            <div className="flex-1 min-w-0">
              <div className="rounded-2xl overflow-hidden border border-[var(--color-border)] bg-black aspect-video grid place-items-center">
                {embedUrl ? (
                  <iframe
                    src={embedUrl}
                    title={activeLesson?.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                ) : activeLesson?.videoUrl ? (
                  <video src={activeLesson.videoUrl} controls className="w-full h-full" />
                ) : (
                  <div className="text-center text-white/60 p-8">
                    <PlayCircle size={40} className="mx-auto mb-3" strokeWidth={1.5} />
                    <p>الفيديو هيتم رفعه قريباً</p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between gap-3 mt-4">
                <button
                  type="button"
                  onClick={goNext}
                  disabled={!nextLesson}
                  className="inline-flex items-center gap-2 h-11 px-5 rounded-full border-2 border-[var(--color-fg)] text-[var(--color-fg)] font-bold text-sm hover:bg-[var(--color-fg)] hover:text-[var(--color-bg)] transition-colors disabled:opacity-40 disabled:pointer-events-none"
                >
                  الدرس التالي
                </button>

                {activeLesson && isCompleted(activeLesson.id) && (
                  <span className="inline-flex items-center gap-1.5 text-green-500 text-sm font-bold">
                    <CheckCircle2 size={18} />
                    مكتمل
                  </span>
                )}
              </div>

              {activeLesson && (
                <div className="mt-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 md:p-6">
                  <h2
                    className="text-xl font-bold mb-2"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {activeLesson.title}
                  </h2>
                  {activeLesson.description && (
                    <p className="text-[var(--color-muted)] leading-relaxed mb-4">
                      {activeLesson.description}
                    </p>
                  )}

                  {(activeLesson.links?.length || activeLesson.files?.length) && (
                    <div className="space-y-2 pt-2 border-t border-dashed border-[var(--color-border)]">
                      {activeLesson.links?.map((link) => (
                        <a
                          key={link.url}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-[var(--color-primary)] hover:underline text-sm py-1"
                        >
                          <Link2 size={16} />
                          {link.label}
                        </a>
                      ))}
                      {activeLesson.files?.map((file) => (
                        <a
                          key={file.url}
                          href={file.url}
                          download
                          className="flex items-center gap-2 text-[var(--color-primary)] hover:underline text-sm py-1"
                        >
                          <FileDown size={16} />
                          {file.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <InstructorCard
                name={course.instructor.name}
                title={course.instructor.title}
                bio={course.instructor.bio}
              />
            </div>

            {/* Lessons sidebar */}
            <aside className="lg:w-80 shrink-0">
              <div className="lg:sticky lg:top-20 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] overflow-hidden max-h-[70vh] overflow-y-auto">
                {course.units.map((unit) => {
                  const isOpen = openUnitId === unit.id;
                  return (
                    <div key={unit.id} className="border-b border-[var(--color-border)] last:border-b-0">
                      <button
                        type="button"
                        onClick={() => setOpenUnitId(isOpen ? "" : unit.id)}
                        aria-expanded={isOpen}
                        className="w-full flex items-center justify-between gap-3 p-4 text-start hover:bg-[var(--color-subtle)] transition-colors"
                      >
                        <span className="font-bold text-sm leading-snug">{unit.title}</span>
                        <motion.span
                          animate={{ rotate: isOpen ? 180 : 0 }}
                          transition={{ duration: 0.25 }}
                          className="shrink-0"
                        >
                          <ChevronDown size={16} />
                        </motion.span>
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            style={{ overflow: "hidden" }}
                          >
                            <ul>
                              {unit.lessons.map((lesson) => {
                                const active = lesson.id === activeLesson?.id;
                                const done = isCompleted(lesson.id);
                                return (
                                  <li key={lesson.id}>
                                    <button
                                      type="button"
                                      onClick={() => selectLesson(lesson.id)}
                                      className={`w-full flex items-center gap-3 py-3 ps-8 pe-4 text-start text-sm transition-colors
                                        ${active ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-bold" : "hover:bg-[var(--color-subtle)]"}`}
                                    >
                                      {done ? (
                                        <CheckCircle2 size={16} className="shrink-0 text-green-500" />
                                      ) : (
                                        <Circle size={16} className="shrink-0 text-[var(--color-muted)]" />
                                      )}
                                      <span className="leading-snug">{lesson.title}</span>
                                    </button>
                                  </li>
                                );
                              })}
                            </ul>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}

function PaywallCard({ courseTitle, isLoggedIn }: { courseTitle: string; isLoggedIn: boolean }) {
  return (
    <div className="max-w-lg mx-auto text-center py-16 px-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)]">
      <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-[var(--color-subtle)] grid place-items-center">
        <Lock size={28} className="text-[var(--color-primary)]" strokeWidth={1.75} />
      </div>
      <h1 className="text-xl font-bold mb-2" style={{ fontFamily: "var(--font-display)" }}>
        {courseTitle}
      </h1>
      <p className="text-[var(--color-muted)] mb-6">
        {isLoggedIn
          ? "الكورس ده لسه معندكش صلاحية تدخله. لو دفعت الاشتراك، استنى موافقة الأدمن."
          : "الكورس ده متاح للمشتركين بس. سجّل طلب اشتراك عشان يتفعّلك."}
      </p>
      <Link
        to="/academy/subscribe"
        className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-[var(--color-primary)] text-white font-bold hover:opacity-90 transition-opacity"
      >
        {isLoggedIn ? "طلب اشتراك تاني" : "سجّل طلب اشتراك"}
      </Link>
    </div>
  );
}

function InstructorCard({ name, title, bio }: { name: string; title: string; bio: string }) {
  return (
    <div className="mt-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 md:p-6">
      <h3 className="text-xs font-bold text-[var(--color-muted)] mb-4">المدرب</h3>
      <div className="flex items-start gap-4">
        <div
          className="w-12 h-12 shrink-0 rounded-full bg-[var(--color-primary)] text-white grid place-items-center font-bold"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {name.charAt(0)}
        </div>
        <div>
          <p className="font-bold">{name}</p>
          <p className="text-sm text-[var(--color-primary)] mb-2">{title}</p>
          <p className="text-sm text-[var(--color-muted)] leading-relaxed">{bio}</p>
        </div>
      </div>
    </div>
  );
}
