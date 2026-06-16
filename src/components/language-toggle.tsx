"use client";

import { useLanguage } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";

export function LanguageToggle({ className }: { className?: string }) {
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-white/14 bg-white/8 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-white/70 backdrop-blur transition hover:bg-white/16 hover:text-white",
        className
      )}
      aria-label={language === "en" ? t("lang.switchToArabic") : t("lang.switchToEnglish")}
      title={language === "en" ? t("lang.switchToArabic") : t("lang.switchToEnglish")}
    >
      <span className={cn("inline-flex size-5 items-center justify-center rounded-full", language === "en" ? "text-rosegold" : "text-emerald")}>
        {language === "en" ? "EN" : "AR"}
      </span>
      <span className="hidden sm:inline">{language === "en" ? t("lang.arabic") : t("lang.english")}</span>
    </button>
  );
}
