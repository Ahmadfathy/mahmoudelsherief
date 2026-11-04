import { useEffect, useState, type ReactNode } from "react";
import { Image as ImageIcon, MessageCircle, Mic2, Video } from "lucide-react";
import { testimonialsContent } from "@/lib/content";
import { apiRequest } from "@/lib/api";
import { Reveal } from "@/components/ui/Reveal";

type Testimonial = {
  id: number;
  type: "image" | "video" | "audio";
  title?: string | null;
  customer_name?: string | null;
  file_url: string;
};

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}

function SectionHeading({ icon, title }: { icon: ReactNode; title: string }) {
  return <Reveal><div className="mb-8 flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-full bg-[var(--color-primary)] text-white">{icon}</span><h3 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>{title}</h3></div></Reveal>;
}

export function Testimonials() {
  const [items, setItems] = useState<Testimonial[]>([]);

  useEffect(() => {
    apiRequest<{ testimonials: Testimonial[] }>("/testimonials")
      .then((response) => setItems(response.testimonials))
      .catch(() => setItems([]));
  }, []);

  const images = items.filter((item) => item.type === "image");
  const videos = items.filter((item) => item.type === "video");
  const audios = items.filter((item) => item.type === "audio");
  const useStaticVideos = videos.length === 0;

  useEffect(() => {
    if (!useStaticVideos) return;
    const existing = document.querySelector<HTMLScriptElement>('script[data-instagram-embed]');
    if (existing) {
      window.instgrm?.Embeds.process();
      return;
    }
    const script = document.createElement("script");
    script.src = "https://www.instagram.com/embed.js";
    script.async = true;
    script.dataset.instagramEmbed = "true";
    script.onload = () => window.instgrm?.Embeds.process();
    document.body.appendChild(script);
  }, [useStaticVideos]);

  return (
    <section id="testimonials" aria-labelledby="testimonials-heading" className="relative overflow-hidden bg-[var(--color-subtle)] py-24 md:py-32">
      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <div aria-hidden className="section-number pointer-events-none absolute -start-2 -top-12 select-none text-[10rem] leading-none md:-start-4 md:-top-20 md:text-[14rem]">05</div>
        <div className="relative mb-12 max-w-3xl md:mb-16">
          <Reveal><div className="mb-5 flex items-center gap-3 text-sm font-medium uppercase tracking-[0.2em] text-[var(--color-muted)]"><span className="h-px w-8 bg-[var(--color-fg)]" /><span>{testimonialsContent.eyebrow}</span></div></Reveal>
          <Reveal delay={0.05}><h2 id="testimonials-heading" className="text-display-md mb-6 text-[var(--color-fg)]">{testimonialsContent.title.before} <span className="marker-yellow">{testimonialsContent.title.highlight}</span> {testimonialsContent.title.after}</h2></Reveal>
          <Reveal delay={0.1}><p className="text-lg leading-relaxed text-[var(--color-muted)]">{testimonialsContent.brief}</p></Reveal>
        </div>

        <div className="mb-20">
          <SectionHeading icon={images.length ? <ImageIcon size={18} /> : <MessageCircle size={18} />} title={testimonialsContent.imagesHeading} />
          <div className="columns-1 gap-5 space-y-5 sm:columns-2 lg:columns-3">
            {images.length > 0 ? images.map((item, index) => <Reveal key={item.id} delay={index * 0.06}><figure className="relative break-inside-avoid overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] shadow-md"><img src={item.file_url} alt={item.title || item.customer_name || "رأي عميل"} className="h-auto w-full object-cover" loading="lazy" />{(item.title || item.customer_name) && <figcaption className="p-3"><p className="font-bold">{item.title}</p>{item.customer_name && <p className="text-sm text-[var(--color-muted)]">{item.customer_name}</p>}</figcaption>}</figure></Reveal>) : testimonialsContent.images.map((item, index) => <Reveal key={index} delay={index * 0.06}><div className="relative break-inside-avoid overflow-hidden rounded-2xl border border-[var(--color-border)] shadow-md"><img src={item.src} alt={item.alt || "رأي عميل"} className="h-auto w-full object-cover" loading="lazy" /></div></Reveal>)}
          </div>
        </div>

        <div className="mb-20">
          <SectionHeading icon={<Video size={18} />} title="فيديوهات آراء الطلاب" />
          {videos.length > 0 ? <div className="grid grid-cols-1 gap-6 md:grid-cols-3">{videos.map((item, index) => <Reveal key={item.id} delay={index * 0.08}><article className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-3"><video src={item.file_url} controls preload="metadata" playsInline className="aspect-video w-full rounded-xl bg-black object-contain" />{(item.title || item.customer_name) && <div className="px-1 pb-1 pt-3"><p className="font-bold">{item.title}</p>{item.customer_name && <p className="text-sm text-[var(--color-muted)]">{item.customer_name}</p>}</div>}</article></Reveal>)}</div> : <div className="grid grid-cols-1 gap-6 md:grid-cols-3">{testimonialsContent.videos.map((video, index) => <Reveal key={video.permalink} delay={index * 0.08}><div className="relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-3"><blockquote className="instagram-media" data-instgrm-permalink={video.permalink} data-instgrm-version="14" style={{ background: "transparent", border: 0, margin: 0, maxWidth: "540px", minWidth: "100%", padding: 0, width: "100%" }}><div className="grid aspect-[9/16] place-items-center rounded-xl bg-[var(--color-subtle)] p-4 text-center"><a href={video.permalink} target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--color-primary)] underline">عرض على إنستجرام</a></div></blockquote></div></Reveal>)}</div>}
        </div>

        {audios.length > 0 && <div><SectionHeading icon={<Mic2 size={18} />} title="تسجيلات صوتية من الطلاب" /><div className="grid gap-5 md:grid-cols-2">{audios.map((item, index) => <Reveal key={item.id} delay={index * 0.06}><article className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 shadow-sm"><div className="mb-4 flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)]"><Mic2 size={20} /></span><div><p className="font-bold">{item.title || "رأي صوتي"}</p>{item.customer_name && <p className="text-sm text-[var(--color-muted)]">{item.customer_name}</p>}</div></div><audio src={item.file_url} controls preload="metadata" className="w-full" /></article></Reveal>)}</div></div>}
      </div>
    </section>
  );
}
