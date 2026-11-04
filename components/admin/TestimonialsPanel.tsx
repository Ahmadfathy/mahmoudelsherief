import { useCallback, useEffect, useRef, useState } from "react";
import { CheckCircle2, FileAudio, FileImage, FileVideo, LoaderCircle, Plus, Trash2 } from "lucide-react";
import { apiRequest, friendlyApiError, getAdminToken } from "@/lib/api";

type TestimonialType = "image" | "video" | "audio";
type Testimonial = {
  id: number;
  type: TestimonialType;
  title?: string | null;
  customer_name?: string | null;
  file_path: string;
  file_url: string;
  is_published: boolean;
  sort_order: number;
};

const TYPE_LABEL: Record<TestimonialType, string> = { image: "صورة / سكرين", video: "فيديو", audio: "تسجيل صوتي" };
const ACCEPT: Record<TestimonialType, string> = {
  image: "image/jpeg,image/png,image/webp",
  video: ".mp4,.webm,.mov,video/mp4,video/webm,video/quicktime",
  audio: ".mp3,.wav,.m4a,.aac,.ogg,audio/*",
};

function MediaPreview({ item }: { item: Testimonial }) {
  if (item.type === "image") return <img src={item.file_url} alt={item.title || "رأي عميل"} className="h-36 w-full rounded-xl object-cover" />;
  if (item.type === "video") return <video src={item.file_url} controls preload="metadata" className="h-36 w-full rounded-xl bg-black object-contain" />;
  return <audio src={item.file_url} controls preload="metadata" className="w-full" />;
}

export function TestimonialsPanel() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [type, setType] = useState<TestimonialType>("image");
  const [title, setTitle] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [sortOrder, setSortOrder] = useState("0");
  const [published, setPublished] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiRequest<{ testimonials: Testimonial[] }>("/admin/testimonials", { token: getAdminToken() });
      setItems(response.testimonials);
    } catch (requestError) {
      setError(friendlyApiError(requestError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);
  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(""), 4000);
    return () => window.clearTimeout(timer);
  }, [notice]);

  function selectFile(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0] ?? null;
    setError("");
    if (!selected) return setFile(null);
    const limit = type === "video" ? 500 : type === "audio" ? 20 : 10;
    if (selected.size > limit * 1024 * 1024) {
      setFile(null);
      event.target.value = "";
      setError(`حجم الملف أكبر من المسموح. الحد الأقصى ${limit} ميجابايت.`);
      return;
    }
    setFile(selected);
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!file) return setError("اختر الملف الذي تريد رفعه.");
    setSaving(true);
    setError("");
    const form = new FormData();
    form.append("type", type);
    form.append("title", title);
    form.append("customer_name", customerName);
    form.append("sort_order", sortOrder || "0");
    form.append("is_published", published ? "1" : "0");
    form.append("file", file);
    try {
      await apiRequest("/admin/testimonials", { method: "POST", token: getAdminToken(), body: form });
      setTitle(""); setCustomerName(""); setSortOrder("0"); setPublished(true); setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setNotice("تم رفع رأي العميل بنجاح.");
      await load();
    } catch (requestError) {
      setError(friendlyApiError(requestError, "تعذر رفع الملف."));
    } finally {
      setSaving(false);
    }
  }

  async function update(item: Testimonial, patch: Partial<Testimonial>) {
    setError("");
    try {
      const response = await apiRequest<{ testimonial: Testimonial }>(`/admin/testimonials/${item.id}`, {
        method: "PATCH", token: getAdminToken(), body: JSON.stringify({ type: item.type, ...patch }),
      });
      setItems((current) => current.map((entry) => entry.id === item.id ? response.testimonial : entry));
    } catch (requestError) {
      setError(friendlyApiError(requestError));
      await load();
    }
  }

  async function remove(item: Testimonial) {
    if (!confirm("هل تريد حذف رأي العميل والملف نهائيًا؟")) return;
    try {
      await apiRequest(`/admin/testimonials/${item.id}`, { method: "DELETE", token: getAdminToken() });
      setItems((current) => current.filter((entry) => entry.id !== item.id));
    } catch (requestError) {
      setError(friendlyApiError(requestError));
    }
  }

  const groups: TestimonialType[] = ["image", "video", "audio"];

  return (
    <div className="space-y-7">
      {saving && type === "video" && <div className="fixed inset-0 z-[250] grid place-items-center bg-black/65 px-5 backdrop-blur-sm"><div className="w-full max-w-md rounded-3xl bg-[var(--color-card)] p-7 text-center shadow-2xl"><LoaderCircle className="mx-auto animate-spin text-[var(--color-primary)]" size={44} /><h2 className="mt-4 text-2xl font-black">جاري رفع فيديو رأي العميل</h2><p className="mt-2 text-sm text-[var(--color-muted)]">لا تغلق الصفحة حتى يكتمل الرفع وتظهر رسالة التأكيد.</p></div></div>}
      {notice && <div role="status" className="fixed start-1/2 top-5 z-[260] flex -translate-x-1/2 items-center gap-2 rounded-2xl border border-green-200 bg-green-50 px-5 py-3 font-bold text-green-800 shadow-xl"><CheckCircle2 size={20} />{notice}</div>}

      <form onSubmit={submit} className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-5">
        <h1 className="mb-5 text-xl font-black">رفع رأي جديد</h1>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="space-y-1.5 text-sm font-bold"><span className="block">نوع المحتوى</span><select value={type} onChange={(event) => { setType(event.target.value as TestimonialType); setFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }} className="h-11 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 font-normal"><option value="image">صورة / Screenshot</option><option value="video">فيديو</option><option value="audio">تسجيل صوتي</option></select></label>
          <label className="space-y-1.5 text-sm font-bold"><span className="block">اسم العميل أو الطالب</span><input value={customerName} onChange={(event) => setCustomerName(event.target.value)} placeholder="اختياري" className="h-11 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 font-normal" /></label>
          <label className="space-y-1.5 text-sm font-bold"><span className="block">عنوان أو وصف قصير</span><input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="اختياري" className="h-11 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 font-normal" /></label>
          <label className="space-y-1.5 text-sm font-bold"><span className="block">ترتيب العرض</span><input type="number" min="0" value={sortOrder} onChange={(event) => setSortOrder(event.target.value)} className="h-11 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 font-normal" /></label>
        </div>
        <div className="mt-4 rounded-xl border-2 border-dashed border-[var(--color-border)] p-4">
          <input ref={fileInputRef} type="file" accept={ACCEPT[type]} onChange={selectFile} className="hidden" />
          <button type="button" onClick={() => fileInputRef.current?.click()} className="inline-flex h-10 items-center gap-2 rounded-full bg-[var(--color-primary)] px-5 text-sm font-bold text-white"><Plus size={17} />اختيار {TYPE_LABEL[type]}</button>
          <span className="me-3 text-sm text-[var(--color-muted)]">{file?.name ?? "لم يتم اختيار ملف"}</span>
        </div>
        <label className="mt-4 flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={published} onChange={(event) => setPublished(event.target.checked)} className="h-4 w-4 accent-[var(--color-primary)]" />منشور في الموقع</label>
        {error && <p className="mt-3 text-sm font-bold text-red-500">{error}</p>}
        <button type="submit" disabled={saving} className="mt-4 h-11 rounded-full bg-[var(--color-primary)] px-6 font-bold text-white disabled:opacity-50">{saving ? "جاري الرفع..." : "رفع ونشر الرأي"}</button>
      </form>

      {loading ? <p>جاري تحميل آراء العملاء...</p> : groups.map((group) => {
        const groupItems = items.filter((item) => item.type === group);
        const Icon = group === "image" ? FileImage : group === "video" ? FileVideo : FileAudio;
        return <section key={group} className="space-y-3"><h2 className="flex items-center gap-2 text-lg font-black"><Icon size={20} className="text-[var(--color-primary)]" />{TYPE_LABEL[group]} <span className="text-sm font-normal text-[var(--color-muted)]">({groupItems.length})</span></h2>{groupItems.length === 0 ? <p className="text-sm text-[var(--color-muted)]">لا يوجد محتوى من هذا النوع.</p> : <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{groupItems.map((item) => <article key={item.id} className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-3"><MediaPreview item={item} /><div className="mt-3"><p className="font-bold">{item.title || "بدون عنوان"}</p><p className="text-xs text-[var(--color-muted)]">{item.customer_name || "اسم العميل غير مضاف"}</p></div><div className="mt-3 flex flex-wrap items-center gap-2"><button type="button" onClick={() => void update(item, { is_published: !item.is_published })} className={`h-8 rounded-full px-3 text-xs font-bold ${item.is_published ? "bg-green-500/10 text-green-600" : "bg-[var(--color-subtle)] text-[var(--color-muted)]"}`}>{item.is_published ? "منشور" : "مخفي"}</button><label className="flex items-center gap-1 text-xs">الترتيب<input type="number" min="0" value={item.sort_order} onChange={(event) => setItems((current) => current.map((entry) => entry.id === item.id ? { ...entry, sort_order: Number(event.target.value) } : entry))} onBlur={() => void update(item, { sort_order: item.sort_order })} className="h-8 w-16 rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-2" /></label><button type="button" onClick={() => void remove(item)} className="ms-auto grid h-8 w-8 place-items-center rounded-full bg-red-500/10 text-red-500" aria-label="حذف"><Trash2 size={15} /></button></div></article>)}</div>}</section>;
      })}
    </div>
  );
}
