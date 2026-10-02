import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
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
import { useAuthModal } from "@/lib/auth-modal-context";
import { useCourseProgress } from "@/lib/progress";
import { apiDownload, friendlyApiError, getStudentToken } from "@/lib/api";

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
  const { openLogin } = useAuthModal();
  const { courses, loadCourse } = useCourses();
  const course = courses.find((c) => c.slug === slug);
  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [protectedVideoUrl, setProtectedVideoUrl] = useState("");

  const flatLessons = useMemo(
    () => course?.units.flatMap((u) => u.lessons) ?? [],
    [course]
  );

  const [openUnitId, setOpenUnitId] = useState(course?.units[0]?.id ?? "");
  const [activeLessonId, setActiveLessonId] = useState(flatLessons[0]?.id ?? "");

  const courseLocked = course ? course.requiresSubscription && !hasAccess(course.slug) : false;
  const { isCompleted, markCompleted } = useCourseProgress(
    course?.id ?? "",
    Boolean(user && !courseLocked)
  );

  useEffect(() => {
    if (!slug) return;
    setPageLoading(true);
    setPageError("");
    const canLoadProtected = Boolean(user && course && (!course.requiresSubscription || hasAccess(course.slug)));
    loadCourse(slug, canLoadProtected)
      .catch((requestError) => setPageError(friendlyApiError(requestError, "الكورس غير موجود.")))
      .finally(() => setPageLoading(false));
  }, [slug, user?.id, courseLocked]);

  useEffect(() => {
    if (!course?.units.length) return;
    setOpenUnitId((current) => current || course.units[0].id);
    setActiveLessonId((current) => current || course.units.flatMap((unit) => unit.lessons)[0]?.id || "");
  }, [course?.id, course?.units]);

  useEffect(() => {
    let objectUrl = "";
    setProtectedVideoUrl("");
    const lesson = flatLessons.find((item) => item.id === activeLessonId) ?? flatLessons[0];
    if (lesson?.videoType !== "upload" || courseLocked) return;
    const token = getStudentToken();
    if (!token) return;
    apiDownload(`/lessons/${lesson.id}/video`, token)
      .then((blob) => {
        objectUrl = URL.createObjectURL(blob);
        setProtectedVideoUrl(objectUrl);
      })
      .catch(() => setProtectedVideoUrl(""));
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [activeLessonId, flatLessons, courseLocked]);

  useEffect(() => {
    if (courseLocked && !user) openLogin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course?.id, courseLocked, user]);

  if (pageLoading && !course) return <div className="min-h-screen grid place-items-center">جاري تحميل الكورس...</div>;
  if (!course) return <div className="min-h-screen grid place-items-center text-red-500">{pageError || "الكورس غير موجود."}</div>;

  const locked = courseLocked;
  const activeLesson: Lesson | undefined =
    flatLessons.find((l) => l.id === activeLessonId) ?? flatLessons[0];
  const activeIndex = flatLessons.findIndex((l) => l.id === activeLesson?.id);
  const nextLesson = activeIndex >= 0 ? flatLessons[activeIndex + 1] : undefined;

  function selectLesson(lessonId: string) {
    setActiveLessonId(lessonId);
  }

  async function goNext() {
    if (!activeLesson) return;
    await markCompleted(activeLesson.id);
    if (nextLesson) setActiveLessonId(nextLesson.id);
  }

  const embedUrl = activeLesson?.videoUrl ? getEmbedUrl(activeLesson.videoUrl) : null;
  const directVideoUrl = activeLesson?.videoType === "upload" ? protectedVideoUrl : activeLesson?.videoUrl;

  async function downloadResource(path: string, label: string) {
    const token = getStudentToken();
    if (!token) return openLogin();
    try {
      const blob = await apiDownload(path, token);
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = label;
      anchor.click();
      URL.revokeObjectURL(url);
    } catch (requestError) {
      setPageError(friendlyApiError(requestError, "تعذر تحميل الملف."));
    }
  }

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

        {pageError && <p className="mb-4 text-sm text-red-500">{pageError}</p>}

        {locked ? (
          <PaywallCard courseTitle={course.title} isLoggedIn={!!user} onLogin={openLogin} />
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
                ) : directVideoUrl ? (
                  <video src={directVideoUrl} controls className="w-full h-full" />
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
                        <button
                          type="button"
                          key={file.url}
                          onClick={() => void downloadResource(file.url, file.label)}
                          className="flex items-center gap-2 text-[var(--color-primary)] hover:underline text-sm py-1"
                        >
                          <FileDown size={16} />
                          {file.label}
                        </button>
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

function PaywallCard({
  courseTitle,
  isLoggedIn,
  onLogin,
}: {
  courseTitle: string;
  isLoggedIn: boolean;
  onLogin: () => void;
}) {
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
          : "الكورس ده متاح للمشتركين بس. سجّل دخولك أو اطلب اشتراك جديد."}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {!isLoggedIn && (
          <button
            type="button"
            onClick={onLogin}
            className="inline-flex items-center justify-center h-12 px-8 rounded-full border-2 border-[var(--color-fg)] text-[var(--color-fg)] font-bold hover:bg-[var(--color-fg)] hover:text-[var(--color-bg)] transition-colors"
          >
            تسجيل الدخول
          </button>
        )}
        <Link
          to="/academy/subscribe"
          className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-[var(--color-primary)] text-white font-bold hover:opacity-90 transition-opacity"
        >
          {isLoggedIn ? "طلب اشتراك تاني" : "سجّل طلب اشتراك"}
        </Link>
      </div>
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
