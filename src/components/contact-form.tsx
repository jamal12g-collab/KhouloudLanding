"use client";

import { FormEvent, useState } from "react";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { useLanguage } from "@/lib/i18n/context";

export function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const { t } = useLanguage();

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setStatus("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const response = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(formData.entries()))
    });

    setLoading(false);
    setStatus(response.ok ? t("contact.success") : t("contact.error"));
    if (response.ok) form.reset();
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Input name="name" placeholder={t("contact.name")} required />
        <Input name="phone" placeholder={t("contact.phone")} />
      </div>
      <Input name="email" type="email" placeholder={t("contact.email")} />
      <Input name="subject" placeholder={t("contact.subject")} />
      <Textarea name="message" placeholder={t("contact.message")} required />
      {status && <p className="rounded-xl border border-white/12 bg-white/8 px-4 py-3 text-sm text-white/75">{status}</p>}
      <Button size="lg" disabled={loading}>
        {loading ? <Loader2 className="size-5 animate-spin" /> : <Send className="size-5" />}
        {t("contact.send")}
      </Button>
    </form>
  );
}
