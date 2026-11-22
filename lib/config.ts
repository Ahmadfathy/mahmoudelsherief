/**
 * Single source of truth for all links and contact info.
 * Update these placeholders with real values when ready.
 */

export const config = {
  // Contact links
  phone: "+201012205238",
  whatsappNumber: "201012205238",
  email: "mahmoudsherief6@gmail.com",

  // IMPORTANT: Vodafone Cash and InstaPay currently share the SAME recipient number.
  // The UI consolidates them into one card with both logos. If the numbers ever diverge,
  // restructure the PaymentMethodsBlock in src/pages/Payment.tsx to render two separate cards again.
  //
  // Payment account details per method.
  // `holderName` is the FULL legal name on the receiving account — it will be
  // automatically masked in the UI (first word shown, rest shown as first-letter + ***).
  // Users see enough to verify the recipient without exposing the full name.
  paymentAccounts: {
    vodafone: {
      number: "01113010090",
      holderName: "محمود شريف محمد ابراهيم علي", // TODO: replace with the actual account holder's full name
    },
    instapay: {
      number: "01113010090",
      holderName: "محمود شريف محمد ابراهيم علي", // TODO: replace with actual (can be same or different from vodafone)
    },
  },

  // CTA destinations
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
  mailto: "mailto:mahmoudsherief6@gmail.com",

  // Hero video
  heroVideo: "/videos/hero.mp4",
  heroPoster: "/videos/hero-poster.svg",

  // Brand
  brandName: "Mahmoud Sherief",
  brandTagline: "كورس التصوير بالموبايل",

} as const;
