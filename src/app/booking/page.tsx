import { Suspense } from "react";
import { Clock, MapPin, MessageCircle, ShieldCheck } from "lucide-react";
import { BookingForm } from "@/components/booking-form";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/section-heading";
import { T } from "@/components/i18n-text";
import { getProducts, getSettings } from "@/lib/site";
import { whatsappLink } from "@/lib/utils";

export const metadata = {
  title: "Booking",
  description: "Request a bridal makeup or event glam booking with Kholoud Khaled Makeup Artist."
};

export default async function BookingPage() {
  const [settings, products] = await Promise.all([getSettings(), getProducts()]);

  return (
    <section className="px-4 pb-20 pt-32 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow={<T k="bookingPage.eyebrow" />} title={<T k="bookingPage.title" />} body={<T k="bookingPage.body" />} />
        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_.7fr]">
          <Card className="p-5 sm:p-8">
            <Suspense fallback={<p className="text-white/65"><T k="booking.loading" /></p>}>
              <BookingForm products={products.map((product) => ({ id: "id" in product ? product.id : undefined, title: product.title }))} />
            </Suspense>
          </Card>
          <div className="grid content-start gap-4">
            {[
              { Icon: Clock, titleKey: "bookingPage.limitedDates" as const, bodyKey: "bookingPage.limitedDatesBody" as const },
              { Icon: MapPin, titleKey: "bookingPage.gizaStudio" as const, bodyKey: null },
              { Icon: ShieldCheck, titleKey: "bookingPage.storedSecurely" as const, bodyKey: "bookingPage.storedSecurelyBody" as const },
              { Icon: MessageCircle, titleKey: "bookingPage.fastWhatsApp" as const, bodyKey: "bookingPage.fastWhatsAppBody" as const }
            ].map(({ Icon, titleKey, bodyKey }) => (
              <Card key={titleKey} className="p-5">
                <Icon className="size-6 text-rosegold" />
                <h3 className="mt-3 font-display text-2xl font-semibold text-pearl"><T k={titleKey} /></h3>
                {bodyKey && <p className="mt-2 text-sm leading-6 text-white/62"><T k={bodyKey} /></p>}
                {!bodyKey && <p className="mt-2 text-sm leading-6 text-white/62">{settings.address}</p>}
              </Card>
            ))}
            <a href={whatsappLink(settings.whatsapp)} target="_blank" rel="noreferrer" className="rounded-lg border border-emerald/40 bg-emerald/18 px-5 py-4 text-center font-semibold text-white transition hover:bg-emerald/28">
              <T k="bookingPage.openWhatsApp" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
