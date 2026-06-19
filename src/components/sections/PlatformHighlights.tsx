import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { GlowImageFrame } from "../ui/GlowImageFrame";
import { DataExplorerPreview } from "../ui/DataExplorerPreview";
import { MapPreview } from "../ui/MapPreview";
import { EASE_PREMIUM } from "../../lib/motion";

interface Highlight {
  eyebrow: string;
  title: string;
  description: string;
  imageLabel: string;
  imageSrc?: string;
  overlay?: ReactNode;
  preview?: ReactNode;
  reverse?: boolean;
  wide?: boolean;
  frameHeight?: string;
}

const HIGHLIGHTS: Highlight[] = [
  {
    eyebrow: "Data Explorer",
    title: "Real-Time Analytics",
    description:
      "An interactive bar chart showing data availability across car manufacturers — filter by channel (B2B / B2C), status, and one of 10 color-coded categories. Hover bars to see exact counts, click to jump straight into the pre-filtered catalog.",
    imageLabel: "Real-Time Analytics Preview",
    preview: <DataExplorerPreview />,
    wide: true,
  },
  {
    eyebrow: "Journey Map",
    title: "Interactive Journey Map",
    description:
      "We turned the B2B data catalog into something you'd actually want to explore: a 3D isometric city where every district maps to a real use-case, gamifying discovery instead of burying it in a spec sheet.",
    imageLabel: "Interactive Journey Map Preview",
    preview: <MapPreview />,
    wide: true,
    frameHeight: "h-[600px]",
  },
];

function HighlightRow({ eyebrow, title, description, imageLabel, imageSrc, overlay, preview, reverse, wide, frameHeight }: Highlight) {
  if (wide) {
    return (
      <div className="flex flex-col gap-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: EASE_PREMIUM }}
          className="max-w-2xl"
        >
          <span className="text-sm font-medium uppercase tracking-[0.3em] text-cyan-300/70">{eyebrow}</span>
          <h3 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h3>
          <p className="mt-5 text-lg text-white/50">{description}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.75, ease: EASE_PREMIUM, delay: 0.1 }}
        >
          <GlowImageFrame src={imageSrc} alt={title} label={imageLabel} flat className={`${frameHeight ?? "h-[480px]"} w-full`}>
            {preview}
            {overlay}
          </GlowImageFrame>
        </motion.div>
      </div>
    );
  }

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
          {preview}
          {overlay}
        </GlowImageFrame>
      </motion.div>
    </div>
  );
}

export function PlatformHighlights() {
  return (
    <section id="platform" className="relative bg-ink px-6 py-28 text-white">
      <div className="mx-auto max-w-7xl space-y-24">
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
