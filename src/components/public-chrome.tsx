"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { LanguageProvider } from "@/lib/i18n/context";
import type { Language } from "@/lib/i18n/translations";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { WhatsAppFloating } from "@/components/whatsapp-floating";

type Settings = {
  businessName: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  address: string;
  facebookUrl: string;
  instagramUrl?: string | null;
  tiktokUrl?: string | null;
  messengerUrl?: string | null;
};

export function PublicChrome({
  settings,
  children,
  initialLanguage
}: {
  settings: Settings;
  children: ReactNode;
  initialLanguage: Language;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <LanguageProvider initialLanguage={initialLanguage}>{children}</LanguageProvider>;
  }

  return (
    <LanguageProvider initialLanguage={initialLanguage}>
      <Navbar settings={settings} />
      {children}
      <Footer settings={settings} />
      <WhatsAppFloating phone={settings.whatsapp} />
    </LanguageProvider>
  );
}
