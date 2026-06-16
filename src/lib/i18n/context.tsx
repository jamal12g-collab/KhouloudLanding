"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { LANG_COOKIE, languageDir } from "./language";
import translations, { type Language } from "./translations";

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  dir: "ltr" | "rtl";
};

const LanguageContext = createContext<LanguageContextType | null>(null);

function persistLanguage(lang: Language) {
  localStorage.setItem(LANG_COOKIE, lang);
  document.cookie = `${LANG_COOKIE}=${lang};path=/;max-age=31536000;SameSite=Lax`;
  document.documentElement.lang = lang;
  document.documentElement.dir = languageDir(lang);
}

export function LanguageProvider({
  children,
  initialLanguage = "en"
}: {
  children: ReactNode;
  initialLanguage?: Language;
}) {
  const [language, setLanguageState] = useState<Language>(initialLanguage);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== "undefined") {
      persistLanguage(lang);
    }
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguage(language === "en" ? "ar" : "en");
  }, [language, setLanguage]);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>) => {
      let value = translations[language]?.[key] ?? translations.en?.[key] ?? key;
      if (params) {
        for (const [k, v] of Object.entries(params)) {
          value = value.replace(`{${k}}`, String(v));
        }
      }
      return value;
    },
    [language]
  );

  useEffect(() => {
    const storedRaw = localStorage.getItem(LANG_COOKIE);
    const stored = storedRaw === "ar" || storedRaw === "en" ? storedRaw : null;
    const lang = stored ?? initialLanguage;
    if (lang !== initialLanguage) {
      setLanguageState(lang);
    }
    persistLanguage(lang);
  }, [initialLanguage]);

  const dir = languageDir(language);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}

export { LanguageContext };
