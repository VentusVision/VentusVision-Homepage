import { motion, useAnimation } from "framer-motion";
import { useEffect, useRef, useState } from "react";

// ── Config ─────────────────────────────────────────────────────────────────
// Scroll speed: higher = slower (seconds per full pass)
const DURATION_S = 32;

// Item spacing class (Tailwind). Must match the pr-* value so the
// trailing "gap" after the last item equals the gap between items,
// giving both copies the same pixel width → seamless loop.
const ITEM_GAP = "gap-14 pr-14";

const DATA_STREAMS = [
  "VIN Decode Stream",
  "Telemetry Feed",
  "Recall Records",
  "OEM Spec Sheets",
  "Maintenance History",
  "Fleet Diagnostics",
  "Emissions Data",
  "Resale Valuation",
];

export function DataFlowBanner() {
  const copyRef   = useRef<HTMLDivElement>(null);
  const controls  = useAnimation();
  const widthRef  = useRef(0);
  const [hovered, setHovered] = useState(false);

  // Measure copy width once mounted (and on resize)
  useEffect(() => {
    const el = copyRef.current;
    if (!el) return;

    const startLoop = (w: number) => {
      widthRef.current = w;
      controls.start({
        x: [0, -w],
        transition: { duration: DURATION_S, ease: "linear", repeat: Infinity, repeatType: "loop" },
      });
    };

    const ro = new ResizeObserver(() => {
      if (copyRef.current) startLoop(copyRef.current.offsetWidth);
    });
    ro.observe(el);
    startLoop(el.offsetWidth);

    return () => ro.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Pause / resume on hover
  useEffect(() => {
    if (hovered) controls.stop();
    else if (widthRef.current > 0) {
      controls.start({
        x: [0, -widthRef.current],
        transition: { duration: DURATION_S, ease: "linear", repeat: Infinity, repeatType: "loop" },
      });
    }
  }, [hovered, controls]);

  // Respect prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) controls.stop();
    const handler = () => { if (mq.matches) controls.stop(); };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [controls]);

  return (
    <section
      id="data"
      className="relative overflow-hidden border-y border-border bg-surface py-8"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Edge fades */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-40"
        style={{ background: "linear-gradient(to right, var(--c-surface) 20%, transparent)" }}
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-40"
        style={{ background: "linear-gradient(to left, var(--c-surface) 20%, transparent)" }}
      />

      {/*
        Two identical copies. ResizeObserver measures copy-1 in pixels,
        so we animate exactly -copyWidth (never approximate percentages).
        When x reaches -copyWidth, copy-2 is at position 0 — identical
        to copy-1 at start — so the Framer Motion loop reset is invisible.
      */}
      <motion.div
        className="flex will-change-transform"
        animate={controls}
      >
        {/* Copy 1 — measured */}
        <div ref={copyRef} className={`flex shrink-0 items-center ${ITEM_GAP}`}>
          {DATA_STREAMS.map(label => <MarqueeItem key={label} label={label} />)}
        </div>

        {/* Copy 2 — identical, hidden from screen readers */}
        <div className={`flex shrink-0 items-center ${ITEM_GAP}`} aria-hidden="true">
          {DATA_STREAMS.map(label => <MarqueeItem key={label} label={label} />)}
        </div>
      </motion.div>
    </section>
  );
}

function MarqueeItem({ label }: { label: string }) {
  return (
    <span className="flex shrink-0 items-center gap-4 text-sm font-semibold uppercase tracking-widest text-fg-subtle">
      {label}
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
    </span>
  );
}
