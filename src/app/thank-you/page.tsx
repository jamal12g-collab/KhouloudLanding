import Link from "next/link";
import { CheckCircle2, Home, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { T } from "@/components/i18n-text";
import { getSettings } from "@/lib/site";
import { whatsappLink } from "@/lib/utils";

export const metadata = {
  title: "Thank You",
  description: "Thank you for your booking request."
};

export default async function ThankYouPage() {
  const settings = await getSettings();

  return (
    <section className="grid min-h-screen place-items-center px-4 py-24 sm:px-6 lg:px-8">
      <Card className="max-w-2xl p-8 text-center sm:p-12">
        <div className="mx-auto grid size-16 place-items-center rounded-full bg-emerald/18 text-emerald">
          <CheckCircle2 className="size-9" />
        </div>
        <h1 className="mt-6 font-display text-5xl font-semibold text-pearl"><T k="thankyou.title" /></h1>
        <p className="mt-5 text-base leading-8 text-white/65"><T k="thankyou.body" /></p>
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <a href={whatsappLink(settings.whatsapp)} target="_blank" rel="noreferrer">
            <Button className="w-full" size="lg">
              <MessageCircle className="size-5" />
              <T k="thankyou.whatsapp" />
            </Button>
          </a>
          <Link href="/">
            <Button className="w-full" size="lg" variant="secondary">
              <Home className="size-5" />
              <T k="thankyou.backHome" />
            </Button>
          </Link>
        </div>
      </Card>
    </section>
  );
}
