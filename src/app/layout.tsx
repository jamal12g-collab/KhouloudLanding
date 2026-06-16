import type { Metadata } from "next";
import { cookies } from "next/headers";
import type { ReactNode } from "react";
import "./globals.css";
import { BrandTheme } from "@/components/brand-theme";
import { PageTransition } from "@/components/page-transition";
import { PublicChrome } from "@/components/public-chrome";
import { LANG_COOKIE, languageDir, parseLanguage } from "@/lib/i18n/language";
import { getSettings } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "Kholoud Khaled Makeup Artist | Bridal Makeup in Giza",
    template: "%s | Kholoud Khaled Makeup Artist"
  },
  description:
    "Premium bridal makeup, engagement glam, evening looks, and booking inquiries for Kholoud Khaled Makeup Artist in Giza.",
  openGraph: {
    title: "Kholoud Khaled Makeup Artist",
    description: "Bridal beauty, soft glam, and camera-ready confidence in Giza.",
    url: "https://www.facebook.com/kholoudkhaledmakup",
    siteName: "Kholoud Khaled Makeup Artist",
    type: "website"
  }
};

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const settings = await getSettings();
  const cookieStore = await cookies();
  const initialLanguage = parseLanguage(cookieStore.get(LANG_COOKIE)?.value);

  return (
    <html lang={initialLanguage} dir={languageDir(initialLanguage)} data-scroll-behavior="smooth">
      <body>
        <BrandTheme primaryColor={settings.primaryColor} accentColor={settings.accentColor} />
        <PublicChrome settings={settings} initialLanguage={initialLanguage}>
          <main>
            <PageTransition>{children}</PageTransition>
          </main>
        </PublicChrome>
      </body>
    </html>
  );
}
