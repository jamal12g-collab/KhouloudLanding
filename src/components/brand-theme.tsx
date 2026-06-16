"use client";

import { useEffect } from "react";

type BrandThemeProps = {
  primaryColor: string;
  accentColor: string;
};

function applyTheme(primaryColor: string, accentColor: string) {
  document.documentElement.style.setProperty("--brand-primary", primaryColor);
  document.documentElement.style.setProperty("--brand-accent", accentColor);
  document.documentElement.style.setProperty("--brand-accent-soft", `${accentColor}2e`);
}

export function BrandTheme({ primaryColor, accentColor }: BrandThemeProps) {
  useEffect(() => {
    applyTheme(primaryColor, accentColor);

    fetch("/api/settings", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((settings) => {
        if (settings?.primaryColor && settings?.accentColor) {
          applyTheme(settings.primaryColor, settings.accentColor);
        }
      })
      .catch(() => {});
  }, [accentColor, primaryColor]);

  return null;
}
