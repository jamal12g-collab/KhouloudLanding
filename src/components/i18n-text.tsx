"use client";

import { useLanguage } from "@/lib/i18n/context";

export function T({ k, params }: { k: string; params?: Record<string, string | number> }) {
  const { t } = useLanguage();
  return <>{t(k, params)}</>;
}
