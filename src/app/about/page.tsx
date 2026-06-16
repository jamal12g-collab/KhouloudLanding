import Image from "next/image";
import { Award, Brush, CalendarCheck, HeartHandshake } from "lucide-react";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/section-heading";
import { T } from "@/components/i18n-text";
import { getSettings } from "@/lib/site";
import { facebookAnalysis } from "@/lib/seed-data";

export const metadata = {
  title: "About Us",
  description: "About Kholoud Khaled Makeup Artist and the bridal beauty services offered in Giza."
};

export default async function AboutPage() {
  const settings = await getSettings();
  const aboutCards = [
    { Icon: Brush, titleKey: "aboutPage.card1Title" as const, bodyKey: "aboutPage.card1Body" as const },
    { Icon: CalendarCheck, titleKey: "aboutPage.card2Title" as const, bodyKey: "aboutPage.card2Body" as const },
    { Icon: HeartHandshake, titleKey: "aboutPage.card3Title" as const, bodyKey: "aboutPage.card3Body" as const },
    { Icon: Award, titleKey: "aboutPage.card4Title" as const, bodyKey: "aboutPage.card4Body" as const }
  ];

  return (
    <section className="px-4 pb-20 pt-32 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow={<T k="aboutPage.eyebrow" />} title={<T k="aboutPage.title" />} body={settings.description} />
        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          <div className="relative min-h-[520px] overflow-hidden rounded-lg border border-white/12">
            <Image src={settings.heroImage} alt="Kholoud Khaled makeup portfolio" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
          </div>
          <div className="grid content-center gap-5">
            {aboutCards.map(({ Icon, titleKey, bodyKey }) => (
              <Card key={titleKey} className="flex gap-4 p-5">
                <div className="grid size-12 shrink-0 place-items-center rounded-full bg-rosegold/18 text-rosegold">
                  <Icon className="size-6" />
                </div>
                <div>
                  <h3 className="font-display text-2xl font-semibold"><T k={titleKey} /></h3>
                  <p className="mt-2 text-sm leading-6 text-white/62"><T k={bodyKey} /></p>
                </div>
              </Card>
            ))}
          </div>
        </div>
        <Card className="mt-10 p-6">
          <h2 className="font-display text-3xl font-semibold"><T k="aboutPage.extractedTitle" /></h2>
          <div className="mt-5 grid gap-4 text-sm text-white/68 md:grid-cols-2">
            <p><T k="aboutPage.business" />: {facebookAnalysis.businessName}</p>
            <p><T k="aboutPage.category" />: {facebookAnalysis.category}</p>
            <p><T k="aboutPage.phone" />: {facebookAnalysis.extractedPhone}</p>
            <p><T k="aboutPage.address" />: {facebookAnalysis.extractedAddress}</p>
          </div>
        </Card>
      </div>
    </section>
  );
}
