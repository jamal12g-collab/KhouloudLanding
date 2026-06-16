import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { HeroSlider } from "@/components/hero-slider";
import { ProductCard } from "@/components/product-card";
import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { T } from "@/components/i18n-text";
import { facebookAnalysis } from "@/lib/seed-data";
import { getProducts, getServices, getSettings } from "@/lib/site";

export default async function HomePage() {
  const [settings, products, services] = await Promise.all([getSettings(), getProducts(), getServices()]);
  const featured = products.slice(0, 3);

  return (
    <>
      <HeroSlider businessName={settings.businessName} tagline={settings.tagline} whatsapp={settings.whatsapp} />

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-4">
          {[
            { labelKey: "landing.business", value: facebookAnalysis.category },
            { labelKey: "landing.location", value: <T k="landing.locationValue" /> },
            { labelKey: "landing.bookings", value: <T k="landing.bookingsValue" /> },
            { labelKey: "landing.whatsapp", value: settings.whatsapp }
          ].map(({ labelKey, value }) => (
            <Card key={labelKey} className="p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-rosegold"><T k={labelKey} /></p>
              <p className="mt-3 text-lg font-semibold text-pearl">{value}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow={<T k="landing.eyebrow" />} title={<T k="landing.title" />} body={<T k="landing.body" />} />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {featured.map((product) => (
              <ProductCard key={product.slug} product={product} whatsapp={settings.whatsapp} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/products">
              <Button variant="secondary">
                <T k="landing.viewAll" />
                <ArrowRight className="size-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[.9fr_1.1fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-rosegold"><T k="landing.expEyebrow" /></p>
            <h2 className="mt-4 font-display text-4xl font-semibold text-pearl sm:text-5xl"><T k="landing.expTitle" /></h2>
            <p className="mt-5 text-base leading-8 text-white/65">
              <T k="landing.expBody" />
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {services.map((service) => (
              <Card key={service.slug} className="p-5">
                <CheckCircle2 className="size-6 text-rosegold" />
                <h3 className="mt-4 font-display text-xl font-semibold text-pearl">{service.title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/60">{service.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
