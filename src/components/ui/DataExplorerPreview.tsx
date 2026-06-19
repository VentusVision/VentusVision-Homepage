import { motion, AnimatePresence, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { EASE_PREMIUM } from "../../lib/motion";
import { cn } from "../../lib/utils";

interface Bar { label: string; pct: number }
interface Dataset { category: string; count: number; catIdx: number; bars: Bar[] }

// One distinct color per bar slot (0-5), stays consistent across dataset switches
const BAR_COLORS = ["#f43f5e", "#fb923c", "#facc15", "#4ade80", "#60a5fa", "#a855f7"];

const DATASETS: Dataset[] = [
  {
    category: "Charging & EV", count: 63, catIdx: 0,
    bars: [
      { label: "Renault", pct: 9.5  }, { label: "Tesla",   pct: 34.9 },
      { label: "Kia",     pct: 7.9  }, { label: "Ford",    pct: 31.7 },
      { label: "BMW",     pct: 17.5 }, { label: "Porsche", pct: 1.6  },
    ],
  },
  {
    category: "Battery & Energy", count: 48, catIdx: 1,
    bars: [
      { label: "Kia",     pct: 8.2  }, { label: "Tesla",   pct: 42.3 },
      { label: "Volvo",   pct: 2.0  }, { label: "BMW",     pct: 24.1 },
      { label: "Ford",    pct: 18.6 }, { label: "Renault", pct: 4.8  },
    ],
  },
  {
    category: "Safety & Incidents", count: 91, catIdx: 5,
    bars: [
      { label: "Ford",   pct: 19.1 }, { label: "BMW",    pct: 28.5 },
      { label: "Tesla",  pct: 4.2  }, { label: "Audi",   pct: 22.3 },
      { label: "Toyota", pct: 14.7 }, { label: "VW",     pct: 11.2 },
    ],
  },
  {
    category: "Trip & Driving Behavior", count: 57, catIdx: 6,
    bars: [
      { label: "Toyota",   pct: 8.8  }, { label: "BMW",      pct: 31.6 },
      { label: "VW",       pct: 1.7  }, { label: "Mercedes", pct: 26.3 },
      { label: "Audi",     pct: 19.3 }, { label: "Ford",     pct: 12.3 },
    ],
  },
];

const CATEGORIES = [
  { label: "Charging & EV",           cls: "bg-rose-500"   },
  { label: "Battery & Energy",        cls: "bg-orange-400" },
  { label: "Powertrain & Engine",     cls: "bg-yellow-400" },
  { label: "Fuel & Combustion",       cls: "bg-green-500"  },
  { label: "Maintenance & Diag.",     cls: "bg-teal-500"   },
  { label: "Safety & Incidents",      cls: "bg-blue-400"   },
  { label: "Trip & Driving Behavior", cls: "bg-purple-400" },
  { label: "Location & Navigation",   cls: "bg-pink-400"   },
  { label: "Body, Access & Comfort",  cls: "bg-cyan-500"   },
  { label: "Connectivity & Remote",   cls: "bg-violet-400" },
];

const CHANNELS = ["All", "B2B", "B2C"] as const;
const STATUSES = ["All", "Available", "Draft"] as const;
const Y_TICKS  = [0, 20, 40, 60, 80, 100];

export function DataExplorerPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px 0px" });

  const [dataIdx,    setDataIdx]    = useState(0);
  const [tipIdx,     setTipIdx]     = useState(0);
  const [channelIdx, setChannelIdx] = useState(0);
  const [statusIdx,  setStatusIdx]  = useState(0);

  useEffect(() => {
    if (!inView) return;
    const d = setInterval(() => setDataIdx(i    => (i + 1) % DATASETS.length), 3600);
    const t = setInterval(() => setTipIdx(i     => (i + 1) % 6),               1300);
    const c = setInterval(() => setChannelIdx(i => (i + 1) % CHANNELS.length), 2700);
    const s = setInterval(() => setStatusIdx(i  => (i + 1) % STATUSES.length), 4200);
    return () => { clearInterval(d); clearInterval(t); clearInterval(c); clearInterval(s); };
  }, [inView]);

  const dataset = DATASETS[dataIdx];
  const maxPct  = Math.max(...dataset.bars.map(b => b.pct));

  return (
    <div ref={ref} className="absolute inset-0 flex overflow-hidden text-white">

      {/* ── Chart area ── */}
      <div className="flex min-w-0 flex-1 flex-col px-5 pb-4 pt-3">

        {/* Status bar */}
        <div className="mb-3 flex shrink-0 items-center gap-2">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
          </span>
          <span className="truncate font-mono text-[9px] text-white/35">
            <motion.span key={`cnt-${dataIdx}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {dataset.count}
            </motion.span>
            {" category-relevant items · OEM distribution for "}
            <motion.span key={`cat-${dataIdx}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-white/65">
              {dataset.category}
            </motion.span>
          </span>
        </div>

        {/* Plot area — flex-1 so it fills remaining height */}
        <div className="relative min-h-0 flex-1">

          {/* Y-axis labels + horizontal grid lines */}
          {Y_TICKS.map(tick => (
            <div
              key={tick}
              className="pointer-events-none absolute left-0 right-0 flex items-center"
              style={{ bottom: `calc(${tick}% + 20px)` }}
            >
              <span className="mr-2 w-7 shrink-0 text-right font-mono text-[8px] leading-none text-white/22">
                {tick}%
              </span>
              <div className="flex-1 border-t border-white/[0.07]" />
            </div>
          ))}

          {/* Bar columns
              ── The flex container spans from top:0 to bottom:20px (room for x-labels).
              ── items-stretch (default) makes each column fill the full height,
                 giving percentage-height children a definite reference. ── */}
          <div
            className="absolute flex gap-4"
            style={{ left: 36, right: 0, top: 0, bottom: 20 }}
          >
            {dataset.bars.map((bar, i) => {
              const heightPct = (bar.pct / maxPct) * 88;
              const isTip     = inView && tipIdx === i;
              const count     = Math.round(bar.pct / 100 * dataset.count);
              const color     = BAR_COLORS[i];

              return (
                /* relative + h-full so child % heights resolve against column height */
                <div key={i} className="relative flex-1">

                  {/* Tooltip */}
                  <AnimatePresence>
                    {isTip && (
                      <motion.div
                        key="tip"
                        initial={{ opacity: 0, y: 6, scale: 0.88 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.88 }}
                        transition={{ duration: 0.18 }}
                        className="absolute z-10 -translate-x-1/2 rounded-md border border-white/10 bg-white/[0.1] px-2.5 py-1.5 backdrop-blur-md"
                        style={{ bottom: `calc(${heightPct}% + 12px)`, left: "50%" }}
                      >
                        <p className="whitespace-nowrap font-mono text-[9px] font-semibold text-white">{count} items</p>
                        <p className="font-mono text-[9px] text-white/50">{bar.pct}%</p>
                        <div className="absolute -bottom-[5px] left-1/2 h-[9px] w-[9px] -translate-x-1/2 rotate-45 border-b border-r border-white/10 bg-white/[0.1]" />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Pct label above bar */}
                  {!isTip && (
                    <motion.span
                      key={`lbl-${dataIdx}-${i}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: inView ? 1 : 0 }}
                      transition={{ duration: 0.25, delay: 0.55 + i * 0.07 }}
                      className="absolute -translate-x-1/2 font-mono text-[8px] tabular-nums text-white/35"
                      style={{ bottom: `calc(${heightPct}% + 4px)`, left: "50%" }}
                    >
                      {bar.pct}%
                    </motion.span>
                  )}

                  {/* Bar — anchored at bottom, grows upward, colored per index */}
                  <motion.div
                    key={`bar-${dataIdx}-${i}`}
                    className="absolute bottom-0 rounded-t-[3px]"
                    style={{
                      left: "18%",
                      right: "18%",
                      backgroundColor: color,
                      opacity: isTip ? 1 : 0.75,
                      boxShadow: isTip ? `0 0 18px ${color}80` : "none",
                    }}
                    initial={{ height: 0 }}
                    animate={{ height: inView ? `${heightPct}%` : 0 }}
                    transition={{ duration: 0.72, ease: EASE_PREMIUM, delay: i * 0.07 }}
                  />
                </div>
              );
            })}
          </div>

          {/* X-axis labels */}
          <div
            className="absolute flex gap-4"
            style={{ left: 36, right: 0, bottom: 0, height: 18 }}
          >
            {dataset.bars.map((bar, i) => (
              <motion.span
                key={`xl-${dataIdx}-${i}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: inView ? 1 : 0 }}
                transition={{ duration: 0.2, delay: 0.1 + i * 0.07 }}
                className="flex-1 truncate text-center font-mono text-[8px] text-white/32"
              >
                {bar.label}
              </motion.span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right sidebar — colored category pills, same style, bigger ── */}
      <div className="flex w-[190px] shrink-0 flex-col overflow-hidden border-l border-white/[0.06] bg-white/[0.018]">

        {/* Header */}
        <div className="shrink-0 border-b border-white/[0.06] px-3.5 py-2.5">
          <p className="text-[13px] font-bold tracking-tight text-cyan-300">CARUSO Explorer</p>
        </div>

        {/* Filters */}
        <div className="shrink-0 space-y-3 border-b border-white/[0.06] px-3.5 py-3">
          {/* Channel */}
          <div>
            <p className="mb-1.5 font-mono text-[8px] uppercase tracking-widest text-white/30">Channel</p>
            <div className="flex gap-1.5">
              {CHANNELS.map((ch, i) => (
                <motion.span
                  key={ch}
                  animate={{
                    backgroundColor: channelIdx === i ? "rgba(255,255,255,0.14)" : "transparent",
                    color:           channelIdx === i ? "rgba(255,255,255,0.9)"  : "rgba(255,255,255,0.32)",
                  }}
                  transition={{ duration: 0.28 }}
                  className="cursor-default rounded-full border border-white/[0.09] px-2.5 py-1 font-mono text-[8px]"
                >
                  {ch}
                </motion.span>
              ))}
            </div>
          </div>

          {/* Status */}
          <div>
            <p className="mb-1.5 font-mono text-[8px] uppercase tracking-widest text-white/30">Status</p>
            <div className="flex gap-1.5">
              {STATUSES.map((st, i) => (
                <motion.span
                  key={st}
                  animate={{
                    backgroundColor: statusIdx === i ? "rgba(255,255,255,0.14)" : "transparent",
                    color:           statusIdx === i ? "rgba(255,255,255,0.9)"  : "rgba(255,255,255,0.32)",
                  }}
                  transition={{ duration: 0.28 }}
                  className="cursor-default rounded-full border border-white/[0.09] px-2 py-1 font-mono text-[8px]"
                >
                  {st}
                </motion.span>
              ))}
            </div>
          </div>
        </div>

        {/* Categories — full-width colored pills, bigger */}
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-3.5 py-2.5">
          <p className="mb-2 shrink-0 font-mono text-[8px] uppercase tracking-widest text-white/30">Categories</p>
          <div className="flex flex-col gap-[5px] overflow-hidden">
            {CATEGORIES.map((cat, i) => {
              const isActive = i === dataset.catIdx;
              return (
                <motion.span
                  key={cat.label}
                  animate={{ opacity: isActive ? 1 : 0.38 }}
                  transition={{ duration: 0.35 }}
                  className={cn(
                    "inline-flex shrink-0 items-center truncate rounded-full px-3 py-[5px] text-[9px] font-semibold text-white",
                    cat.cls,
                    isActive && "ring-1 ring-white/25 ring-offset-[1.5px] ring-offset-[#02030a]",
                  )}
                >
                  {cat.label}
                </motion.span>
              );
            })}
          </div>
        </div>

        {/* Wizard hint */}
        <div className="shrink-0 border-t border-white/[0.06] px-3.5 py-2">
          <div className="flex items-center gap-2">
            {[0, 1, 2].map(s => (
              <motion.span
                key={s}
                className="h-[5px] w-[5px] rounded-full bg-cyan-400"
                animate={{ opacity: [0.25, 1, 0.25] }}
                transition={{ duration: 1.8, repeat: Infinity, delay: s * 0.45 }}
              />
            ))}
            <span className="font-mono text-[8px] text-white/30">Highlights Wizard</span>
          </div>
        </div>
      </div>
    </div>
  );
}
