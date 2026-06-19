import { motion, AnimatePresence, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { EASE_PREMIUM } from "../../lib/motion";

interface StreamItem { id: number; signal: string; color: string; value: string }

const POOL = [
  { signal: "vehicleSpeed",   color: "#22d3ee", vals: ["91.2 km/h", "85.7 km/h", "93.1 km/h", "88.4 km/h", "95.2 km/h"] },
  { signal: "batteryLevel",   color: "#4ade80", vals: ["73.5%",     "73.8%",     "74.1%",     "73.9%",     "74.4%"     ] },
  { signal: "motorTorque",    color: "#fb923c", vals: ["156 Nm",    "133 Nm",    "167 Nm",    "148 Nm",    "162 Nm"    ] },
  { signal: "gpsLatitude",    color: "#a855f7", vals: ["48.1374°N", "48.1377°N", "48.1380°N", "48.1382°N", "48.1385°N"] },
  { signal: "engineTemp",     color: "#f43f5e", vals: ["87°C",      "88°C",      "86°C",      "89°C",      "87°C"      ] },
  { signal: "faultCodes",     color: "#60a5fa", vals: ["NONE",      "NONE",      "P0A80 ⚠",  "NONE",      "NONE"      ] },
  { signal: "doorStatus",     color: "#34d399", vals: ["LOCKED",    "LOCKED",    "UNLOCKED",  "LOCKED",    "LOCKED"    ] },
  { signal: "stateOfCharge",  color: "#facc15", vals: ["73%",       "74%",       "74%",       "75%",       "74%"       ] },
];

const CAT_BARS = [
  { name: "Charging & EV",  color: "#f43f5e", pct: 78 },
  { name: "Safety",         color: "#60a5fa", pct: 91 },
  { name: "Battery",        color: "#4ade80", pct: 62 },
  { name: "Trip & Driving", color: "#a855f7", pct: 55 },
  { name: "Powertrain",     color: "#fb923c", pct: 43 },
];

const OEMS        = ["BMW", "Audi", "Mercedes", "Tesla", "VW", "Porsche"];
const SPEED_CYCLE = [87, 91, 85, 93, 88, 95, 82, 90];
const RPM_CYCLE   = [3240, 3580, 2950, 3820, 3100, 4100, 2780, 3650];
const BAT_CYCLE   = [73.2, 73.5, 73.8, 74.1, 73.9, 74.3, 74.0, 74.6];

export function HeroDashboard() {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px 0px" });

  const [tick,   setTick]   = useState(0);
  const [stream, setStream] = useState<StreamItem[]>([]);
  const [oemIdx, setOemIdx] = useState(0);

  const counter = useRef(0);
  const pIdx    = useRef(0);

  useEffect(() => {
    if (!inView) return;

    const ticker   = setInterval(() => setTick(t => t + 1), 1000);
    const streamer = setInterval(() => {
      const pool = POOL[pIdx.current % POOL.length];
      const vi   = Math.floor(counter.current / POOL.length) % pool.vals.length;
      setStream(s => [{ id: counter.current, signal: pool.signal, color: pool.color, value: pool.vals[vi] }, ...s.slice(0, 5)]);
      counter.current++;
      pIdx.current++;
    }, 1050);
    const oemTimer = setInterval(() => setOemIdx(i => (i + 1) % OEMS.length), 1700);

    return () => { clearInterval(ticker); clearInterval(streamer); clearInterval(oemTimer); };
  }, [inView]);

  const speed   = SPEED_CYCLE[tick % SPEED_CYCLE.length];
  const rpm     = RPM_CYCLE[tick   % RPM_CYCLE.length];
  const battery = BAT_CYCLE[tick   % BAT_CYCLE.length];

  return (
    <div ref={ref} className="absolute inset-0 flex flex-col overflow-hidden text-white">

      {/* ── Status bar ── */}
      <div className="shrink-0 flex items-center gap-2.5 border-b border-white/[0.06] bg-white/[0.02] px-4 py-2">
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
        </span>
        <span className="font-mono text-[8px] text-green-400/80 tracking-wide">LIVE</span>
        <span className="font-mono text-[8px] text-white/20">·</span>
        <span className="font-mono text-[8px] text-cyan-300/70">VIN: WBA3A5G51DN570953</span>
        <span className="font-mono text-[8px] text-white/20">·</span>
        <span className="font-mono text-[8px] text-white/40">BMW 3-Series · Fleet Unit 047</span>
        <div className="ml-auto flex items-center gap-1">
          {OEMS.map((oem, i) => (
            <motion.span
              key={oem}
              animate={{ opacity: i === oemIdx ? 1 : 0.16, scale: i === oemIdx ? 1 : 0.92 }}
              transition={{ duration: 0.3, ease: EASE_PREMIUM }}
              className="rounded border border-white/[0.07] px-1.5 py-0.5 font-mono text-[7px] text-white/45"
            >
              {oem}
            </motion.span>
          ))}
        </div>
      </div>

      {/* ── Main ── */}
      <div className="flex min-h-0 flex-1">

        {/* Left — vehicle gauges */}
        <div className="flex w-[190px] shrink-0 flex-col gap-4 border-r border-white/[0.06] p-4">

          {/* Speed */}
          <div>
            <p className="mb-1 font-mono text-[7px] uppercase tracking-[0.18em] text-white/28">Speed</p>
            <div className="flex items-baseline gap-1.5">
              <AnimatePresence mode="wait">
                <motion.span
                  key={speed}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.22, ease: EASE_PREMIUM }}
                  className="font-mono text-[42px] font-bold leading-none tabular-nums text-white"
                >
                  {speed}
                </motion.span>
              </AnimatePresence>
              <span className="font-mono text-[10px] text-white/30">km/h</span>
            </div>
          </div>

          {/* Battery */}
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <p className="font-mono text-[7px] uppercase tracking-[0.18em] text-white/28">Battery</p>
              <AnimatePresence mode="wait">
                <motion.span
                  key={battery.toFixed(1)}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="font-mono text-[9px] tabular-nums text-green-400"
                >
                  {battery.toFixed(1)}%
                </motion.span>
              </AnimatePresence>
            </div>
            <div className="h-[5px] overflow-hidden rounded-full bg-white/[0.06]">
              <motion.div
                className="h-full rounded-full bg-green-400"
                animate={{ width: `${battery}%` }}
                transition={{ duration: 0.55, ease: "easeOut" }}
                style={{ boxShadow: "0 0 10px rgba(74,222,128,0.55)" }}
              />
            </div>
          </div>

          {/* RPM */}
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <p className="font-mono text-[7px] uppercase tracking-[0.18em] text-white/28">Engine RPM</p>
              <AnimatePresence mode="wait">
                <motion.span
                  key={rpm}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="font-mono text-[9px] tabular-nums text-cyan-300"
                >
                  {rpm.toLocaleString()}
                </motion.span>
              </AnimatePresence>
            </div>
            <div className="h-[5px] overflow-hidden rounded-full bg-white/[0.06]">
              <motion.div
                className="h-full rounded-full bg-cyan-400"
                animate={{ width: `${(rpm / 8000) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                style={{ boxShadow: "0 0 10px rgba(34,211,238,0.55)" }}
              />
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-white/[0.05]" />

          {/* Category bars */}
          <div>
            <p className="mb-2 font-mono text-[7px] uppercase tracking-[0.18em] text-white/28">Data by Category</p>
            <div className="flex flex-col gap-[7px]">
              {CAT_BARS.map((c, i) => (
                <div key={c.name} className="flex items-center gap-2">
                  <div className="h-[3px] w-full overflow-hidden rounded-full bg-white/[0.05]">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: c.color, boxShadow: `0 0 6px ${c.color}80` }}
                      initial={{ width: 0 }}
                      animate={inView ? { width: `${c.pct}%` } : { width: 0 }}
                      transition={{ delay: 0.4 + i * 0.1, duration: 0.9, ease: EASE_PREMIUM }}
                    />
                  </div>
                  <span className="w-6 shrink-0 text-right font-mono text-[6.5px] tabular-nums text-white/25">{c.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right — live stream */}
        <div className="flex min-w-0 flex-1 flex-col px-4 py-4">

          {/* Stream header */}
          <div className="mb-3 flex shrink-0 items-center gap-2">
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan-400" />
            </span>
            <p className="font-mono text-[7px] uppercase tracking-[0.18em] text-white/28">Live Signal Stream</p>
            <div className="ml-auto flex items-center gap-3">
              <span className="font-mono text-[7px] text-white/18">847 / 847 sensors</span>
              <span className="rounded-full bg-green-400/12 px-1.5 py-0.5 font-mono text-[7px] text-green-400">● OK</span>
            </div>
          </div>

          {/* Stream items */}
          <div className="flex flex-col gap-1 overflow-hidden">
            <AnimatePresence initial={false}>
              {stream.map((item, i) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -16, height: 0, marginBottom: 0 }}
                  animate={{ opacity: Math.max(0.15, 1 - i * 0.16), x: 0, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.22, ease: EASE_PREMIUM }}
                  className="flex items-center gap-3 overflow-hidden rounded-lg border border-white/[0.04] bg-white/[0.02] px-3 py-2"
                  style={{ borderLeftColor: item.color, borderLeftWidth: 2 }}
                >
                  <span
                    className="h-[7px] w-[7px] shrink-0 rounded-full"
                    style={{ backgroundColor: item.color, boxShadow: `0 0 6px ${item.color}` }}
                  />
                  <span className="flex-1 truncate font-mono text-[9px] text-white/50">{item.signal}</span>
                  <span className="font-mono text-[9px] font-semibold tabular-nums" style={{ color: item.color }}>
                    {item.value}
                  </span>
                  <span className="w-10 shrink-0 text-right font-mono text-[7px] text-white/18">
                    {i === 0 ? "now" : `${i}s ago`}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Placeholder rows while stream fills */}
            {[...Array(Math.max(0, 5 - stream.length))].map((_, i) => (
              <div key={`ph-${i}`}
                className="h-[33px] rounded-lg border border-white/[0.03] bg-white/[0.01]" />
            ))}
          </div>

          {/* Fleet stats */}
          <div className="mt-auto shrink-0 border-t border-white/[0.06] pt-3">
            <div className="flex items-center gap-6">
              {[
                { label: "Fleet Nodes",   value: "2,847",    color: "text-cyan-300" },
                { label: "Data Streams",  value: "847 / 847", color: "text-white"   },
                { label: "Categories",    value: "10",        color: "text-white"   },
              ].map(s => (
                <div key={s.label}>
                  <p className="font-mono text-[6.5px] uppercase tracking-[0.15em] text-white/22">{s.label}</p>
                  <p className={`font-mono text-[11px] font-bold tabular-nums ${s.color}`}>{s.value}</p>
                </div>
              ))}
              <div className="ml-auto text-right">
                <p className="font-mono text-[7px] text-green-400/65">● MARKETPLACE SYNC: ONLINE</p>
                <p className="font-mono text-[7px] text-cyan-300/50">● CAN BUS: ISO 15765-4 OK</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
