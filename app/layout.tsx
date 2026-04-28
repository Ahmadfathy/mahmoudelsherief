import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "حووووودة | كورس التصوير بالموبايل الاحترافي",
  description:
    "كورس أوفلاين متكامل يعلّمك التصوير الاحترافي بموبايلك خطوة بخطوة. ١٥ ساعة، ٦ أقسام، نتائج حقيقية من أول أسبوع.",
  keywords: [
    "تصوير بالموبايل",
    "كورس تصوير",
    "تصوير احترافي",
    "Mobile Photography",
    "كورس أوفلاين",
  ],
  authors: [{ name: "حووووودة" }],
  openGraph: {
    title: "حووووودة | كورس التصوير بالموبايل",
    description: "اتقن فن التصوير بالموبايل في ١٥ ساعة فقط",
    locale: "ar_EG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "حووووودة | كورس التصوير بالموبايل",
    description: "اتقن فن التصوير بالموبايل في ١٥ ساعة فقط",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F7F7F7" },
    { media: "(prefers-color-scheme: dark)", color: "#121212" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Lemonada:wght@300..700&family=Zain:ital,wght@0,200;0,300;0,400;0,700;0,800;0,900;1,300;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased grain">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
