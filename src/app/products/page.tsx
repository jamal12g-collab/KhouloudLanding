import { ProductCard } from "@/components/product-card";
import { SectionHeading } from "@/components/section-heading";
import { T } from "@/components/i18n-text";
import { getProducts, getSettings } from "@/lib/site";

export const metadata = {
  title: "Products & Services",
  description: "Explore bridal makeup, engagement glam, evening looks, and hair styling coordination services."
};

export default async function ProductsPage() {
  const [settings, products] = await Promise.all([getSettings(), getProducts()]);

  return (
    <section className="px-4 pb-20 pt-32 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow={<T k="productsPage.eyebrow" />} title={<T k="productsPage.title" />} body={<T k="productsPage.body" />} />
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} whatsapp={settings.whatsapp} />
          ))}
        </div>
      </div>
    </section>
  );
}
