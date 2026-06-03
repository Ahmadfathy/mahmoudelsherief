/**
 * Single source of truth for all links and contact info.
 * Update these placeholders with real values when ready.
 */

export const config = {
  // Contact links
  phone: "+201012205238",
  whatsappNumber: "201012205238",
  email: "info@example.com",

  // CTA destinations
  paymentUrl: "#", // TODO: Replace with real payment page URL
  whatsappDetails:
    "https://wa.me/201012205238?text=" +
    encodeURIComponent("السلام عليكم، عايز أعرف تفاصيل أكتر عن كورس التصوير بالموبايل"),
  whatsappSubscribe:
    "https://wa.me/201012205238?text=" +
    encodeURIComponent("السلام عليكم، عايز أشترك في كورس التصوير بالموبايل"),

  // Social
  social: {
    facebook: "https://www.facebook.com/mahmmoud.sherief.5",
    instagram: "https://www.instagram.com/mahmoudelsherief1/",
    // instagramFilm: "https://www.instagram.com/mahmmoudelsherieffilms/",
    tiktok: "https://www.tiktok.com/@mahmmoudsherief",
  },

  // Direct contact buttons
  tel: "tel:+201012205238",
  whatsappContact: "https://wa.me/201012205238",
  mailto: "mailto:info@example.com",

  // Hero video
  heroVideo: "/videos/hero.mp4",
  heroPoster: "/videos/hero-poster.jpg",

  // Brand
  brandName: "Mahmoud Sherief",
  brandTagline: "كورس التصوير بالموبايل",
} as const;
