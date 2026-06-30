import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { DataExplorerPreview } from "../ui/DataExplorerPreview";
import { LazyWhenVisible } from "../ui/LazyWhenVisible";
import { MapPreview } from "../ui/MapPreview";
import { VehicleBackground } from "../ui/VehicleBackground";
import { EASE_PREMIUM } from "../../lib/motion";
import { SectionBadge } from "../ui/SectionBadge";
import { cn } from "../../lib/utils";
import { GlowImageFrame } from "../ui/GlowImageFrame";

type PreviewKind = "explorer" | "map";

interface Highlight {
  id: string;
  eyebrow: string;
  title: string;
  description: ReactNode;
  imageLabel: string;
  imageSrc?: string;
  overlay?: ReactNode;
  previewKind?: PreviewKind;
  reverse?: boolean;
  wide?: boolean;
  frameHeight?: string;
  /** Negative horizontal margins to break the frame out of the section max-width */
  frameBleed?: string;
}

const HIGHLIGHTS: Highlight[] = [
  {
    id: "explorer",
    eyebrow: "Data Explorer",
    title: "Real-Time Analytics",
    description: (
      <>
        Visualize data coverage across OEMs and categories. Pick a manufacturer or category via the{" "}
        <span className="font-semibold text-fg">Y-axis selector</span>, hit{" "}
        <span className="text-brand font-semibold">⇅ to flip the view</span> — and hover any bar
        for exact coverage percentages.
      </>
    ),
    imageLabel: "Real-Time Analytics Preview",
    previewKind: "explorer",
    wide: true,
    frameHeight: "h-[480px] sm:h-[640px] lg:h-[900px]",
    frameBleed: undefined,
  },
  {
    id: "map",
    eyebrow: "Journey Map",
    title: "Discover by District",
    description: (
      <>
        We turned the B2B data catalog into something you'd actually want to explore: a{" "}
        <span className="font-semibold text-fg">3D isometric city</span> where every district maps
        to a real use-case,{" "}
        <span className="text-brand font-semibold">gamifying discovery</span> instead of burying it
        in a spec sheet.
      </>
    ),
    imageLabel: "Interactive Journey Map Preview",
    previewKind: "map",
    wide: true,
    frameHeight: "h-[620px] sm:h-[640px] lg:h-[900px]",
    frameBleed: undefined,
  },
];

function HighlightPreview({ kind }: { kind: PreviewKind }) {
  if (kind === "explorer") return <DataExplorerPreview />;
  return <MapPreview />;
}

function HighlightRow({
  id, eyebrow, title, description,
  imageLabel, imageSrc, overlay, previewKind,
  reverse, wide, frameHeight, frameBleed,
}: Highlight) {
  if (wide) {
    return (
      <div id={id} className="flex flex-col gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: EASE_PREMIUM }}
          className="max-w-2xl"
        >
          <SectionBadge label={eyebrow} className="text-xs" />
          <h3 className="mt-5 text-3xl font-extrabold tracking-tight text-fg sm:text-4xl">
            {title}
          </h3>
          <p className="mt-5 text-lg leading-relaxed text-fg-muted">{description}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.75, ease: EASE_PREMIUM, delay: 0.1 }}
          className={frameBleed ?? undefined}
        >
          <GlowImageFrame
            src={imageSrc}
            alt={title}
            label={imageLabel}
            flat
            className={`${frameHeight ?? "h-[480px]"} w-full`}
          >
            {previewKind && (
              <LazyWhenVisible className="absolute inset-0">
                <HighlightPreview kind={previewKind} />
              </LazyWhenVisible>
            )}
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
        <span className="text-sm font-semibold uppercase tracking-[0.3em] text-brand">
          {eyebrow}
        </span>
        <h3 className="mt-4 text-3xl font-extrabold tracking-tight text-fg sm:text-4xl">
          {title}
        </h3>
        <p className="mt-5 text-lg leading-relaxed text-fg-muted">{description}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7, ease: EASE_PREMIUM, delay: 0.15 }}
        className={reverse ? "lg:order-1" : undefined}
      >
        <GlowImageFrame src={imageSrc} alt={title} label={imageLabel} className="h-72 w-full sm:h-96">
          {previewKind && (
            <LazyWhenVisible className="absolute inset-0">
              <HighlightPreview kind={previewKind} />
            </LazyWhenVisible>
          )}
          {overlay}
        </GlowImageFrame>
      </motion.div>
    </div>
  );
}

export function PlatformHighlights() {
  return (
    <section className="relative overflow-x-clip bg-base px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
      {/* Decorative vehicle animation layer — behind all content */}
      <VehicleBackground iconOpacity={0.14} laneOpacity={0.14} laneSpeed={38} floatAmplitude={15} />

      <div className="relative z-[1] mx-auto max-w-7xl space-y-12 lg:space-y-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <h2 className="text-4xl font-extrabold tracking-tight text-fg sm:text-5xl">
            Platform <span className="text-brand">Highlights</span>
          </h2>
          <p className="mt-4 text-lg text-fg-muted">
            A closer look at the analytics layer that makes the marketplace feel less like a catalog
            and more like a <span className="font-semibold text-fg">product</span>.
          </p>
        </motion.div>

        {HIGHLIGHTS.map((highlight) => (
          <HighlightRow key={highlight.title} {...highlight} />
        ))}
      </div>
    </section>
  );
}
