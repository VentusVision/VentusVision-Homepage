import { motion, AnimatePresence, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Search, Battery, BatteryCharging, Thermometer, Zap, Clock,
  Gauge, Activity, Wrench, Droplets, ShoppingCart, X,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { EASE_PREMIUM } from "../../lib/motion";

// ─── Types ────────────────────────────────────────────────────────
interface ResultItem {
  title: string;
  status: "AVAILABLE" | "DRAFT";
  types: string[];
  oems: string[];
  description: string;
  Icon: LucideIcon;
  color: string;
}
interface Scenario {
  query: string;
  category: string;
  catColor: string;
  count: number;
  results: ResultItem[];
}

// ─── Data ─────────────────────────────────────────────────────────
const C = ["#60a5fa","#4ade80","#fb923c","#a855f7","#f43f5e","#facc15","#22d3ee","#ec4899"] as const;

const SCENARIOS: Scenario[] = [
  {
    query: "battery health index", category: "Battery & Energy", catColor: "#fb923c", count: 62,
    results: [
      { title: "Battery Health Index",     status: "AVAILABLE", types: ["B2B"],       oems: ["BMW","Audi","Mercedes-Benz","Tesla"],  Icon: Battery,        color: C[0], description: "Aggregated health score (0–100) based on capacity fade and internal resistance measurements." },
      { title: "State of Health (SoH)",    status: "AVAILABLE", types: ["B2B","B2C"], oems: ["BMW","Mercedes-Benz","VW","Renault"],  Icon: Battery,        color: C[1], description: "Current battery capacity as a percentage of original design capacity, updated after each full cycle." },
      { title: "Battery Cell Temperature", status: "AVAILABLE", types: ["B2B"],       oems: ["BMW","Tesla","Porsche","Audi"],        Icon: Thermometer,    color: C[2], description: "Temperature readings from individual battery cell groups during driving and charging cycles." },
      { title: "Battery Charge Event",     status: "AVAILABLE", types: ["B2B"],       oems: ["BMW","Audi","Tesla","Porsche","VW"],   Icon: BatteryCharging, color: C[3], description: "Detailed log of every charge event including duration, energy in kWh, start and end SoC." },
    ],
  },
  {
    query: "ev charging range", category: "Charging & EV", catColor: "#f43f5e", count: 34,
    results: [
      { title: "AC Charging Session Data",     status: "AVAILABLE", types: ["B2B","B2C"], oems: ["BMW","Audi","Mercedes-Benz","VW"],   Icon: Zap,            color: C[4], description: "Real-time and historical data on AC charging events including energy transferred and charging point ID." },
      { title: "DC Fast Charge Events",        status: "AVAILABLE", types: ["B2B"],       oems: ["BMW","Tesla","Porsche","Hyundai"],   Icon: BatteryCharging, color: C[5], description: "Data on DC fast charging sessions including peak power and thermal throttling events." },
      { title: "Est. Charging Completion Time",status: "AVAILABLE", types: ["B2B","B2C"], oems: ["Tesla","BMW","Audi","Porsche"],      Icon: Clock,          color: C[6], description: "Predicted time until fully charged based on current SoC, charging rate, and battery temperature." },
      { title: "State of Charge (SoC)",        status: "AVAILABLE", types: ["B2B","B2C"], oems: ["BMW","Audi","VW","Tesla","Renault"], Icon: Battery,        color: C[7], description: "Current battery charge level as a percentage, sampled at configurable intervals." },
    ],
  },
  {
    query: "engine rpm telemetry", category: "Powertrain & Engine", catColor: "#facc15", count: 28,
    results: [
      { title: "Engine RPM Telemetry",     status: "AVAILABLE", types: ["B2B"],       oems: ["BMW","Audi","Mercedes-Benz","VW"],     Icon: Gauge,    color: C[0], description: "Continuous engine speed readings in revolutions per minute, sampled at up to 10 Hz." },
      { title: "Torque Output Data",       status: "AVAILABLE", types: ["B2B"],       oems: ["BMW","Porsche","Audi","Mercedes-Benz"],Icon: Activity, color: C[1], description: "Actual and requested torque values from the engine management system in real time." },
      { title: "Gear State & Shift Events",status: "AVAILABLE", types: ["B2B"],       oems: ["BMW","Audi","VW","Mercedes-Benz"],    Icon: Gauge,    color: C[2], description: "Current gear position and shift event timestamps for manual and automatic transmissions." },
      { title: "Motor Temperature",        status: "DRAFT",     types: ["B2B"],       oems: ["BMW","Tesla","Audi","Porsche"],       Icon: Thermometer, color: C[3], description: "Temperature of the electric drive motor or combustion engine block during operation." },
    ],
  },
  {
    query: "brake pad wear level", category: "Maintenance & Diag.", catColor: "#22d3ee", count: 19,
    results: [
      { title: "Brake Pad Wear Level",  status: "AVAILABLE", types: ["B2B","B2C"], oems: ["BMW","Audi","Mercedes-Benz","VW","Porsche"], Icon: Wrench,   color: C[4], description: "Estimated remaining brake pad thickness derived from onboard wear sensors and mileage data." },
      { title: "OBD Fault Codes",       status: "AVAILABLE", types: ["B2B"],       oems: ["BMW","Audi","Tesla","VW","Renault"],         Icon: Activity, color: C[5], description: "Standardized DTC codes read from the OBD-II port, including freeze frame data at time of fault." },
      { title: "Service Interval Data", status: "AVAILABLE", types: ["B2B","B2C"], oems: ["BMW","Audi","Mercedes-Benz","VW"],           Icon: Clock,    color: C[6], description: "Days and kilometres remaining until the next scheduled maintenance service." },
      { title: "Oil Level Status",      status: "AVAILABLE", types: ["B2C"],       oems: ["BMW","Audi","Mercedes-Benz","Porsche"],      Icon: Droplets, color: C[7], description: "Current engine oil level and quality indicator from the onboard measurement system." },
    ],
  },
];

// ─── Fuzzy highlight ──────────────────────────────────────────────
function Highlight({ text, query, color }: { text: string; query: string; color: string }) {
  if (!query || query.length < 2) return <>{text}</>;
  const words = query.toLowerCase().split(/\s+/).filter(w => w.length >= 2);
  if (!words.length) return <>{text}</>;
  const esc   = words.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const parts = text.split(new RegExp(`(${esc.join("|")})`, "gi"));
  return (
    <>
      {parts.map((p, i) =>
        i % 2 === 1
          ? <span key={i} style={{ color, fontWeight: 700 }}>{p}</span>
          : <span key={i}>{p}</span>
      )}
    </>
  );
}

// ─── Component ────────────────────────────────────────────────────
export function HeroCatalogSearch() {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px 0px" });

  const [displayText,  setDisplayText]  = useState("");
  const [showResults,  setShowResults]  = useState(false);
  const [scenarioIdx,  setScenarioIdx]  = useState(0);

  // State-machine typewriter: typing → showing → deleting → waiting
  useEffect(() => {
    if (!inView) return;
    let tid: ReturnType<typeof setTimeout>;
    let alive = true;

    type Phase = "waiting" | "typing" | "showing" | "deleting";
    let phase: Phase       = "waiting";
    let si                 = 0;   // scenario index
    let ci                 = 0;   // char index

    function tick() {
      if (!alive) return;
      const query = SCENARIOS[si].query;

      if (phase === "waiting") {
        phase = "typing"; ci = 0;
        tid = setTimeout(tick, 500);
        return;
      }
      if (phase === "typing") {
        ci++;
        setDisplayText(query.slice(0, ci));
        if (ci < query.length) {
          tid = setTimeout(tick, 48 + Math.random() * 28);
        } else {
          setScenarioIdx(si);
          setShowResults(true);
          phase = "showing";
          tid = setTimeout(tick, 3200);
        }
        return;
      }
      if (phase === "showing") {
        setShowResults(false);
        phase = "deleting";
        tid = setTimeout(tick, 280);
        return;
      }
      if (phase === "deleting") {
        ci--;
        setDisplayText(query.slice(0, ci));
        if (ci > 0) {
          tid = setTimeout(tick, 22);
        } else {
          si    = (si + 1) % SCENARIOS.length;
          phase = "waiting";
          tid   = setTimeout(tick, 480);
        }
      }
    }

    tid = setTimeout(tick, 800);
    return () => { alive = false; clearTimeout(tid); };
  }, [inView]);

  const scenario = SCENARIOS[scenarioIdx];

  return (
    <div ref={ref} className="absolute inset-0 flex flex-col overflow-hidden text-white">

      {/* ── Top label ── */}
      <div className="shrink-0 flex items-center justify-between px-5 pt-4 pb-2">
        <span className="font-mono text-[8px] uppercase tracking-[0.22em] text-cyan-300/55">
          CARUSO Data Marketplace
        </span>
        <AnimatePresence mode="wait">
          <motion.span
            key={showResults ? `count-${scenarioIdx}` : "idle"}
            initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="font-mono text-[8px] text-white/25"
          >
            {showResults ? `${scenario.count} data items found` : "500+ items across 10 categories"}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* ── Search bar ── */}
      <div className="mx-5 mb-2.5 flex items-center gap-3 rounded-xl border border-white/[0.12] bg-white/[0.04] px-4 py-2.5">
        <Search className="h-4 w-4 shrink-0 text-cyan-400/60" />
        <span className="flex-1 font-mono text-[13px] text-white/80">
          {displayText}
          <motion.span
            className="ml-px inline-block h-[14px] w-[2px] translate-y-[2px] rounded-full bg-cyan-400"
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
          />
        </span>
        <AnimatePresence>
          {showResults && (
            <motion.span
              key={scenarioIdx}
              initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }} transition={{ duration: 0.2 }}
              className="flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[7.5px]"
              style={{ borderColor: scenario.catColor + "50", color: scenario.catColor, backgroundColor: scenario.catColor + "15" }}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: scenario.catColor }} />
              {scenario.category}
              <X className="h-2.5 w-2.5 opacity-60" />
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* ── Results grid ── */}
      <div className="mx-5 mb-3 grid flex-1 grid-cols-2 gap-2 overflow-hidden">
        <AnimatePresence mode="wait">
          {showResults ? (
            scenario.results.map((r, i) => (
              <motion.div
                key={`${scenarioIdx}-${i}`}
                initial={{ opacity: 0, y: 14, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                transition={{ delay: i * 0.075, duration: 0.28, ease: EASE_PREMIUM }}
                className="flex h-full flex-col rounded-xl border border-white/[0.07] bg-white/[0.03] p-2.5"
              >
                {/* Title row */}
                <div className="flex items-start justify-between gap-1">
                  <p className="text-[9px] font-bold leading-snug text-white">
                    <Highlight text={r.title} query={displayText} color={scenario.catColor} />
                  </p>
                  <span className="mt-0.5 shrink-0 rounded-md p-1.5" style={{ backgroundColor: r.color + "22" }}>
                    <r.Icon className="h-2.5 w-2.5" style={{ color: r.color }} />
                  </span>
                </div>

                {/* Badges */}
                <div className="mt-1.5 flex flex-wrap gap-[3px]">
                  <span className={cn(
                    "rounded-full px-1.5 py-[2px] text-[6px] font-bold uppercase tracking-wide",
                    r.status === "AVAILABLE" ? "bg-green-500/15 text-green-400" : "bg-yellow-500/15 text-yellow-400",
                  )}>● {r.status}</span>
                  {r.types.map(t => (
                    <span key={t} className={cn(
                      "rounded-full px-1.5 py-[2px] text-[6px] font-semibold",
                      t === "B2B" ? "bg-blue-500/15 text-blue-300" : "bg-orange-500/15 text-orange-300",
                    )}>{t}</span>
                  ))}
                </div>

                {/* Description */}
                <p className="mt-2 line-clamp-2 text-[7px] leading-[1.5] text-white/30">{r.description}</p>

                {/* OEM chips */}
                <div className="mt-auto flex items-end justify-between gap-1 pt-1.5">
                  <div className="flex flex-wrap gap-[3px]">
                    {r.oems.slice(0, 2).map(oem => (
                      <span key={oem} className="rounded border border-white/[0.08] px-1 py-[1px] font-mono text-[5.5px] uppercase tracking-wide text-white/28">
                        {oem}
                      </span>
                    ))}
                    {r.oems.length > 2 && (
                      <span className="self-center font-mono text-[6px] text-white/20">+{r.oems.length - 2}</span>
                    )}
                  </div>
                  <ShoppingCart className="h-2.5 w-2.5 shrink-0 text-white/18" />
                </div>
              </motion.div>
            ))
          ) : (
            /* Skeleton placeholder while typing */
            [0, 1, 2, 3].map(i => (
              <motion.div
                key={`sk-${i}`}
                className="rounded-xl border border-white/[0.04] bg-white/[0.015] p-2.5"
                animate={{ opacity: [0.3, 0.55, 0.3] }}
                transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.18, ease: "easeInOut" }}
              >
                <div className="mb-2 h-2 w-3/4 rounded-full bg-white/[0.08]" />
                <div className="mb-1 h-1.5 w-1/2 rounded-full bg-white/[0.05]" />
                <div className="mt-3 h-1.5 w-full rounded-full bg-white/[0.04]" />
                <div className="mt-1 h-1.5 w-2/3 rounded-full bg-white/[0.04]" />
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* ── Footer ── */}
      <div className="shrink-0 mx-5 mb-3 flex items-center">
        <span className="font-mono text-[7px] text-white/18">
          fuzzy-search · 10 categories · 500+ data items
        </span>
        <span className="ml-auto font-mono text-[7px] text-cyan-300/28">
          CARUSO B2B Marketplace API v3.1
        </span>
      </div>
    </div>
  );
}
