import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import { MonitorFrame } from "../ui/MonitorFrame";
import { HeroTripleDash } from "../ui/HeroTripleDash";
import { OBDTerminal } from "../ui/OBDTerminal";

const EASE = [0.16, 1, 0.3, 1] as const;

// Static headline words (blur-reveal entrance)
const STATIC_WORDS = ["The", "Future", "of", "Vehicle", "Data,"];

// Cycling last word — slot-machine animation
const CYCLE_WORDS = [
  { label: "Marketplace-Ready.", from: "#67e8f9", to: "#3b82f6" }, // cyan → blue
  { label: "API-First.",         from: "#c4b5fd", to: "#a855f7" }, // violet → purple
  { label: "Production-Grade.",  from: "#6ee7b7", to: "#14b8a6" }, // emerald → teal
  { label: "Enterprise-Ready.",  from: "#fdba74", to: "#f43f5e" }, // orange → rose
] as const;

const CYCLE_MS = 2600;

export function Hero() {
  const [phase,    setPhase]    = useState<"terminal" | "hero">("terminal");
  const [cycleIdx, setCycleIdx] = useState(0);
  const active = phase === "hero";

  // Start cycling only after the entrance animation has finished
  useEffect(() => {
    if (!active) return;
    let iv: ReturnType<typeof setInterval>;
    const t = setTimeout(() => {
      iv = setInterval(() => setCycleIdx(i => (i + 1) % CYCLE_WORDS.length), CYCLE_MS);
    }, 1800);
    return () => { clearTimeout(t); clearInterval(iv); };
  }, [active]);

  const cycle = CYCLE_WORDS[cycleIdx];

  return (
    <section
      id="home"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-ink px-6 pb-24 pt-32 text-white"
    >
      <div className="pointer-events-none absolute inset-0 bg-radial-glow" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[140px]" />

      {/* OBD terminal overlay */}
      <AnimatePresence>
        {phase === "terminal" && (
          <OBDTerminal onComplete={() => setPhase("hero")} />
        )}
      </AnimatePresence>

      {/* Hero text */}
      <div className="relative z-10 flex flex-col items-center text-center">

        {/* Badge */}
        <motion.span
          initial={{ opacity: 0, scale: 0.88, filter: "blur(12px)" }}
          animate={active
            ? { opacity: 1, scale: 1, filter: "blur(0px)" }
            : { opacity: 0, scale: 0.88, filter: "blur(12px)" }
          }
          transition={{ duration: 0.75, ease: EASE }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-cyan-300 backdrop-blur-md"
        >
          <Sparkles className="h-3.5 w-3.5" />
          CARUSO Data Marketplace
        </motion.span>

        {/* Headline */}
        <h1 className="max-w-5xl text-6xl font-extrabold leading-[1.1] tracking-tighter sm:text-7xl lg:text-8xl">

          {/* Static words — blur-reveal on entrance */}
          <span className="block">
            {STATIC_WORDS.map((word, i) => (
              <motion.span
                key={word}
                initial={{ opacity: 0, y: 22, filter: "blur(18px)" }}
                animate={active
                  ? { opacity: 1, y: 0, filter: "blur(0px)" }
                  : { opacity: 0, y: 22, filter: "blur(18px)" }
                }
                transition={{ duration: 0.7, delay: 0.08 + i * 0.09, ease: EASE }}
                className="mr-[0.25em] inline-block last:mr-0"
              >
                {word}
              </motion.span>
            ))}
          </span>

          {/* Cycling word — slot-machine, always on its own line */}
          <motion.span
            initial={{ opacity: 0, y: 22, filter: "blur(18px)" }}
            animate={active
              ? { opacity: 1, y: 0, filter: "blur(0px)" }
              : { opacity: 0, y: 22, filter: "blur(18px)" }
            }
            transition={{ duration: 0.7, delay: 0.54, ease: EASE }}
            className="inline-block align-top"
          >
            {/* overflow:hidden clips the slot-machine slide */}
            <span className="block overflow-hidden" style={{ lineHeight: "1.1" }}>
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={cycleIdx}
                  initial={{ y: "105%", opacity: 0 }}
                  animate={{ y: "0%",   opacity: 1 }}
                  exit={{    y: "-105%", opacity: 0 }}
                  transition={{ duration: 0.48, ease: EASE }}
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
        </h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, filter: "blur(10px)" }}
          animate={active
            ? { opacity: 1, filter: "blur(0px)" }
            : { opacity: 0, filter: "blur(10px)" }
          }
          transition={{ duration: 0.9, delay: 0.82, ease: EASE }}
          className="mt-8 max-w-xl text-lg text-white/50"
        >
          One secure, fuzzy-searchable marketplace for every vehicle data stream your B2B
          platform will ever need.
        </motion.p>
      </div>

      {/* Monitor frame */}
      <motion.div
        initial={{ opacity: 0, y: 80 }}
        animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 80 }}
        transition={{ duration: 1.1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 mt-20 w-[92vw] max-w-[1400px]"
      >
        <MonitorFrame>
          <HeroTripleDash />
        </MonitorFrame>
      </motion.div>
    </section>
  );
}
