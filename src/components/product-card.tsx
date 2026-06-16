"use client";

import Image from "next/image";
import Link from "next/link";
import { CalendarDays, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/lib/i18n/context";
import { whatsappLink } from "@/lib/utils";

type Product = {
  title: string;
  slug: string;
  description: string;
  price?: string | null;
  image: string;
};

export function ProductCard({ product, whatsapp }: { product: Product; whatsapp: string }) {
  const { t } = useLanguage();

  return (
    <article className="transition duration-500 hover:-translate-y-1">
      <Card className="group h-full overflow-hidden">
        <Link href={`/products/${product.slug}`} className="block">
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image
              src={product.image}
              alt={product.title}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
            {product.price && <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-ink/50 px-3 py-1 text-xs font-semibold text-pearl backdrop-blur">{product.price}</span>}
          </div>
        </Link>
        <div className="grid gap-5 p-5">
          <div>
            <h3 className="font-display text-2xl font-semibold text-pearl">{product.title}</h3>
            <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/62">{product.description}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link href={`/booking?service=${encodeURIComponent(product.title)}`}>
              <Button className="w-full" variant="primary">
                <CalendarDays className="size-4" />
                {t("product.book")}
              </Button>
            </Link>
            <a href={whatsappLink(whatsapp, `Hello, I want to inquire about ${product.title}.`)} target="_blank" rel="noreferrer">
              <Button className="w-full" variant="secondary">
                <MessageCircle className="size-4" />
                {t("product.ask")}
              </Button>
            </a>
          </div>
        </div>
      </Card>
    </article>
  );
}
