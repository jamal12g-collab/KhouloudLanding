import type { ReactNode } from "react";

export function SectionHeading({ eyebrow, title, body }: { eyebrow: ReactNode; title: ReactNode; body?: ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--brand-accent)]">{eyebrow}</p>
      <h2 className="mt-4 font-display text-4xl font-semibold tracking-normal text-pearl sm:text-5xl">{title}</h2>
      {body && <p className="mt-5 text-base leading-8 text-white/62">{body}</p>}
    </div>
  );
}
