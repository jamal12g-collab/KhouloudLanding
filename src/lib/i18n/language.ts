import type { Language } from "./translations";

export const LANG_COOKIE = "lang";

export function parseLanguage(value: string | undefined | null): Language {
  return value === "ar" || value === "en" ? value : "en";
}

export function languageDir(language: Language): "ltr" | "rtl" {
  return language === "ar" ? "rtl" : "ltr";
}
