"use client";

import Link from "next/link";
import { Facebook, Instagram, MessageCircle, Music2, Send } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";
import { whatsappLink } from "@/lib/utils";

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

export function Footer({ settings }: { settings: Settings }) {
  const { t } = useLanguage();
  const socials = [
    { href: settings.facebookUrl, label: "Facebook", icon: Facebook },
    { href: settings.instagramUrl, label: "Instagram", icon: Instagram },
    { href: settings.tiktokUrl, label: "TikTok", icon: Music2 },
    { href: whatsappLink(settings.whatsapp), label: "WhatsApp", icon: MessageCircle },
    { href: settings.messengerUrl, label: "Messenger", icon: Send }
  ].filter((item) => Boolean(item.href));

  return (
    <footer className="border-t border-white/10 bg-ink px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1.2fr_.8fr_.8fr]">
        <div>
          <h2 className="font-display text-3xl font-semibold text-pearl">{settings.businessName}</h2>
          <p className="mt-3 max-w-md text-sm leading-6 text-white/62">{settings.tagline}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            {socials.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.label}
                  href={item.href || "#"}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={item.label}
                  className="grid size-11 place-items-center rounded-full border border-white/12 bg-white/8 text-white/80 transition hover:-translate-y-1 hover:border-rosegold hover:text-rosegold"
                >
                  <Icon className="size-5" />
                </a>
              );
            })}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--brand-accent)]">{t("footer.pages")}</h3>
          <div className="mt-4 grid gap-2 text-sm text-white/65">
            <Link href="/about">{t("footer.aboutUs")}</Link>
            <Link href="/products">{t("footer.productsServices")}</Link>
            <Link href="/booking">{t("footer.bookNow")}</Link>
            <Link href="/contact">{t("footer.contactLink")}</Link>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--brand-accent)]">{t("footer.contact")}</h3>
          <div className="mt-4 grid gap-2 text-sm leading-6 text-white/65">
            <a href={`tel:${settings.phone}`}>{settings.phone}</a>
            <span>{settings.address}</span>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-7xl border-t border-white/10 pt-6 text-xs text-white/45">
        {t("footer.builtFor")}
      </div>
    </footer>
  );
}
