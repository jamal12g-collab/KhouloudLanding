"use client";

import Link from "next/link";
import { Menu, MessageCircle, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n/context";
import { LanguageToggle } from "@/components/language-toggle";
import { whatsappLink } from "@/lib/utils";

type Settings = {
  businessName: string;
  whatsapp: string;
};

const navKeys = [
  { href: "/", key: "nav.home" },
  { href: "/about", key: "nav.about" },
  { href: "/products", key: "nav.services" },
  { href: "/booking", key: "nav.booking" },
  { href: "/contact", key: "nav.contact" },
  { href: "/admin", key: "nav.admin" }
];

export function Navbar({ settings }: { settings: Settings }) {
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-ink/70 backdrop-blur-2xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="focus-ring flex min-w-0 items-center gap-3 rounded-full">
          <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[var(--brand-accent)] text-ink shadow-glow">
            <Sparkles className="size-5" />
          </span>
          <span className="truncate font-display text-lg font-semibold tracking-normal text-pearl">{settings.businessName}</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navKeys.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-full px-4 py-2 text-sm text-white/70 transition hover:bg-white/10 hover:text-white">
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <LanguageToggle />
          <a href={whatsappLink(settings.whatsapp)} target="_blank" rel="noreferrer">
            <Button size="sm">
              <MessageCircle className="size-4" />
              {t("nav.whatsapp")}
            </Button>
          </a>
        </div>

        <button className="grid size-11 place-items-center rounded-full border border-white/12 bg-white/8 lg:hidden" onClick={() => setOpen((value) => !value)} aria-label={t("nav.toggleMenu")}>
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-ink/95 px-4 py-4 lg:hidden">
          <div className="mx-auto grid max-w-7xl gap-2">
            {navKeys.map((item) => (
              <Link key={item.href} href={item.href} className="rounded-xl px-4 py-3 text-white/80 hover:bg-white/10" onClick={() => setOpen(false)}>
                {t(item.key)}
              </Link>
            ))}
            <div className="mt-2 flex items-center justify-center">
              <LanguageToggle />
            </div>
            <a href={whatsappLink(settings.whatsapp)} target="_blank" rel="noreferrer" className="mt-2">
              <Button className="w-full">
                <MessageCircle className="size-4" />
                {t("nav.whatsapp")}
              </Button>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
