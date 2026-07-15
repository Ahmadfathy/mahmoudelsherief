import { useEffect, useRef, useState } from "react";
import { Upload } from "lucide-react";
import type { Lesson, LessonResourceLink, LessonResourceFile } from "@/lib/academy-data";

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
  }) => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [videoUrl, setVideoUrl] = useState(initial?.videoUrl ?? "");
  const [durationLabel, setDurationLabel] = useState(initial?.durationLabel ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [linksText, setLinksText] = useState(formatResourceLines(initial?.links));
  const [filesText, setFilesText] = useState(formatResourceLines(initial?.files));
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const objectUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    const objectUrl = URL.createObjectURL(file);
    objectUrlRef.current = objectUrl;
    setVideoUrl(objectUrl);
    setUploadedFileName(file.name);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({
      title: title.trim(),
      videoUrl: videoUrl.trim() || undefined,
      durationLabel: durationLabel.trim() || undefined,
      description: description.trim() || undefined,
      links: parseResourceLines(linksText),
      files: parseResourceLines(filesText),
    });
  }

  return (
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
          accept="video/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full bg-[var(--color-card)] border border-[var(--color-border)] text-xs font-bold hover:bg-[var(--color-border)] transition-colors"
        >
          <Upload size={13} />
          {uploadedFileName ? `تغيير الملف (${uploadedFileName})` : "أو ارفع ملف فيديو من جهازك"}
        </button>
        <p className="text-xs text-[var(--color-muted)] mt-1">
          معاينة محلية على جهازك بس — الملف مش بيتحفظ ولا يظهر لغيرك لحد ما يتحط تخزين حقيقي.
        </p>
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
      <textarea
        value={filesText}
        onChange={(e) => setFilesText(e.target.value)}
        placeholder={"ملفات للتحميل — سطر لكل ملف بصيغة: العنوان|الرابط"}
        rows={2}
        className="w-full px-3 py-2 text-sm rounded-md border border-[var(--color-border)] bg-[var(--color-card)] resize-none font-mono"
      />
      <div className="flex gap-2">
        <button
          type="submit"
          className="h-9 px-4 rounded-full bg-[var(--color-primary)] text-white text-sm font-bold hover:opacity-90 transition-opacity"
        >
          حفظ الدرس
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="h-9 px-4 rounded-full bg-[var(--color-card)] border border-[var(--color-border)] text-sm font-bold hover:bg-[var(--color-border)] transition-colors"
        >
          إلغاء
        </button>
      </div>
    </form>
  );
}
