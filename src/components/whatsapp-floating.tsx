"use client";

import { MessageCircle } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";
import { whatsappLink } from "@/lib/utils";

export function WhatsAppFloating({ phone }: { phone: string }) {
  const { t } = useLanguage();

  return (
    <a
      href={whatsappLink(phone)}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-5 right-5 z-50 grid size-14 place-items-center rounded-full bg-emerald text-white shadow-[0_20px_50px_rgba(15,111,95,.45)] transition hover:-translate-y-1 hover:scale-105"
      aria-label={t("whatsapp.openChat")}
    >
      <MessageCircle className="size-7" />
    </a>
  );
}
