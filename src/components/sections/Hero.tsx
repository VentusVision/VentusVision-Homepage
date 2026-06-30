import { useState, useEffect, memo, Component, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useIntervalWhen } from "../../hooks/useIntervalWhen";
import { MonitorFrame } from "../ui/MonitorFrame";
import { HeroTripleDash } from "../ui/HeroTripleDash";
import { LazyWhenVisible } from "../ui/LazyWhenVisible";
import { OBDTerminal } from "../ui/OBDTerminal";
import { VehicleBackground } from "../ui/VehicleBackground";
import { EASE_PREMIUM } from "../../lib/motion";

class MonitorErrorBoundary extends Component<{ children: ReactNode }, { crashed: boolean }> {
  state = { crashed: false };
  static getDerivedStateFromError() { return { crashed: true }; }
  render() {
    if (this.state.crashed) return <div className="h-full w-full bg-base" />;
    return this.props.children;
  }
}

const STATIC_WORDS = ["The", "Future", "of", "Vehicle", "Data,"];

const CYCLE_WORDS = [
  { label: "Marketplace-Ready.", from: "#2563EB", to: "#06B6D4" },
  { label: "API-First.",         from: "#c4b5fd", to: "#a855f7" },
  { label: "Production-Grade.",  from: "#6ee7b7", to: "#14b8a6" },
  { label: "Enterprise-Ready.",  from: "#f97316", to: "#f43f5e" },
] as const;

const CYCLE_MS = 2600;
const CYCLE_START_DELAY_MS = 1800;

const StaticHeadline = memo(function StaticHeadline({ active }: { active: boolean }) {
  return (
    <span className="block">
      {STATIC_WORDS.map((word, i) => (
        <motion.span
          key={word}
          initial={{ opacity: 0, y: 22 }}
          animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
          transition={{ duration: 0.7, delay: 0.08 + i * 0.09, ease: EASE_PREMIUM }}
          className="mr-[0.25em] inline-block last:mr-0"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
});

const CyclingWord = memo(function CyclingWord({ active }: { active: boolean }) {
  const [cycleIdx, setCycleIdx] = useState(0);
  const [cycling, setCycling] = useState(false);

  useIntervalWhen(
    () => setCycleIdx(i => (i + 1) % CYCLE_WORDS.length),
    CYCLE_MS,
    active && cycling,
  );

  // Delay the word cycle until the headline entrance finishes.
  useEffect(() => {
    if (!active) {
      setCycling(false);
      return;
    }
    const timeoutId = setTimeout(() => setCycling(true), CYCLE_START_DELAY_MS);
    return () => clearTimeout(timeoutId);
  }, [active]);

  const cycle = CYCLE_WORDS[cycleIdx];

  return (
    <motion.span
      initial={{ opacity: 0, y: 22 }}
      animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
      transition={{ duration: 0.7, delay: 0.54, ease: EASE_PREMIUM }}
      className="inline-block align-top"
    >
      <span className="block overflow-hidden" style={{ lineHeight: "1.1" }}>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={cycleIdx}
            initial={{ y: "105%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            exit={{ y: "-105%", opacity: 0 }}
            transition={{ duration: 0.48, ease: EASE_PREMIUM }}
            className="inline-block"
            style={{
              background: `linear-gradient(to right, ${cycle.from}, ${cycle.to})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {cycle.label}
          </motion.span>
        </AnimatePresence>
      </span>
    </motion.span>
  );
});

export function Hero() {
  const [phase, setPhase] = useState<"terminal" | "hero">("terminal");
  const active = phase === "hero";

  return (
    <section
      id="home"
      className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-base px-4 pb-16 pt-24 sm:px-6 sm:pb-24 sm:pt-32"
    >
      <div className="pointer-events-none absolute inset-0 bg-radial-glow" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[300px] w-[500px] -translate-x-1/2 rounded-full bg-brand/[0.05] blur-[80px] sm:h-[600px] sm:w-[900px] sm:blur-[140px]" />
      <VehicleBackground iconOpacity={0.13} laneOpacity={0.13} laneSpeed={36} floatAmplitude={13} />

      <AnimatePresence>
        {phase === "terminal" && (
          <OBDTerminal onComplete={() => setPhase("hero")} />
        )}
      </AnimatePresence>

      <div
        className="relative z-10 flex flex-col items-center text-center"
        aria-hidden={!active}
      >
        <motion.span
          initial={{ opacity: 0, scale: 0.88 }}
          animate={active ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.88 }}
          transition={{ duration: 0.75, ease: EASE_PREMIUM }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand-subtle px-4 py-1.5 text-sm font-medium text-brand backdrop-blur-md"
        >
          <Sparkles className="h-3.5 w-3.5" />
          CARUSO Data Marketplace
        </motion.span>

        <h1 className="max-w-5xl text-4xl sm:text-6xl lg:text-8xl font-extrabold leading-[1.1] tracking-tighter text-fg">
          <StaticHeadline active={active} />
          <CyclingWord active={active} />
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.9, delay: 0.82, ease: EASE_PREMIUM }}
          className="mt-8 max-w-xl text-lg text-fg-muted"
        >
          One secure, fuzzy-searchable marketplace for every vehicle data stream your B2B
          platform will ever need.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 80 }}
        animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 80 }}
        transition={{ duration: 1.1, delay: 0.4, ease: EASE_PREMIUM }}
        className="relative z-10 mt-12 w-full max-w-[1800px] sm:mt-20"
      >
        <MonitorFrame>
          <MonitorErrorBoundary>
            <LazyWhenVisible className="absolute inset-0">
              <HeroTripleDash />
            </LazyWhenVisible>
          </MonitorErrorBoundary>
        </MonitorFrame>
      </motion.div>
    </section>
  );
}
