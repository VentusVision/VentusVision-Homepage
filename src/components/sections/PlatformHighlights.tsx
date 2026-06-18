import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { GlowImageFrame } from "../ui/GlowImageFrame";
import { RoutePulse } from "../ui/RoutePulse";
import { EASE_PREMIUM } from "../../lib/motion";

const CITY_LOOP = [
  { top: "42%", left: "32%" },
  { top: "24%", left: "52%" },
  { top: "42%", left: "72%" },
  { top: "58%", left: "52%" },
];

interface Highlight {
  eyebrow: string;
  title: string;
  description: string;
  imageLabel: string;
  imageSrc?: string;
  overlay?: ReactNode;
  reverse?: boolean;
}

const HIGHLIGHTS: Highlight[] = [
  {
    eyebrow: "Data Explorer",
    title: "Real-Time Analytics",
    description:
      "Our Data Explorer surfaces immediate insights into category distribution as records flow in — no batch jobs, no stale dashboards, just a live read on what's moving through the marketplace right now.",
    imageLabel: "Real-Time Analytics Preview",
  },
  {
    eyebrow: "Journey Map",
    title: "Interactive Journey Map",
    description:
      "We turned the B2B data catalog into something you'd actually want to explore: a 3D isometric city where every district maps to a real use-case, gamifying discovery instead of burying it in a spec sheet.",
    imageLabel: "Interactive Journey Map Preview",
    imageSrc: "/journey-map.png",
    overlay: (
      <>
        <RoutePulse path={CITY_LOOP} duration={9} delay={0} />
        <RoutePulse path={CITY_LOOP} duration={9} delay={4.5} />
      </>
    ),
    reverse: true,
  },
];

function HighlightRow({ eyebrow, title, description, imageLabel, imageSrc, overlay, reverse }: Highlight) {
  return (
    <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
      <motion.div
        initial={{ opacity: 0, x: reverse ? 40 : -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7, ease: EASE_PREMIUM }}
        className={reverse ? "lg:order-2" : undefined}
      >
        <span className="text-sm font-medium uppercase tracking-[0.3em] text-cyan-300/70">{eyebrow}</span>
        <h3 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h3>
        <p className="mt-5 text-lg text-white/50">{description}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7, ease: EASE_PREMIUM, delay: 0.15 }}
        className={reverse ? "lg:order-1" : undefined}
      >
        <GlowImageFrame src={imageSrc} alt={title} label={imageLabel} className="h-72 w-full sm:h-96">
          {overlay}
        </GlowImageFrame>
      </motion.div>
    </div>
  );
}

export function PlatformHighlights() {
  return (
    <section className="relative bg-ink px-6 py-28 text-white">
      <div className="mx-auto max-w-6xl space-y-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Platform Highlights</h2>
          <p className="mt-4 text-white/50">
            A closer look at the two systems that make the marketplace feel less like a catalog and more
            like a product.
          </p>
        </motion.div>

        {HIGHLIGHTS.map((highlight) => (
          <HighlightRow key={highlight.title} {...highlight} />
        ))}
      </div>
    </section>
  );
}
