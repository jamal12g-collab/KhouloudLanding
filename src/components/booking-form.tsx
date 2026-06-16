"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { CalendarCheck, Loader2 } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/input";
import { useLanguage } from "@/lib/i18n/context";

type Product = {
  id?: string;
  title: string;
};

type BookingFormProps = {
  products: Product[];
};

export function BookingForm({ products }: BookingFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selected = searchParams.get("service") || "";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { t } = useLanguage();

  const defaultService = useMemo(() => products.find((product) => product.title === selected)?.title || selected || products[0]?.title || "", [products, selected]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(formData.entries()))
    });

    setLoading(false);

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      setError(body?.error || t("booking.error"));
      return;
    }

    router.push("/thank-you");
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Input name="fullName" placeholder={t("booking.fullName")} required />
        <Input name="phone" placeholder={t("booking.phone")} required />
        <Input name="whatsapp" placeholder={t("booking.whatsapp")} />
        <Input name="email" type="email" placeholder={t("booking.email")} />
      </div>
      <Input name="address" placeholder={t("booking.address")} />
      <Select name="selectedService" defaultValue={defaultService} required>
        {products.map((product) => (
          <option key={product.title} value={product.title}>
            {product.title}
          </option>
        ))}
      </Select>
      <div className="grid gap-4 md:grid-cols-2">
        <Input name="preferredDate" type="date" required />
        <Input name="preferredTime" type="time" required />
      </div>
      <Textarea name="notes" placeholder={t("booking.notes")} />
      {error && <p className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">{error}</p>}
      <Button size="lg" disabled={loading} className="w-full">
        {loading ? <Loader2 className="size-5 animate-spin" /> : <CalendarCheck className="size-5" />}
        {t("booking.confirm")}
      </Button>
    </form>
  );
}
