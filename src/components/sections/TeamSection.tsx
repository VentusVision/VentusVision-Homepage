import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { GraduationCap, GitBranch } from "lucide-react";
import { EASE_PREMIUM } from "../../lib/motion";

// Pentagon layout — each member at 72° apart, starting from top
const TEAM = [
  { name: "Dennis",  role: "Sprint Planner · Developer",  from: "#2563EB", to: "#06B6D4", angle: -90 },
  { name: "Tim",     role: "Scrum Organizer · Developer", from: "#7C3AED", to: "#A855F7", angle: -18 },
  { name: "Janick",  role: "Developer",        from: "#0891B2", to: "#22D3EE", angle:  54 },
  { name: "Obai",    role: "Developer",        from: "#1D4ED8", to: "#818CF8", angle: 126 },
  { name: "Vincent", role: "Developer",        from: "#0369A1", to: "#38BDF8", angle: 198 },
] as const;

const RADIUS = 155; // px from center to node
const CX = 250;     // SVG viewBox center X
const CY = 250;     // SVG viewBox center Y

function toXY(angleDeg: number, r = RADIUS) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) };
}

// Animated data packet traveling along a line
function Packet({ x1, y1, x2, y2, delay, color }: {
  x1: number; y1: number; x2: number; y2: number; delay: number; color: string;
}) {
  return (
    <motion.circle
      r={3.5}
      fill={color}
      style={{ filter: `drop-shadow(0 0 4px ${color})` }}
      animate={{
        cx: [x1, x2, x1],
        cy: [y1, y2, y1],
      }}
      transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay }}
    />
  );
}

function Constellation({ inView }: { inView: boolean }) {
  return (
    <div className="relative mx-auto" style={{ width: 500, height: 500 }}>

      {/* SVG layer: connection lines + packets */}
      <svg
        viewBox="0 0 500 500"
        className="absolute inset-0 h-full w-full"
        style={{ overflow: "visible" }}
      >
        <defs>
          {TEAM.map((m) => (
            <linearGradient key={m.name} id={`grad-${m.name}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor={m.from} />
              <stop offset="100%" stopColor={m.to}   />
            </linearGradient>
          ))}
        </defs>

        {/* Connecting lines center → each node */}
        {TEAM.map((m, i) => {
          const { x, y } = toXY(m.angle);
          return (
            <g key={m.name}>
              <motion.line
                x1={CX} y1={CY} x2={x} y2={y}
                stroke={m.from}
                strokeWidth={1}
                strokeOpacity={0.25}
                strokeDasharray="5 4"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={inView ? { pathLength: 1, opacity: 1 } : {}}
                transition={{ duration: 0.7, delay: 0.3 + i * 0.12, ease: EASE_PREMIUM }}
              />
              {inView && (
                <Packet
                  x1={CX} y1={CY} x2={x} y2={y}
                  delay={0.8 + i * 0.4}
                  color={m.from}
                />
              )}
            </g>
          );
        })}

        {/* Subtle pentagon outline */}
        <motion.polygon
          points={TEAM.map(m => { const p = toXY(m.angle); return `${p.x},${p.y}`; }).join(" ")}
          fill="none"
          stroke="rgba(37,99,235,0.08)"
          strokeWidth={1}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 1.0 }}
        />
      </svg>

      {/* Center hub */}
      <motion.div
        className="absolute"
        style={{ left: CX - 36, top: CY - 36 }}
        initial={{ scale: 0, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 0.6, ease: EASE_PREMIUM }}
      >
        {/* Outer ring pulse */}
        <motion.div
          className="absolute inset-0 rounded-full border border-brand/30"
          animate={{ scale: [1, 1.55, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          style={{ width: 72, height: 72 }}
        />
        <div
          className="relative flex h-[72px] w-[72px] items-center justify-center rounded-full bg-white p-2"
          style={{ boxShadow: "0 0 0 4px rgba(37,99,235,0.10), 0 0 32px rgba(37,99,235,0.30)" }}
        >
          <img
            src={`${import.meta.env.BASE_URL}ventusvision.png`}
            alt="Ventus Vision"
            className="h-full w-full object-contain"
          />
        </div>
      </motion.div>

      {/* Team member nodes */}
      {TEAM.map((m, i) => {
        const { x, y } = toXY(m.angle);
        return (
          <motion.div
            key={m.name}
            className="absolute flex flex-col items-center"
            style={{ left: x - 56, top: y - 44, width: 112 }}
            initial={{ scale: 0, opacity: 0 }}
            animate={inView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.4 + i * 0.1, ease: EASE_PREMIUM }}
          >
            {/* Avatar */}
            <motion.div
              whileHover={{ scale: 1.12 }}
              transition={{ type: "spring", stiffness: 320, damping: 18 }}
              className="flex h-[52px] w-[52px] cursor-default items-center justify-center rounded-2xl text-[18px] font-extrabold text-white"
              style={{
                background: `linear-gradient(135deg, ${m.from}, ${m.to})`,
                boxShadow: `0 4px 18px ${m.from}55, 0 0 0 2px rgba(255,255,255,0.8)`,
              }}
            >
              {m.name[0]}
            </motion.div>

            {/* Name + role */}
            <p
              className="mt-2.5 text-[13px] font-extrabold tracking-tight"
              style={{
                background: `linear-gradient(135deg, ${m.from}, ${m.to})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {m.name}
            </p>
            <div className="mt-1 flex flex-wrap justify-center gap-1">
              {m.role.split(" · ").map(r => (
                <span
                  key={r}
                  className="rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white"
                  style={{ background: `linear-gradient(135deg, ${m.from}cc, ${m.to}cc)` }}
                >
                  {r}
                </span>
              ))}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export function TeamSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px 0px" });

  return (
    <section ref={ref} id="team" className="relative overflow-hidden border-t border-border bg-base px-6 py-24">

      {/* Subtle radial glow behind constellation */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: 600, height: 600,
          background: "radial-gradient(ellipse at center, rgba(37,99,235,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl">

        {/* Top: heading centered */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE_PREMIUM }}
          className="mb-4 text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-brand/25 bg-brand-subtle px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.25em] text-brand shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            Team Ventus Vision
          </span>
        </motion.div>

        {/* Two-column: text left, constellation right */}
        <div className="mt-8 grid items-center gap-12 lg:grid-cols-2">

          {/* Left: text */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE_PREMIUM }}
          >
            <h2 className="text-4xl font-extrabold tracking-tight text-fg sm:text-5xl">
              Wer steckt <span className="text-brand">dahinter?</span>
            </h2>

            <p className="mt-6 text-lg leading-relaxed text-fg-muted">
              Dieses Projekt entstand im Rahmen des{" "}
              <span className="font-semibold text-fg">Software Engineering Projekts (SEP)</span>
              {" "}– einem praxisorientierten Teamprojekt im Informatikstudium. Fünf Studierende der{" "}
              <span className="font-semibold text-fg">Hochschule Mannheim</span> haben den CARUSO
              Data Marketplace als vollständigen B2B-Prototyp für den Fahrzeugdaten-Marktplatz entwickelt.
            </p>

            {/* Stats row */}
            <div className="mt-8 flex gap-6">
              {[
                { value: "5",    label: "Teammitglieder" },
                { value: "1",    label: "Semester"        },
                { value: "B2B",  label: "Marktplatz-Typ"  },
              ].map(({ value, label }) => (
                <div key={label}>
                  <p className="text-3xl font-extrabold text-brand">{value}</p>
                  <p className="mt-0.5 text-sm text-fg-muted">{label}</p>
                </div>
              ))}
            </div>

            {/* University + project chip */}
            <div className="mt-8 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm text-fg-muted shadow-card">
                <GraduationCap className="h-4 w-4 text-brand" />
                Hochschule Mannheim · Informatik
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm text-fg-muted shadow-card">
                <GitBranch className="h-4 w-4 text-brand" />
                SEP 2025 / 26
              </span>
            </div>
          </motion.div>

          {/* Right: constellation */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2, ease: EASE_PREMIUM }}
            className="flex justify-center"
          >
            <Constellation inView={inView} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
