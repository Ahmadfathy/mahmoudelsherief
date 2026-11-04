import { useEffect, useRef, useState } from "react";
import { CheckCircle2, FileAudio, FileImage, FileText, ImagePlus, LoaderCircle, Upload, X } from "lucide-react";
import type { Lesson, LessonResourceLink, LessonResourceFile } from "@/lib/academy-data";
import { friendlyApiError } from "@/lib/api";

function parseResourceLines(text: string): { label: string; url: string }[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, url] = line.split("|").map((p) => p.trim());
      return { label: label || url || "", url: url || label || "" };
    });
}

function formatResourceLines(items?: { label: string; url: string }[]): string {
  return (items ?? []).map((i) => `${i.label}|${i.url}`).join("\n");
}

export function LessonEditorForm({
  initial,
  onCancel,
  onSubmit,
}: {
  initial?: Lesson;
  onCancel: () => void;
  onSubmit: (lesson: {
    title: string;
    videoUrl?: string;
    description?: string;
    durationLabel?: string;
    links?: LessonResourceLink[];
    files?: LessonResourceFile[];
    videoFile?: File;
    thumbnailFile?: File;
    resourceFiles?: File[];
  }) => Promise<void> | void;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [videoUrl, setVideoUrl] = useState(initial?.videoUrl ?? "");
  const [durationLabel, setDurationLabel] = useState(initial?.durationLabel ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [linksText, setLinksText] = useState(formatResourceLines(initial?.links));
  const [existingFiles, setExistingFiles] = useState<LessonResourceFile[]>(initial?.files ?? []);
  const [resourceFiles, setResourceFiles] = useState<File[]>([]);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | undefined>();
  const [thumbnailFile, setThumbnailFile] = useState<File | undefined>();
  const [thumbnailPreview, setThumbnailPreview] = useState(initial?.thumbnailImageUrl ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resourceInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const hasStoredVideo = Boolean(initial?.videoPath);
  const storedVideoName = initial?.videoOriginalName || initial?.videoPath?.split("/").pop();
  const uploadingVideo = submitting && Boolean(videoFile);

  useEffect(() => {
    if (!uploadingVideo) return;

    const previousOverflow = document.body.style.overflow;
    const preventLeaving = (event: BeforeUnloadEvent) => event.preventDefault();
    document.body.style.overflow = "hidden";
    window.addEventListener("beforeunload", preventLeaving);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("beforeunload", preventLeaving);
    };
  }, [uploadingVideo]);

  useEffect(() => {
    return () => {
      if (thumbnailPreview.startsWith("blob:")) URL.revokeObjectURL(thumbnailPreview);
    };
  }, [thumbnailPreview]);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const extension = file.name.split(".").pop()?.toLowerCase();
    const allowedTypes = ["video/mp4", "video/webm", "video/quicktime"];
    const allowedExtensions = ["mp4", "webm", "mov"];

    setError("");
    if ((!allowedTypes.includes(file.type) && !allowedExtensions.includes(extension ?? ""))) {
      setVideoFile(undefined);
      setUploadedFileName(null);
      setError("صيغة الفيديو غير مدعومة. الصيغ المسموحة: MP4 أو WebM أو MOV.");
      e.target.value = "";
      return;
    }
    if (file.size > 500 * 1024 * 1024) {
      setVideoFile(undefined);
      setUploadedFileName(null);
      setError("حجم الفيديو أكبر من المسموح. الحد الأقصى 500 ميجابايت.");
      e.target.value = "";
      return;
    }
    setVideoFile(file);
    setVideoUrl("");
    setUploadedFileName(file.name);
  }

  function handleThumbnailSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    setError("");

    if (!allowedTypes.includes(file.type)) {
      setError("صيغة الصورة غير مدعومة. الصيغ المسموحة: JPG أو PNG أو WebP.");
      e.target.value = "";
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("حجم صورة الفيديو أكبر من المسموح. الحد الأقصى 5 ميجابايت.");
      e.target.value = "";
      return;
    }

    setThumbnailFile(file);
    setThumbnailPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);
    setError("");
    try {
      await onSubmit({
        title: title.trim(),
        videoUrl: videoUrl.trim() || undefined,
        durationLabel: durationLabel.trim() || undefined,
        description: description.trim() || undefined,
        links: parseResourceLines(linksText),
        files: existingFiles,
        videoFile,
        thumbnailFile,
        resourceFiles,
      });
    } catch (submitError) {
      setError(friendlyApiError(submitError, "تعذر حفظ الدرس. حاول مرة أخرى."));
    } finally {
      setSubmitting(false);
    }
  }

  function handleResourceFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? []);
    setResourceFiles((current) => [...current, ...picked].slice(0, 10));
    e.target.value = "";
  }

  function resourceIcon(file: File) {
    if (file.type.startsWith("image/")) return <FileImage size={16} />;
    if (file.type.startsWith("audio/")) return <FileAudio size={16} />;
    return <FileText size={16} />;
  }

  return (
    <>
    {uploadingVideo && (
      <div className="fixed inset-0 z-[250] grid place-items-center bg-black/65 px-5 backdrop-blur-sm" role="alertdialog" aria-modal="true" aria-labelledby="video-upload-title" dir="rtl">
        <div className="w-full max-w-md rounded-3xl border border-white/20 bg-[var(--color-card)] p-7 text-center shadow-2xl">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
            <LoaderCircle size={32} className="animate-spin" />
          </div>
          <h2 id="video-upload-title" className="mt-4 text-2xl font-black">جاري رفع الفيديو</h2>
          <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">يتم الآن رفع الفيديو وفحص صيغته وحجمه. من فضلك لا تغلق الصفحة حتى تظهر رسالة التأكيد.</p>
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-[var(--color-subtle)]">
            <div className="h-full w-1/2 animate-pulse rounded-full bg-[var(--color-primary)]" />
          </div>
          <p className="mt-3 truncate text-xs font-bold text-[var(--color-primary)]" dir="ltr">{videoFile?.name}</p>
        </div>
      </div>
    )}
    <form
      onSubmit={handleSubmit}
      className="space-y-2 p-3 rounded-lg bg-[var(--color-subtle)] border border-[var(--color-border)]"
    >
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="عنوان الدرس"
        required
        className="w-full h-9 px-3 text-sm rounded-md border border-[var(--color-border)] bg-[var(--color-card)]"
      />
      <div className="flex gap-2">
        <input
          type="text"
          value={videoUrl}
          onChange={(e) => {
            setVideoUrl(e.target.value);
            setUploadedFileName(null);
            setVideoFile(undefined);
          }}
          placeholder="رابط الفيديو (يوتيوب/فيميو/mp4)"
          className="flex-1 h-9 px-3 text-sm rounded-md border border-[var(--color-border)] bg-[var(--color-card)]"
        />
        <input
          type="text"
          value={durationLabel}
          onChange={(e) => setDurationLabel(e.target.value)}
          placeholder="المدة (12:30)"
          className="w-28 h-9 px-3 text-sm rounded-md border border-[var(--color-border)] bg-[var(--color-card)]"
        />
      </div>
      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".mp4,.webm,.mov,video/mp4,video/webm,video/quicktime"
          onChange={handleFileSelect}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full bg-[var(--color-card)] border border-[var(--color-border)] text-xs font-bold hover:bg-[var(--color-border)] transition-colors"
        >
          <Upload size={13} />
          {uploadedFileName
            ? `الفيديو الجديد: ${uploadedFileName}`
            : hasStoredVideo
              ? "تغيير الفيديو المرفوع"
              : "أو ارفع ملف فيديو من جهازك"}
        </button>
        {hasStoredVideo && !uploadedFileName && (
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
            <p className="inline-flex items-center gap-1.5 font-bold text-green-600">
              <CheckCircle2 size={15} />
              الفيديو محفوظ ومرفوع على السيرفر
            </p>
            {storedVideoName && <p className="min-w-0 truncate text-[var(--color-muted)]" dir="ltr">{storedVideoName}</p>}
          </div>
        )}
        {uploadedFileName && <p className="mt-2 truncate text-xs font-bold text-[var(--color-primary)]" dir="ltr">{uploadedFileName}</p>}
        <p className="text-xs text-[var(--color-muted)] mt-1">
          الصيغ المسموحة MP4 أو WebM أو MOV — بحد أقصى 500 ميجابايت.
        </p>
      </div>
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-3">
        <div className="mb-2 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold">صورة الفيديو المصغرة</p>
            <p className="mt-0.5 text-xs text-[var(--color-muted)]">تظهر كغلاف للدرس قبل تشغيل الفيديو.</p>
          </div>
          <input ref={thumbnailInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleThumbnailSelect} className="hidden" />
          <button type="button" onClick={() => thumbnailInputRef.current?.click()} className="inline-flex h-9 shrink-0 items-center gap-2 rounded-full bg-[var(--color-primary)] px-4 text-sm font-bold text-white hover:opacity-90">
            <ImagePlus size={16} />
            {thumbnailPreview ? "تغيير الصورة" : "رفع صورة"}
          </button>
        </div>
        {thumbnailPreview ? (
          <div className="relative aspect-video max-w-sm overflow-hidden rounded-lg border border-[var(--color-border)] bg-black">
            <img src={thumbnailPreview} alt="معاينة صورة الفيديو المصغرة" className="h-full w-full object-cover" />
          </div>
        ) : (
          <button type="button" onClick={() => thumbnailInputRef.current?.click()} className="grid aspect-video w-full max-w-sm place-items-center rounded-lg border-2 border-dashed border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]">
            <span className="flex flex-col items-center gap-2 text-sm"><ImagePlus size={28} />اختر صورة للدرس</span>
          </button>
        )}
        <p className="mt-2 text-xs text-[var(--color-muted)]">JPG أو PNG أو WebP — الحد الأقصى 5 ميجابايت، والمقاس المقترح 1280×720.</p>
      </div>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="وصف الدرس (اختياري)"
        rows={2}
        className="w-full px-3 py-2 text-sm rounded-md border border-[var(--color-border)] bg-[var(--color-card)] resize-none"
      />
      <textarea
        value={linksText}
        onChange={(e) => setLinksText(e.target.value)}
        placeholder={"روابط — سطر لكل رابط بصيغة: العنوان|الرابط"}
        rows={2}
        className="w-full px-3 py-2 text-sm rounded-md border border-[var(--color-border)] bg-[var(--color-card)] resize-none font-mono"
      />
      <div className="rounded-lg border-2 border-dashed border-[var(--color-border)] bg-[var(--color-card)] p-3">
        <input
          ref={resourceInputRef}
          type="file"
          multiple
          accept="image/*,application/pdf,audio/*"
          onChange={handleResourceFiles}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => resourceInputRef.current?.click()}
          className="inline-flex h-9 items-center gap-2 rounded-full bg-[var(--color-primary)] px-4 text-sm font-bold text-white transition-opacity hover:opacity-90"
        >
          <Upload size={15} />
          رفع ملفات الدرس
        </button>
        <p className="mt-2 text-xs text-[var(--color-muted)]">صور أو PDF أو ملفات صوت — بحد أقصى 10 ملفات، و20 ميجابايت للملف.</p>

        {(existingFiles.length > 0 || resourceFiles.length > 0) && (
          <div className="mt-3 space-y-2">
            {existingFiles.map((file, index) => (
              <div key={file.id ?? `${file.label}-${index}`} className="flex items-center justify-between gap-3 rounded-lg bg-[var(--color-subtle)] px-3 py-2 text-sm">
                <span className="min-w-0 truncate"><FileText size={16} className="me-2 inline" />{file.label}</span>
                <button type="button" onClick={() => setExistingFiles((items) => items.filter((_, itemIndex) => itemIndex !== index))} aria-label={`حذف ${file.label}`} className="shrink-0 text-red-500"><X size={16} /></button>
              </div>
            ))}
            {resourceFiles.map((file, index) => (
              <div key={`${file.name}-${file.lastModified}-${index}`} className="flex items-center justify-between gap-3 rounded-lg bg-[var(--color-primary)]/10 px-3 py-2 text-sm">
                <span className="min-w-0 truncate">{resourceIcon(file)}<span className="ms-2">{file.name}</span></span>
                <button type="button" onClick={() => setResourceFiles((items) => items.filter((_, itemIndex) => itemIndex !== index))} aria-label={`حذف ${file.name}`} className="shrink-0 text-red-500"><X size={16} /></button>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex gap-2">
        {error && <p className="w-full text-sm font-bold text-red-500">{error}</p>}
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={submitting}
          className="h-9 px-4 rounded-full bg-[var(--color-primary)] text-white text-sm font-bold hover:opacity-90 transition-opacity disabled:cursor-wait disabled:opacity-50"
        >
          {submitting ? "جاري حفظ الدرس..." : "حفظ الدرس"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="h-9 px-4 rounded-full bg-[var(--color-card)] border border-[var(--color-border)] text-sm font-bold hover:bg-[var(--color-border)] transition-colors"
        >
          إلغاء
        </button>
      </div>
    </form>
    </>
  );
}
