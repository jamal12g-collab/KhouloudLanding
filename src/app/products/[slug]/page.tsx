import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { T } from "@/components/i18n-text";
import { getProduct, getProducts, getSettings } from "@/lib/site";
import { whatsappLink } from "@/lib/utils";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);
  return {
    title: product?.title || "Service Details",
    description: product?.description
  };
}

export default async function ProductDetailsPage({ params }: PageProps) {
  const { slug } = await params;
  const [product, settings] = await Promise.all([getProduct(slug), getSettings()]);

  if (!product) notFound();

  return (
    <section className="px-4 pb-20 pt-32 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.05fr_.95fr]">
        <div className="relative min-h-[620px] overflow-hidden rounded-lg border border-white/12">
          <Image src={product.image} alt={product.title} fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
        </div>
        <div className="grid content-center">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-rosegold"><T k="productDetail.label" /></p>
          <h1 className="mt-4 font-display text-5xl font-semibold text-pearl sm:text-6xl">{product.title}</h1>
          {product.price && <p className="mt-5 inline-flex w-fit rounded-full border border-white/16 bg-white/8 px-4 py-2 text-sm font-semibold text-champagne">{product.price}</p>}
          <p className="mt-7 text-lg leading-9 text-white/70">{product.description}</p>
          <Card className="mt-8 p-5">
            <h2 className="font-display text-2xl font-semibold"><T k="productDetail.bestFor" /></h2>
            <p className="mt-3 text-sm leading-6 text-white/62"><T k="productDetail.bestForBody" /></p>
          </Card>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <Link href={`/booking?service=${encodeURIComponent(product.title)}`}>
              <Button size="lg" className="w-full">
                <CalendarDays className="size-5" />
                <T k="productDetail.bookThis" />
              </Button>
            </Link>
            <a href={whatsappLink(settings.whatsapp, `Hello, I want to inquire about ${product.title}.`)} target="_blank" rel="noreferrer">
              <Button size="lg" className="w-full" variant="secondary">
                <MessageCircle className="size-5" />
                <T k="productDetail.askWhatsApp" />
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
