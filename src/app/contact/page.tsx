import { Facebook, Instagram, Mail, MapPin, MessageCircle, Music2, Phone, Send } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/section-heading";
import { T } from "@/components/i18n-text";
import { getSettings } from "@/lib/site";
import { whatsappLink } from "@/lib/utils";

export const metadata = {
  title: "Contact",
  description: "Contact Kholoud Khaled Makeup Artist by phone, WhatsApp, Facebook, Messenger, Instagram, or contact form."
};

export default async function ContactPage() {
  const settings = await getSettings();
  const socials = [
    { label: "Facebook", href: settings.facebookUrl, icon: Facebook },
    { label: "Instagram", href: settings.instagramUrl, icon: Instagram },
    { label: "TikTok", href: settings.tiktokUrl, icon: Music2 },
    { label: "WhatsApp", href: whatsappLink(settings.whatsapp), icon: MessageCircle },
    { label: "Messenger", href: settings.messengerUrl, icon: Send }
  ].filter((item) => Boolean(item.href));

  return (
    <section className="px-4 pb-20 pt-32 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow={<T k="contactPage.eyebrow" />} title={<T k="contactPage.title" />} body={<T k="contactPage.body" />} />
        <div className="mt-12 grid gap-8 lg:grid-cols-[.8fr_1.2fr]">
          <div className="grid gap-4">
            <Card className="p-5">
              <Phone className="size-6 text-rosegold" />
              <h3 className="mt-3 font-display text-2xl font-semibold"><T k="contactPage.phone" /></h3>
              <a className="mt-2 block text-white/68" href={`tel:${settings.phone}`}>
                {settings.phone}
              </a>
            </Card>
            <Card className="p-5">
              <MapPin className="size-6 text-rosegold" />
              <h3 className="mt-3 font-display text-2xl font-semibold"><T k="contactPage.address" /></h3>
              <p className="mt-2 text-white/68">{settings.address}</p>
            </Card>
            <Card className="p-5">
              <Mail className="size-6 text-rosegold" />
              <h3 className="mt-3 font-display text-2xl font-semibold"><T k="contactPage.social" /></h3>
              <div className="mt-4 flex flex-wrap gap-3">
                {socials.map((item) => {
                  const Icon = item.icon;
                  return (
                    <a key={item.label} href={item.href || "#"} target="_blank" rel="noreferrer" aria-label={item.label} className="grid size-11 place-items-center rounded-full border border-white/12 bg-white/8 transition hover:-translate-y-1 hover:text-rosegold">
                      <Icon className="size-5" />
                    </a>
                  );
                })}
              </div>
            </Card>
          </div>
          <Card className="p-5 sm:p-8">
            <ContactForm />
          </Card>
        </div>
      </div>
    </section>
  );
}
