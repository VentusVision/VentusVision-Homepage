import { motion } from "framer-motion";

const H_TOP = [
  "VIN Decode Stream", "Fleet Diagnostics", "Telemetry Feed",
  "OBD-II Data", "Recall Records", "EV Battery",
];
const H_BOT = [
  "Emissions Data", "Resale Valuation", "OEM Spec Sheets",
  "Maintenance Hist.", "Crash Analytics", "Journey Route",
];

interface PulseConfig { delay: number; duration: number; dir: 1 | -1; xOff: number }

const V_PULSES: PulseConfig[] = [
  { delay: 0.0, duration: 4.2, dir:  1, xOff: -18 },
  { delay: 2.8, duration: 5.8, dir:  1, xOff: -18 },
  { delay: 5.5, duration: 4.6, dir:  1, xOff: -18 },
  { delay: 1.0, duration: 5.0, dir: -1, xOff:  18 },
  { delay: 3.8, duration: 3.9, dir: -1, xOff:  18 },
  { delay: 6.4, duration: 5.2, dir: -1, xOff:  18 },
];

function Chip({ label }: { label: string }) {
  return (
    <span className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.035] px-3.5 py-1 text-[11px] font-medium text-white/28">
      <span className="h-1 w-1 shrink-0 rounded-full bg-cyan-400/55" />
      {label}
    </span>
  );
}

const EDGE_MASK =
  "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)";

export function DataRoadBackground() {
  const top = [...H_TOP, ...H_TOP];
  const bot = [...H_BOT, ...H_BOT];

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* ─── Vertical road ─── */}
      <div
        className="absolute inset-y-0 left-1/2 -translate-x-1/2"
        style={{ width: 80, background: "rgba(255,255,255,0.016)" }}
      />
      {/* V lane divider */}
      <div
        className="absolute inset-y-0 left-1/2 w-px"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, rgba(255,255,255,0.07) 0px, rgba(255,255,255,0.07) 18px, transparent 18px, transparent 40px)",
        }}
      />
      {/* V edge lines */}
      <div
        className="absolute inset-y-0 w-px"
        style={{ left: "calc(50% - 40px)", background: "rgba(255,255,255,0.055)" }}
      />
      <div
        className="absolute inset-y-0 w-px"
        style={{ left: "calc(50% + 40px)", background: "rgba(255,255,255,0.055)" }}
      />

      {/* Vertical pulse blips */}
      {V_PULSES.map((p, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `calc(50% + ${p.xOff}px)`,
            width: 2,
            height: 72,
            borderRadius: 9999,
            background:
              p.dir === 1
                ? "linear-gradient(to bottom, transparent, rgba(34,211,238,0.78) 50%, transparent)"
                : "linear-gradient(to top, transparent, rgba(34,211,238,0.78) 50%, transparent)",
            boxShadow: "0 0 10px rgba(34,211,238,0.38)",
          }}
          animate={{ y: p.dir === 1 ? [-100, 1400] : [1400, -100] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "linear" }}
        />
      ))}

      {/* ─── Horizontal road ─── */}
      <div
        className="absolute left-0 right-0 top-1/2 -translate-y-1/2"
        style={{ height: 80, background: "rgba(255,255,255,0.016)" }}
      />
      {/* H lane divider */}
      <div
        className="absolute left-0 right-0 top-1/2 h-px"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to right, rgba(255,255,255,0.07) 0px, rgba(255,255,255,0.07) 24px, transparent 24px, transparent 52px)",
        }}
      />
      {/* H edge lines */}
      <div
        className="absolute left-0 right-0 h-px"
        style={{ top: "calc(50% - 40px)", background: "rgba(255,255,255,0.055)" }}
      />
      <div
        className="absolute left-0 right-0 h-px"
        style={{ top: "calc(50% + 40px)", background: "rgba(255,255,255,0.055)" }}
      />

      {/* Top chip lane — left → right */}
      <div
        className="absolute left-0 right-0 overflow-hidden"
        style={{
          top: "calc(50% - 20px)",
          height: 28,
          transform: "translateY(-50%)",
          maskImage: EDGE_MASK,
          WebkitMaskImage: EDGE_MASK,
        }}
      >
        <motion.div
          className="flex items-center gap-5 whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear", repeatType: "loop" }}
        >
          {top.map((label, i) => <Chip key={i} label={label} />)}
        </motion.div>
      </div>

      {/* Bottom chip lane — right → left */}
      <div
        className="absolute left-0 right-0 overflow-hidden"
        style={{
          top: "calc(50% + 20px)",
          height: 28,
          transform: "translateY(-50%)",
          maskImage: EDGE_MASK,
          WebkitMaskImage: EDGE_MASK,
        }}
      >
        <motion.div
          className="flex items-center gap-5 whitespace-nowrap"
          animate={{ x: ["-50%", "0%"] }}
          transition={{ duration: 24, repeat: Infinity, ease: "linear", repeatType: "loop" }}
        >
          {bot.map((label, i) => <Chip key={i} label={label} />)}
        </motion.div>
      </div>

      {/* ─── Intersection glow ─── */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: 160,
          height: 160,
          background:
            "radial-gradient(circle, rgba(34,211,238,0.07) 0%, transparent 70%)",
        }}
      />
      {/* Intersection cross markers */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ width: 6, height: 6, background: "rgba(34,211,238,0.5)", boxShadow: "0 0 12px rgba(34,211,238,0.8)" }}
      />
    </div>
  );
}
