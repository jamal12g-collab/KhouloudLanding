"use client";

import { FormEvent, useState } from "react";
import { Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/lib/i18n/context";
import { LanguageToggle } from "@/components/language-toggle";

export function AdminLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { t } = useLanguage();

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(formData.entries()))
    });

    setLoading(false);
    if (!response.ok) {
      setError(t("adminLogin.invalid"));
      return;
    }
    window.location.reload();
  }

  return (
    <Card className="mx-auto max-w-md p-8">
      <div className="flex justify-end">
        <LanguageToggle />
      </div>
      <div className="mx-auto grid size-14 place-items-center rounded-full bg-rosegold/18 text-rosegold">
        <Lock className="size-7" />
      </div>
      <h1 className="mt-5 text-center font-display text-4xl font-semibold">{t("adminLogin.title")}</h1>
      <p className="mt-3 text-center text-sm text-white/60">{t("adminLogin.subtitle")}</p>
      <form onSubmit={onSubmit} className="mt-8 grid gap-4">
        <Input name="email" type="email" placeholder={t("adminLogin.email")} defaultValue="admin@kholoudmakeup.com" required />
        <Input name="password" type="password" placeholder={t("adminLogin.password")} required />
        {error && <p className="rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">{error}</p>}
        <Button disabled={loading}>
          {loading ? <Loader2 className="size-5 animate-spin" /> : <Lock className="size-5" />}
          {t("adminLogin.login")}
        </Button>
      </form>
    </Card>
  );
}
