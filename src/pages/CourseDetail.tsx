import { useEffect, useMemo, useRef, useState } from "react";
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
  Maximize,
  Pause,
  Play,
  Volume2,
} from "lucide-react";
import { AcademyHeader } from "@/components/academy/AcademyHeader";
import type { Lesson } from "@/lib/academy-data";
import { useCourses } from "@/lib/courses-store";
import { useAuth } from "@/lib/auth-context";
import { useAuthModal } from "@/lib/auth-modal-context";
import { useCourseProgress } from "@/lib/progress";
import { apiDownload, friendlyApiError, getStudentToken } from "@/lib/api";

function getYouTubeId(url: string): string | null {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "").replace(/^m\./, "");
    let youtubeId = "";

    if (host === "youtu.be") {
      youtubeId = parsed.pathname.split("/").filter(Boolean)[0] ?? "";
    } else if (host === "youtube.com" || host === "youtube-nocookie.com") {
      const parts = parsed.pathname.split("/").filter(Boolean);
      if (parsed.pathname === "/watch") youtubeId = parsed.searchParams.get("v") ?? "";
      else if (["embed", "shorts", "live"].includes(parts[0])) youtubeId = parts[1] ?? "";
    }

    return youtubeId || null;
  } catch {
    return null;
  }
}

function getEmbedUrl(url: string): string | null {
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  return vimeo ? `https://player.vimeo.com/video/${vimeo[1]}` : null;
}

type YouTubePlayerInstance = {
  playVideo: () => void;
  pauseVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  getVolume: () => number;
  setVolume: (volume: number) => void;
  destroy: () => void;
};

type YouTubePlayerEvent = { target: YouTubePlayerInstance; data: number };
type YouTubeApi = {
  Player: new (element: HTMLElement, options: {
    videoId: string;
    playerVars: Record<string, string | number>;
    events: {
      onReady: (event: YouTubePlayerEvent) => void;
      onStateChange: (event: YouTubePlayerEvent) => void;
    };
  }) => YouTubePlayerInstance;
};

declare global {
  interface Window {
    YT?: YouTubeApi;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let youtubeApiPromise: Promise<YouTubeApi> | null = null;

function loadYouTubeApi() {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (youtubeApiPromise) return youtubeApiPromise;
  youtubeApiPromise = new Promise((resolve) => {
    const previousCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previousCallback?.();
      if (window.YT) resolve(window.YT);
    };
    if (!document.querySelector("script[data-youtube-player-api]")) {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.dataset.youtubePlayerApi = "true";
      document.head.appendChild(script);
    }
  });
  return youtubeApiPromise;
}

function formatVideoTime(seconds: number) {
  if (!Number.isFinite(seconds)) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remainder = Math.floor(seconds % 60);
  return `${minutes}:${String(remainder).padStart(2, "0")}`;
}

function CourseVideoPlayer({ src, title }: { src: string; title?: string }) {
  const playerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  function togglePlayback() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) void video.play();
    else video.pause();
  }

  function seek(value: number) {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = value;
    setCurrentTime(value);
  }

  function changeVolume(value: number) {
    const video = videoRef.current;
    if (!video) return;
    video.volume = value;
    setVolume(value);
  }

  return (
    <div ref={playerRef} className="group relative h-full w-full overflow-hidden bg-black">
      <video
        ref={videoRef}
        src={src}
        title={title}
        preload="metadata"
        playsInline
        onClick={togglePlayback}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
        className="h-full w-full cursor-pointer object-contain"
      />
      {!playing && (
        <button type="button" onClick={togglePlayback} aria-label="تشغيل الفيديو" className="absolute inset-0 m-auto grid h-16 w-16 place-items-center rounded-full bg-white/90 text-[var(--color-primary)] shadow-xl">
          <Play size={28} fill="currentColor" />
        </button>
      )}
      <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 bg-gradient-to-t from-black/90 via-black/65 to-transparent px-4 pb-3 pt-8 text-white" dir="ltr">
        <button type="button" onClick={togglePlayback} aria-label={playing ? "إيقاف مؤقت" : "تشغيل"} className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/15 hover:bg-white/25">
          {playing ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
        </button>
        <span className="shrink-0 text-xs tabular-nums">{formatVideoTime(currentTime)} / {formatVideoTime(duration)}</span>
        <input type="range" min="0" max={duration || 0} step="0.1" value={Math.min(currentTime, duration || 0)} onChange={(event) => seek(Number(event.target.value))} aria-label="وقت الفيديو" className="min-w-0 flex-1 accent-[var(--color-primary)]" />
        <Volume2 size={17} className="hidden shrink-0 sm:block" />
        <input type="range" min="0" max="1" step="0.05" value={volume} onChange={(event) => changeVolume(Number(event.target.value))} aria-label="مستوى الصوت" className="hidden w-20 accent-[var(--color-primary)] sm:block" />
        <button type="button" onClick={() => void playerRef.current?.requestFullscreen()} aria-label="ملء الشاشة" className="grid h-9 w-9 shrink-0 place-items-center rounded-full hover:bg-white/15">
          <Maximize size={18} />
        </button>
      </div>
    </div>
  );
}

function YouTubeVideoPlayer({ videoId }: { videoId: string; title?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<YouTubePlayerInstance | null>(null);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(100);

  useEffect(() => {
    let disposed = false;
    if (!playerRef.current) return;
    void loadYouTubeApi().then((YT) => {
      if (disposed || !playerRef.current) return;
      instanceRef.current = new YT.Player(playerRef.current, {
        videoId,
        playerVars: {
          controls: 1,
          disablekb: 0,
          fs: 1,
          playsinline: 1,
          rel: 0,
          origin: window.location.origin,
        },
        events: {
          onReady: (event) => {
            setReady(true);
            setDuration(event.target.getDuration());
            setVolume(event.target.getVolume());
          },
          onStateChange: (event) => setPlaying(event.data === 1),
        },
      });
    });
    return () => {
      disposed = true;
      instanceRef.current?.destroy();
      instanceRef.current = null;
    };
  }, [videoId]);

  useEffect(() => {
    if (!ready) return;
    const timer = window.setInterval(() => {
      const player = instanceRef.current;
      if (!player) return;
      setCurrentTime(player.getCurrentTime() || 0);
      setDuration(player.getDuration() || 0);
    }, 500);
    return () => window.clearInterval(timer);
  }, [ready]);

  function togglePlayback() {
    const player = instanceRef.current;
    if (!player) return;
    if (playing) player.pauseVideo();
    else player.playVideo();
  }

  function seek(seconds: number) {
    instanceRef.current?.seekTo(seconds, true);
    setCurrentTime(seconds);
  }

  function changeVolume(value: number) {
    instanceRef.current?.setVolume(value);
    setVolume(value);
  }

  return (
    <div ref={hostRef} className="relative h-full w-full overflow-hidden bg-black">
      <div ref={playerRef} className="h-full w-full" />
      <div className="absolute inset-x-0 bottom-0 z-10 flex items-center gap-3 bg-gradient-to-t from-black/95 via-black/75 to-transparent px-4 pb-3 pt-8 text-white" dir="ltr">
        <button type="button" disabled={!ready} onClick={togglePlayback} aria-label={playing ? "إيقاف مؤقت" : "تشغيل"} className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/15 hover:bg-white/25 disabled:opacity-50">
          {playing ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
        </button>
        <span className="shrink-0 text-xs tabular-nums">{formatVideoTime(currentTime)} / {formatVideoTime(duration)}</span>
        <input type="range" min="0" max={duration || 0} step="1" value={Math.min(currentTime, duration || 0)} disabled={!ready} onChange={(event) => seek(Number(event.target.value))} aria-label="وقت الفيديو" className="min-w-0 flex-1 accent-[var(--color-primary)]" />
        <Volume2 size={17} className="hidden shrink-0 sm:block" />
        <input type="range" min="0" max="100" step="1" value={volume} disabled={!ready} onChange={(event) => changeVolume(Number(event.target.value))} aria-label="مستوى الصوت" className="hidden w-20 accent-[var(--color-primary)] sm:block" />
        <button type="button" onClick={() => void hostRef.current?.requestFullscreen()} aria-label="ملء الشاشة" className="grid h-9 w-9 shrink-0 place-items-center rounded-full hover:bg-white/15">
          <Maximize size={18} />
        </button>
      </div>
    </div>
  );
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
  const [thumbnailDismissed, setThumbnailDismissed] = useState(false);

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
    setThumbnailDismissed(false);
  }, [activeLessonId]);

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

  const youtubeId = activeLesson?.videoUrl ? getYouTubeId(activeLesson.videoUrl) : null;
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
                {activeLesson?.thumbnailImageUrl && !thumbnailDismissed ? (
                  <button type="button" onClick={() => setThumbnailDismissed(true)} className="group relative h-full w-full" aria-label={`تشغيل ${activeLesson.title}`}>
                    <img src={activeLesson.thumbnailImageUrl} alt={`صورة درس ${activeLesson.title}`} className="h-full w-full object-cover" />
                    <span className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/30" />
                    <span className="absolute inset-0 m-auto grid h-16 w-16 place-items-center rounded-full bg-white/90 text-[var(--color-primary)] shadow-xl transition-transform group-hover:scale-105">
                      <Play size={28} fill="currentColor" />
                    </span>
                  </button>
                ) : youtubeId ? (
                  <YouTubeVideoPlayer videoId={youtubeId} title={activeLesson?.title} />
                ) : embedUrl ? (
                  <iframe
                    src={embedUrl}
                    title={activeLesson?.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                    className="block w-full h-full"
                  />
                ) : directVideoUrl ? (
                  <CourseVideoPlayer src={directVideoUrl} title={activeLesson?.title} />
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
                                      {lesson.thumbnailImageUrl ? (
                                        <span className="relative h-10 w-16 shrink-0 overflow-hidden rounded-md border border-[var(--color-border)] bg-[var(--color-subtle)]">
                                          <img src={lesson.thumbnailImageUrl} alt="" className="h-full w-full object-cover" />
                                          {done && <span className="absolute inset-0 grid place-items-center bg-black/35"><CheckCircle2 size={18} className="text-white" /></span>}
                                        </span>
                                      ) : done ? (
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
