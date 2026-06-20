import {
  motion, AnimatePresence, useInView,
  useMotionValue, useTransform, useMotionValueEvent, animate,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Zap, Wrench, Settings, Shield, Smartphone, Navigation, MapPin,
  Search, ZoomIn, ZoomOut, Link,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { EASE_PREMIUM } from "../../lib/motion";

// ─── Map pins ───────────────────────────────────────────────────
interface PinDef {
  top: string; left: string; color: string; label: string;
  Icon: LucideIcon; delay: number; quest?: boolean; floatDuration?: number;
}

const PINS: PinDef[] = [
  { top: "19%", left: "36%", color: "#f43f5e", label: "Charging & EV",  Icon: Zap,         delay: 0.10, quest: true,  floatDuration: 2.6 },
  { top: "41%", left: "27%", color: "#4ade80", label: "Powertrain",     Icon: Wrench,      delay: 0.25,               floatDuration: 3.0 },
  { top: "47%", left: "14%", color: "#22d3ee", label: "Maintenance",    Icon: Settings,    delay: 0.38,               floatDuration: 2.8 },
  { top: "33%", left: "58%", color: "#60a5fa", label: "Safety",         Icon: Shield,      delay: 0.52, quest: true,  floatDuration: 2.5 },
  { top: "46%", left: "69%", color: "#818cf8", label: "Connectivity",   Icon: Smartphone,  delay: 0.65, quest: true,  floatDuration: 3.2 },
  { top: "58%", left: "44%", color: "#a855f7", label: "Trip & Driving", Icon: Navigation,  delay: 0.78,               floatDuration: 2.9 },
  { top: "67%", left: "56%", color: "#ec4899", label: "Location",       Icon: MapPin,      delay: 0.90, quest: true,  floatDuration: 2.7 },
];

// ─── Sidebar data ────────────────────────────────────────────────
const CATS = [
  { label: "Trip & Driving Behavior", color: "#a855f7", pinLabel: "Trip & Driving"  },
  { label: "Safety & Incidents",      color: "#60a5fa", pinLabel: "Safety"           },
  { label: "Maintenance & Diag.",     color: "#22d3ee", pinLabel: "Maintenance"      },
  { label: "Powertrain & Engine",     color: "#4ade80", pinLabel: "Powertrain"       },
  { label: "Fuel & Combustion",       color: "#facc15", pinLabel: null               },
  { label: "Charging & EV",           color: "#f43f5e", pinLabel: "Charging & EV"   },
] as const;

const QUESTS = [
  { label: "Fleet in Trouble",          done: 0, total: 6 },
  { label: "Vehicle Health Inspection", done: 0, total: 3 },
  { label: "Connected Vehicle Network", done: 0, total: 2 },
  { label: "The Future of Energy",      done: 0, total: 3 },
  { label: "Comfort & Assistance Tour", done: 0, total: 2 },
] as const;

const SEARCH_TERMS = ["Safety & Incidents", "Charging & EV", "Fleet in Trouble"];

// Quest trail through quest-marked pins
const QUEST_PINS = PINS.filter(p => p.quest);
const trailD = (() => {
  const pts = QUEST_PINS.map(p => ({ x: parseFloat(p.left), y: parseFloat(p.top) }));
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const p = pts[i - 1], n = pts[i];
    const cx = p.x + (n.x - p.x) * 0.5;
    d += ` C ${cx} ${p.y} ${cx} ${n.y} ${n.x} ${n.y}`;
  }
  return d;
})();

export function MapPreview() {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, margin: "-60px 0px" });

  // ── Zoom motion value: 1.40 (140%) → 1.85 (185%) ──
  const zoomMv      = useMotionValue(1.40);
  const [zoomPct, setZoomPct] = useState(140);
  useMotionValueEvent(zoomMv, "change", (v) => setZoomPct(Math.round(v * 100)));

  // Slider: thumb left position and track fill width
  const sliderLeft  = useTransform(zoomMv, [1.40, 1.85], ["0%", "100%"]);
  const trackFill   = useTransform(zoomMv, [1.40, 1.85], ["0%", "100%"]);

  // Auto-animation state
  const [catIdx,     setCatIdx]     = useState(0);
  const [questIdx,   setQuestIdx]   = useState(0);
  const [greyActive, setGreyActive] = useState(false);
  const [searchText, setSearchText] = useState("");

  // Typewriter for search
  useEffect(() => {
    if (!inView) return;
    let termIdx = 0, charIdx = 0, deleting = false, paused = false;
    let pauseTid: ReturnType<typeof setTimeout>;

    const tid = setInterval(() => {
      if (paused) return;
      const term = SEARCH_TERMS[termIdx];
      if (!deleting) {
        charIdx = Math.min(charIdx + 1, term.length);
        setSearchText(term.slice(0, charIdx));
        if (charIdx === term.length) {
          paused = true;
          pauseTid = setTimeout(() => { paused = false; deleting = true; }, 1400);
        }
      } else {
        charIdx = Math.max(charIdx - 1, 0);
        setSearchText(term.slice(0, charIdx));
        if (charIdx === 0) {
          deleting = false;
          termIdx = (termIdx + 1) % SEARCH_TERMS.length;
        }
      }
    }, 75);

    return () => { clearInterval(tid); clearTimeout(pauseTid); };
  }, [inView]);

  // Auto-cycle category, quest, grey-toggle + zoom
  useEffect(() => {
    if (!inView) return;
    const c = setInterval(() => setCatIdx(i  => (i + 1) % CATS.length),    2400);
    const q = setInterval(() => setQuestIdx(i => (i + 1) % QUESTS.length), 3100);
    const g = setInterval(() => setGreyActive(v => !v),                     7200);

    // Zoom: 140% → 185% → 140% loop — drives the actual map scale
    const zoomCtrl = animate(zoomMv, [1.40, 1.85, 1.40], {
      duration: 10,
      repeat: Infinity,
      ease: "easeInOut",
    });

    return () => { clearInterval(c); clearInterval(q); clearInterval(g); zoomCtrl.stop(); };
  }, [inView, zoomMv]);

  const activeCat = CATS[catIdx];

  function pinOpacity(pin: PinDef) {
    if (greyActive && !pin.quest) return 0.18;
    if (activeCat.pinLabel && pin.label === activeCat.pinLabel) return 1;
    if (activeCat.pinLabel && pin.label !== activeCat.pinLabel) return 0.28;
    return 1;
  }

  return (
    <div ref={ref} className="absolute inset-0 flex overflow-hidden text-fg">

      {/* ── Map ─────────────────────────────────────────────── */}
      <div className="relative min-w-0 flex-1 overflow-hidden" style={{ backgroundColor: "#D4CFBF" }}>
        {/* Single scaled layer — everything zooms together */}
        <motion.div
          className="absolute inset-0"
          style={{ scale: zoomMv, transformOrigin: "center center" }}
        >
          <img
            src={`${import.meta.env.BASE_URL}journey-map.jpg`}
            alt="CARUSO Journey Map" draggable={false}
            className="absolute inset-0 h-full w-full object-cover object-center"
            style={{ filter: "brightness(1.0) saturate(0.88)" }}
          />

          {/* Vignette */}
          <div className="pointer-events-none absolute inset-0" style={{
            background: "radial-gradient(ellipse at 50% 45%, transparent 46%, rgba(15,23,42,0.12) 100%)",
          }} />

          {/* Active category color wash */}
          <AnimatePresence>
            <motion.div
              key={catIdx}
              className="pointer-events-none absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.06 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              style={{ backgroundColor: activeCat.color }}
            />
          </AnimatePresence>

          {/* Quest trail */}
          <svg className="pointer-events-none absolute inset-0 h-full w-full"
            viewBox="0 0 100 100" preserveAspectRatio="none">
            <motion.path d={trailD} fill="none" stroke="#22d3ee" strokeWidth={1.4}
              strokeOpacity={0.2} vectorEffect="non-scaling-stroke"
              initial={{ pathLength: 0 }}
              animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
              transition={{ duration: 1.4, delay: 1.4, ease: "easeInOut" }} />
            <motion.path d={trailD} fill="none" stroke="#22d3ee" strokeWidth={0.45}
              strokeDasharray="2 1.5" strokeLinecap="round" vectorEffect="non-scaling-stroke"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={inView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
              transition={{ duration: 1.4, delay: 1.4, ease: "easeInOut" }} />
            {inView && (
              <motion.path d={trailD} fill="none" stroke="#22d3ee" strokeWidth={0.45}
                strokeDasharray="2 1.5" strokeLinecap="round" vectorEffect="non-scaling-stroke"
                initial={{ strokeDashoffset: 0, opacity: 0 }}
                animate={{ strokeDashoffset: -3.5, opacity: 1 }}
                transition={{
                  strokeDashoffset: { duration: 0.85, repeat: Infinity, ease: "linear" },
                  opacity: { duration: 0.01, delay: 2.8 },
                }} />
            )}
          </svg>

          {/* Pins */}
          {PINS.map(pin => {
            const { Icon } = pin;
            const isActive = activeCat.pinLabel === pin.label;
            return (
              <motion.div
                key={pin.label}
                className="pointer-events-none absolute -translate-x-1/2 -translate-y-full"
                style={{ top: pin.top, left: pin.left }}
                initial={{ opacity: 0, scale: 0.2, y: 20 }}
                animate={inView ? { opacity: pinOpacity(pin), scale: 1, y: 0 } : { opacity: 0, scale: 0.2, y: 20 }}
                transition={{ delay: pin.delay, duration: 0.42, ease: EASE_PREMIUM }}
              >
                <div style={{
                  animation: inView
                    ? `map-float ${pin.floatDuration ?? 2.8}s ease-in-out ${pin.delay + 0.55}s infinite`
                    : "none",
                }}>
                  <div
                    className="relative flex h-9 w-9 items-center justify-center rounded-full border-2"
                    style={{
                      backgroundColor: pin.color,
                      borderColor: isActive ? "white" : "rgba(255,255,255,0.35)",
                      boxShadow: isActive
                        ? `0 0 0 3px white, 0 0 28px ${pin.color}`
                        : `0 0 16px ${pin.color}88, 0 3px 8px rgba(0,0,0,0.45)`,
                      transform: isActive ? "scale(1.25)" : "scale(1)",
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    }}
                  >
                    <Icon className="h-4 w-4 text-white drop-shadow" />
                    <span
                      className="pointer-events-none absolute inset-0 rounded-full"
                      style={{
                        border: `2px solid ${pin.color}`,
                        transformOrigin: "center",
                        animation: inView
                          ? `map-ping 2.2s ease-out ${pin.delay + 0.9}s infinite`
                          : "none",
                      }}
                    />
                  </div>
                  <div className="mx-auto h-2.5 w-[2px] rounded-b-full"
                    style={{ backgroundColor: pin.color, opacity: 0.75 }} />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* ── Sidebar ──────────────────────────────────────────── */}
      <div className="flex w-[290px] shrink-0 flex-col overflow-hidden border-l border-border bg-surface">

        {/* Header */}
        <div className="shrink-0 border-b border-border px-5 py-3.5">
          <div className="flex items-center justify-between">
            <p className="text-[15px] font-bold tracking-tight text-brand">Map Explorer</p>
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand" />
            </span>
          </div>
        </div>

        {/* Search */}
        <div className="shrink-0 border-b border-border px-5 py-3.5">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-fg-subtle">Search</p>
          <div className="flex items-center gap-2 rounded-lg border border-border bg-base px-3 py-2">
            <Search className="h-3.5 w-3.5 shrink-0 text-fg-subtle" />
            <span className="flex-1 font-mono text-[11px] text-fg-muted">
              {searchText}
              <span
                className="inline-block h-[12px] w-[1.5px] translate-y-[1px] bg-brand/70"
                style={{ animation: "cursor-blink 0.55s linear infinite" }}
              />
            </span>
          </div>
        </div>

        {/* Categories */}
        <div className="shrink-0 border-b border-border px-5 py-3.5">
          <p className="mb-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-fg-subtle">Categories</p>
          <div className="flex flex-wrap gap-1.5">
            {CATS.map((cat, i) => {
              const isActive = i === catIdx;
              return (
                <motion.span
                  key={cat.label}
                  animate={{
                    backgroundColor: isActive ? cat.color + "22" : "transparent",
                    borderColor: isActive ? cat.color + "80" : "rgba(15,23,42,0.14)",
                    color: isActive ? cat.color : "rgba(15,23,42,0.45)",
                  }}
                  transition={{ duration: 0.3 }}
                  className="flex cursor-default items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-medium"
                >
                  <span
                    className="h-[6px] w-[6px] rounded-full transition-colors duration-300"
                    style={{ backgroundColor: isActive ? cat.color : "rgba(15,23,42,0.2)" }}
                  />
                  {cat.label}
                </motion.span>
              );
            })}
          </div>

          {/* All / None / Grey Unassigned row */}
          <div className="mt-3 flex items-center gap-1.5">
            {["All", "None"].map(lbl => (
              <span key={lbl}
                className="cursor-default rounded-md border border-border bg-base px-2.5 py-1 font-mono text-[10px] text-fg-subtle">
                {lbl}
              </span>
            ))}
            <motion.span
              animate={{
                backgroundColor: greyActive ? "rgba(37,99,235,0.10)" : "transparent",
                borderColor: greyActive ? "rgba(37,99,235,0.35)" : "rgba(15,23,42,0.12)",
                color: greyActive ? "#2563EB" : "rgba(15,23,42,0.40)",
              }}
              transition={{ duration: 0.35 }}
              className="cursor-default rounded-md border px-2.5 py-1 font-mono text-[10px]"
            >
              Grey Unassigned
            </motion.span>
          </div>
        </div>

        {/* Quests */}
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-5 py-3.5">
          <p className="mb-2.5 shrink-0 font-mono text-[10px] uppercase tracking-[0.18em] text-fg-subtle">Quests</p>
          <div className="flex flex-col gap-1 overflow-hidden">
            {QUESTS.map((q, i) => {
              const isActive = i === questIdx;
              return (
                <motion.div
                  key={q.label}
                  animate={{
                    backgroundColor: isActive ? "rgba(37,99,235,0.06)" : "transparent",
                    borderColor: isActive ? "rgba(37,99,235,0.14)" : "transparent",
                  }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-2.5 rounded-lg border px-3 py-2"
                >
                  <Link className="h-3.5 w-3.5 shrink-0 text-fg-subtle" />
                  <span className={cn(
                    "flex-1 truncate text-[11px] transition-colors duration-300",
                    isActive ? "font-semibold text-fg" : "text-fg-muted",
                  )}>
                    {q.label}
                  </span>
                  <span className="shrink-0 font-mono text-[10px] text-fg-subtle">
                    {q.done}/{q.total}
                  </span>
                  <motion.span
                    animate={{ rotate: isActive ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="shrink-0 text-[10px] text-fg-subtle"
                  >
                    ∨
                  </motion.span>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Zoom bar — thumb and fill reflect actual map scale */}
        <div className="shrink-0 border-t border-border px-5 py-3">
          <div className="flex items-center gap-2.5">
            <ZoomOut className="h-4 w-4 text-fg-subtle" />
            <div className="relative flex-1 h-[3px] rounded-full bg-border">
              {/* dynamic fill */}
              <motion.div
                className="absolute left-0 top-0 h-full rounded-full bg-brand/30"
                style={{ width: trackFill }}
              />
              {/* thumb synced to zoomMv */}
              <motion.div
                className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-border bg-white shadow-card"
                style={{ left: sliderLeft }}
              />
            </div>
            <ZoomIn className="h-4 w-4 text-fg-subtle" />
            <span className="w-10 text-right font-mono text-[10px] tabular-nums text-fg-muted">
              {zoomPct}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
