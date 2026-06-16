"use client";

import Image from "next/image";
import Link from "next/link";
import { CalendarDays, ChevronLeft, ChevronRight, MessageCircle, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n/context";
import { whatsappLink } from "@/lib/utils";

type HeroSliderProps = {
  businessName: string;
  tagline: string;
  whatsapp: string;
};

export function HeroSlider({ businessName, tagline, whatsapp }: HeroSliderProps) {
  const [active, setActive] = useState(0);
  const { t } = useLanguage();

  const slides = [
    {
      eyebrowKey: "hero.slide0.eyebrow",
      titleKey: "hero.slide0.title",
      bodyKey: "hero.slide0.body",
      image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=2200&q=88",
      alt: "Premium makeup products and beauty preparation from Unsplash"
    },
    {
      eyebrowKey: "hero.slide1.eyebrow",
      titleKey: "hero.slide1.title",
      bodyKey: "hero.slide1.body",
      image: "https://images.unsplash.com/photo-1487412912498-0447578fcca8?auto=format&fit=crop&w=2200&q=88",
      alt: "Beauty makeup preparation from Unsplash"
    },
    {
      eyebrowKey: "hero.slide2.eyebrow",
      titleKey: "hero.slide2.title",
      bodyKey: "hero.slide2.body",
      image: "https://images.unsplash.com/photo-1512316609839-ce289d3eba0a?auto=format&fit=crop&w=2200&q=88",
      alt: "Wedding celebration styling from Unsplash"
    }
  ];

  const slide = slides[active];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
    }, 6500);

    return () => window.clearInterval(timer);
  }, []);

  function goNext() {
    setActive((current) => (current + 1) % slides.length);
  }

  function goPrev() {
    setActive((current) => (current - 1 + slides.length) % slides.length);
  }

  return (
    <section className="relative min-h-[92vh] overflow-hidden pt-20">
      <AnimatePresence mode="wait">
        <motion.div key={slide.image} className="absolute inset-0" initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.02 }} transition={{ duration: 0.8, ease: "easeOut" }}>
          <Image src={slide.image} alt={slide.alt} fill priority={active === 0} sizes="100vw" className="object-cover" />
        </motion.div>
      </AnimatePresence>

      <div className="glass-grid absolute inset-0 opacity-35" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_76%_18%,var(--brand-accent-soft),transparent_25%),linear-gradient(90deg,rgba(16,11,18,.96)_0%,rgba(16,11,18,.82)_43%,rgba(16,11,18,.34)_100%)]" />
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-ink to-transparent" />

      <div className="relative mx-auto grid min-h-[calc(92vh-5rem)] max-w-7xl items-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-4xl">
          <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/14 bg-white/10 px-4 py-2 text-sm text-white/78 shadow-glass backdrop-blur-xl">
            <Sparkles className="size-4 shrink-0 text-[var(--brand-accent)]" />
            <span className="truncate">{t("hero.badge")}</span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={active} initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.55, ease: "easeOut" }}>
              <p className="mt-8 text-sm font-semibold uppercase tracking-[0.24em] text-[var(--brand-accent)]">{t(slide.eyebrowKey)}</p>
              <h1 className="mt-4 max-w-4xl font-display text-5xl font-semibold tracking-normal text-pearl sm:text-7xl lg:text-8xl">{businessName}</h1>
              <h2 className="mt-5 max-w-3xl font-display text-3xl font-semibold tracking-normal text-white/92 sm:text-5xl">{t(slide.titleKey)}</h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-white/74 sm:text-lg">{t(slide.bodyKey) || tagline}</p>
            </motion.div>
          </AnimatePresence>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/booking">
              <Button size="lg">
                <CalendarDays className="size-5" />
                {t("hero.reserveDate")}
              </Button>
            </Link>
            <a href={whatsappLink(whatsapp)} target="_blank" rel="noreferrer">
              <Button size="lg" variant="secondary">
                <MessageCircle className="size-5" />
                {t("hero.whatsappInquiry")}
              </Button>
            </a>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-4 right-4 z-10 mx-auto flex max-w-7xl items-center justify-between gap-4 sm:px-2">
        <div className="flex items-center gap-2">
          {slides.map((item, index) => (
            <button
              key={item.image}
              onClick={() => setActive(index)}
              className={`h-2 rounded-full transition-all ${active === index ? "w-10 bg-[var(--brand-accent)]" : "w-2 bg-white/35 hover:bg-white/60"}`}
              aria-label={t("hero.slideLabel", { n: index + 1 })}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button onClick={goPrev} className="grid size-11 place-items-center rounded-full border border-white/16 bg-white/10 text-white backdrop-blur-xl transition hover:bg-white/18" aria-label={t("hero.prevSlide")}>
            <ChevronLeft className="size-5" />
          </button>
          <button onClick={goNext} className="grid size-11 place-items-center rounded-full border border-white/16 bg-white/10 text-white backdrop-blur-xl transition hover:bg-white/18" aria-label={t("hero.nextSlide")}>
            <ChevronRight className="size-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
