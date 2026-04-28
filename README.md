# حووووودة — كورس التصوير بالموبايل

Landing page باللغة العربية لكورس تصوير بالموبايل أوفلاين، بتصميم Editorial Magazine مودرن.

## الـ Stack

- **Next.js 15** (App Router) + **TypeScript**
- **Tailwind CSS v4** (CSS-first config)
- **next-themes** للـ Dark/Light mode
- **framer-motion** للـ animations
- **lucide-react** للأيقونات
- **next/font** لـ Zain & Lemonada من Google Fonts

## التشغيل

```bash
npm install
npm run dev
```

افتح [http://localhost:3000](http://localhost:3000).

للـ production:

```bash
npm run build
npm run start
```

---

## أهم ملفين للتعديل

### 1. `lib/content.ts` — كل النصوص العربية
كل الكلام في الصفحة موجود هنا في مكان واحد. عدّل النصوص هنا فقط.

### 2. `lib/config.ts` — كل الـ links وأرقام التواصل
- `phone` — رقم التليفون
- `whatsappNumber` — رقم الواتساب (بدون + أو 00)
- `email` — الإيميل
- `paymentUrl` — لينك صفحة الدفع (محط `#` دلوقتي)
- `social.facebook/instagram/tiktok` — لينكات السوشيال

---

## الـ Assets اللي محتاج تستبدلها

### 1. فيديو الـ Hero
استبدل الملفين دول:
- `public/videos/hero.mp4` — الفيديو الترويجي (يفضّل أقل من 10MB، MP4 H.264)
- `public/videos/hero-poster.svg` — صورة poster تظهر قبل ما يلعب

> ملاحظة مهمة: المتصفحات بتمنع autoplay مع الصوت، فالفيديو بيبدأ **muted** مع الـ controls ظاهرة + زرار play كبير. لما المستخدم يدوس، الصوت يشتغل.

### 2. صور الـ Testimonials
دلوقتي في 6 placeholders بـ gradients مختلفة وجمل عينة. لما تجيب الـ screenshots الحقيقية من واتساب، تقدر تحط الصور في `public/testimonials/` وتعدل الـ component في `components/sections/Testimonials.tsx` (الـ `placeholderStyles` array).

### 3. روابط Instagram للفيديوهات
في `lib/content.ts` غيّر `testimonialsContent.videos`:

```ts
videos: [
  { permalink: "https://www.instagram.com/p/REAL_POST_ID/" },
  // ...
],
```

---

## الـ Aesthetic Direction

التصميم متّبع concept موحّد: **"Editorial Photography Magazine"**

عناصر التصميم:
- **Section numbers كبيرة outlined** في الكورنر (01, 02...) زي مجلة مطبوعة
- **Marker yellow** على كلمة محورية في كل heading (شبيه قلم highlighter حقيقي)
- **Camera viewfinder brackets** حول فيديو الـ Hero
- **Crop marks** decorative في كورنرات الكروت لما تـ hover
- **Display typography**: Lemonada bold للعناوين، Zain للنصوص
- **Aperture SVGs** decorative كـ background ornaments
- **Film grain texture** خفيف على الـ background بالكامل
- **Bento grid mosaic** للـ testimonials بأحجام متفاوتة بدل grid uniform
- **Ticket-stub cards** للـ contact section
- **Asymmetric hero** بـ 30/70 split

## Animations

- Hero text staggered entrance (H1 → brief → price → CTAs)
- Magnetic primary CTA button
- Pulsing play affordance على فيديو الـ Hero
- Stat count-up بـ easeOutExpo
- Sliding active-pill في الـ nav (framer layoutId)
- 3D tilt على كروت الـ testimonials
- Scroll-triggered fade-up + scale على كل sections
- Header hide-on-scroll-down / show-on-scroll-up
- Floating WhatsApp مع pulse ring

كل الـ animations بتحترم `prefers-reduced-motion`.

## Accessibility

- RTL كامل (`dir="rtl"`) مع logical properties
- Focus rings واضحة
- Aria labels على كل الـ interactive elements
- Section landmarks مع `aria-labelledby`
- WCAG AA contrast في الـ themes الاتنين

## File Structure

```
app/
  layout.tsx          # Root layout, fonts, metadata
  page.tsx            # Main page
  globals.css         # Theme tokens, custom utilities
components/
  layout/             # Header, Footer, FloatingWhatsApp, ThemeToggle
  sections/           # Hero, About, CourseContent, WhoNeedsThis, Testimonials, Contact
  ui/                 # Button, Accordion, Reveal, StatCounter, TiltCard, etc.
  providers/          # ThemeProvider
lib/
  content.ts          # All Arabic copy
  config.ts           # All links and contact info
public/
  videos/             # Hero video + poster
  testimonials/       # Testimonial images (when added)
```

## Theme Customization

الألوان في `app/globals.css` تحت `@theme`:

```css
--color-primary: #5B2D8B;
--color-secondary: #FFD84D;
```

والـ Dark mode في `.dark` selector.

---

## Notes

- الفيديو في الـ Hero بيـ autoplay muted + loop. الـ controls ظاهرة عشان المستخدم يفعّل الصوت.
- الـ Instagram embed محتاج script من instagram.com — بيـ load lazily بعد الـ initial render.
- الـ `paymentUrl` في `lib/config.ts` لسه `#` — استبدله بلينك الدفع الحقيقي.
