import { motion, AnimatePresence, useInView } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Zap, Wrench, Settings, Shield, Smartphone, Navigation, MapPin,
  Search, X, ZoomIn, ZoomOut, Eye, EyeOff, ChevronLeft, ExternalLink,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { EASE_PREMIUM } from "../../lib/motion";

interface PinDef {
  top: string; left: string;
  color: string; label: string;
  Icon: LucideIcon; delay: number;
  quest?: boolean; floatDuration?: number;
  count: number; items: string[];
}

const PINS: PinDef[] = [
  {
    top: "19%", left: "36%", color: "#f43f5e", label: "Charging & EV",
    Icon: Zap, delay: 0.10, quest: true, floatDuration: 2.6, count: 34,
    items: ["AC Charging Session Data", "DC Fast Charge Events", "State of Charge (SoC)",
            "Est. Charging Completion Time", "Charging Cost per Session", "Wallbox Communication"],
  },
  {
    top: "41%", left: "27%", color: "#4ade80", label: "Powertrain",
    Icon: Wrench, delay: 0.25, floatDuration: 3.0, count: 28,
    items: ["Engine RPM Telemetry", "Torque Output", "Gear State", "Motor Temperature", "Drive Mode Status"],
  },
  {
    top: "47%", left: "14%", color: "#22d3ee", label: "Maintenance",
    Icon: Settings, delay: 0.38, floatDuration: 2.8, count: 19,
    items: ["OBD Fault Codes", "Service Interval Data", "Oil Level Status", "Brake Pad Wear", "Tyre Pressure"],
  },
  {
    top: "33%", left: "58%", color: "#60a5fa", label: "Safety",
    Icon: Shield, delay: 0.52, quest: true, floatDuration: 2.5, count: 41,
    items: ["Collision Events", "ADAS Status", "Lane Keep Assist", "Emergency Call Data",
            "Airbag Deployment Log", "Seatbelt Status"],
  },
  {
    top: "46%", left: "69%", color: "#818cf8", label: "Connectivity",
    Icon: Smartphone, delay: 0.65, quest: true, floatDuration: 3.2, count: 23,
    items: ["OTA Update Status", "Remote Unlock Events", "Connected App Events", "Wi-Fi Status"],
  },
  {
    top: "58%", left: "44%", color: "#a855f7", label: "Trip & Driving",
    Icon: Navigation, delay: 0.78, floatDuration: 2.9, count: 57,
    items: ["Trip Summary", "Eco Score", "Speed Events", "Driving Behavior Index",
            "Route Efficiency", "Idle Time Data"],
  },
  {
    top: "67%", left: "56%", color: "#ec4899", label: "Location",
    Icon: MapPin, delay: 0.90, quest: true, floatDuration: 2.7, count: 31,
    items: ["Real-time Position", "Geofence Events", "Navigation State", "Parking Location", "POI Nearby"],
  },
];

const QUEST_LIST = [
  { label: "Fleet in Trouble",   done: 3, total: 6, color: "#60a5fa" },
  { label: "EV Range Predictor", done: 5, total: 6, color: "#f43f5e" },
  { label: "Fuel Anomaly Scan",  done: 2, total: 8, color: "#4ade80" },
  { label: "OTA Update Tracker", done: 4, total: 6, color: "#818cf8" },
];

const DISTRICTS = [
  { name: "Charging & EV",     color: "#f43f5e" },
  { name: "Battery & Energy",  color: "#fb923c" },
  { name: "Powertrain",        color: "#4ade80" },
  { name: "Safety",            color: "#60a5fa" },
  { name: "Trip & Driving",    color: "#a855f7" },
  { name: "Location",          color: "#ec4899" },
  { name: "Maintenance",       color: "#22d3ee" },
  { name: "Connectivity",      color: "#818cf8" },
  { name: "Body & Comfort",    color: "#34d399" },
  { name: "Fuel & Combustion", color: "#facc15" },
];

// Quest trail through quest pins
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

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

export function MapPreview() {
  const ref        = useRef<HTMLDivElement>(null);
  const mapRef     = useRef<HTMLDivElement>(null);
  const inView     = useInView(ref, { once: true, margin: "-60px 0px" });

  const [zoom,          setZoom]          = useState(1);
  const [pan,           setPan]           = useState({ x: 0, y: 0 });
  const [selected,      setSelected]      = useState<string | null>(null);
  const [search,        setSearch]        = useState("");
  const [hiddenCats,    setHiddenCats]    = useState<Set<string>>(new Set());
  const [greyUnassigned, setGreyUnassigned] = useState(false);
  const [hoveredPin,    setHoveredPin]    = useState<string | null>(null);
  const [isDragging,    setIsDragging]    = useState(false);

  const dragStart  = useRef<{ x: number; y: number } | null>(null);
  const panAtStart = useRef({ x: 0, y: 0 });
  const didDrag    = useRef(false);

  // ── Ctrl + scroll to zoom toward cursor ──
  useEffect(() => {
    const el = mapRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => {
      if (!e.ctrlKey) return;
      e.preventDefault();
      const factor = e.deltaY > 0 ? 0.9 : 1.1;
      const rect = el.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      setZoom(z => {
        const next = clamp(z * factor, 0.25, 2);
        const ratio = next / z;
        setPan(p => ({ x: mx - ratio * (mx - p.x), y: my - ratio * (my - p.y) }));
        return next;
      });
    };
    el.addEventListener("wheel", handler, { passive: false });
    return () => el.removeEventListener("wheel", handler);
  }, []);

  // ── Pan drag ──
  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    dragStart.current  = { x: e.clientX, y: e.clientY };
    panAtStart.current = pan;
    didDrag.current    = false;
    setIsDragging(true);
  }, [pan]);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragStart.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    if (!didDrag.current && Math.hypot(dx, dy) > 4) didDrag.current = true;
    if (didDrag.current) setPan({ x: panAtStart.current.x + dx, y: panAtStart.current.y + dy });
  }, []);

  const onPointerUp = useCallback(() => {
    dragStart.current = null;
    setIsDragging(false);
  }, []);

  // ── Auto-center on search ──
  useEffect(() => {
    const q = search.trim().toLowerCase();
    if (!q) return;
    const match = PINS.find(p => p.label.toLowerCase().includes(q));
    if (!match || !mapRef.current) return;
    const { width, height } = mapRef.current.getBoundingClientRect();
    const px = parseFloat(match.left) / 100 * width;
    const py = parseFloat(match.top)  / 100 * height;
    setPan({ x: width / 2 - px * zoom, y: height / 2 - py * zoom });
  }, [search, zoom]);

  const zoomBy = (f: number) => setZoom(z => clamp(+(z * f).toFixed(3), 0.25, 2));
  const toggleCat = (label: string) =>
    setHiddenCats(s => { const n = new Set(s); n.has(label) ? n.delete(label) : n.add(label); return n; });

  const searchLo    = search.trim().toLowerCase();
  const searchMatch = searchLo ? (PINS.find(p => p.label.toLowerCase().includes(searchLo))?.label ?? null) : null;
  const selectedPin = selected ? PINS.find(p => p.label === selected) ?? null : null;

  return (
    <div ref={ref} className="absolute inset-0 flex overflow-hidden text-white">

      {/* ── Interactive map ── */}
      <div
        ref={mapRef}
        className={cn("relative min-w-0 flex-1 overflow-hidden select-none",
          isDragging ? "cursor-grabbing" : "cursor-grab")}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        {/* Pan/zoom inner */}
        <div
          className="absolute inset-0 origin-top-left will-change-transform"
          style={{ transform: `translate(${pan.x}px,${pan.y}px) scale(${zoom})` }}
        >
          <img src={`${import.meta.env.BASE_URL}journey-map.jpg`} alt="CARUSO Map" draggable={false}
            className="h-full w-full object-cover object-center"
            style={{ filter: "brightness(0.84) saturate(0.88)" }} />

          {/* Vignette */}
          <div className="pointer-events-none absolute inset-0" style={{
            background: "radial-gradient(ellipse at 50% 45%, transparent 46%, rgba(2,3,10,0.65) 100%)",
          }} />

          {/* Quest trail */}
          <svg className="pointer-events-none absolute inset-0 h-full w-full"
            viewBox="0 0 100 100" preserveAspectRatio="none">
            <motion.path d={trailD} fill="none" stroke="#22d3ee" strokeWidth={1.4}
              strokeOpacity={0.22} vectorEffect="non-scaling-stroke"
              initial={{ pathLength: 0 }}
              animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
              transition={{ duration: 1.4, delay: 1.5, ease: "easeInOut" }} />
            <motion.path d={trailD} fill="none" stroke="#22d3ee" strokeWidth={0.45}
              strokeDasharray="2 1.5" strokeLinecap="round" vectorEffect="non-scaling-stroke"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={inView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
              transition={{ duration: 1.4, delay: 1.5, ease: "easeInOut" }} />
            {inView && (
              <motion.path d={trailD} fill="none" stroke="#22d3ee" strokeWidth={0.45}
                strokeDasharray="2 1.5" strokeLinecap="round" vectorEffect="non-scaling-stroke"
                initial={{ strokeDashoffset: 0, opacity: 0 }}
                animate={{ strokeDashoffset: -3.5, opacity: 1 }}
                transition={{
                  strokeDashoffset: { duration: 0.85, repeat: Infinity, ease: "linear" },
                  opacity: { duration: 0.01, delay: 2.9 },
                }} />
            )}
          </svg>

          {/* Category pins */}
          {PINS.map(pin => {
            const { Icon } = pin;
            const hidden   = hiddenCats.has(pin.label);
            const searchMiss = searchLo && pin.label !== searchMatch;
            const greyed   = hidden || !!searchMiss || (greyUnassigned && !pin.quest);
            const active   = selected === pin.label;
            const hovered  = hoveredPin === pin.label;

            return (
              <motion.div
                key={pin.label}
                className="absolute -translate-x-1/2 -translate-y-full"
                style={{ top: pin.top, left: pin.left }}
                initial={{ opacity: 0, scale: 0.2, y: 20 }}
                animate={inView
                  ? { opacity: greyed ? 0.18 : 1, scale: 1, y: 0 }
                  : { opacity: 0, scale: 0.2, y: 20 }}
                transition={{ delay: pin.delay, duration: 0.42, ease: EASE_PREMIUM }}
                /* Stop pointerdown from starting a map drag when clicking a pin */
                onPointerDown={e => e.stopPropagation()}
                onPointerEnter={() => setHoveredPin(pin.label)}
                onPointerLeave={() => setHoveredPin(null)}
                onClick={() => !greyed && setSelected(s => s === pin.label ? null : pin.label)}
              >
                <motion.div
                  animate={inView && !isDragging ? { y: [0, -5, 0] } : { y: 0 }}
                  transition={{
                    delay: pin.delay + 0.55, duration: pin.floatDuration ?? 2.8,
                    repeat: Infinity, ease: "easeInOut",
                  }}
                >
                  <div
                    className="relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-2 transition-[transform,box-shadow,border-color] duration-150"
                    style={{
                      backgroundColor: pin.color,
                      borderColor: active ? "white" : hovered ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.35)",
                      boxShadow: active
                        ? `0 0 0 3px white, 0 0 28px ${pin.color}`
                        : hovered
                        ? `0 0 22px ${pin.color}cc, 0 3px 10px rgba(0,0,0,0.5)`
                        : `0 0 16px ${pin.color}88, 0 3px 8px rgba(0,0,0,0.45)`,
                      transform: hovered || active ? "scale(1.22)" : "scale(1)",
                    }}
                  >
                    <Icon className="h-4 w-4 text-white drop-shadow" />
                    <motion.span className="pointer-events-none absolute inset-0 rounded-full"
                      style={{ border: `2px solid ${pin.color}` }}
                      animate={{ scale: [1, 1.9], opacity: [0.55, 0] }}
                      transition={{ duration: 2.2, repeat: Infinity, delay: pin.delay + 0.9, ease: "easeOut" }} />
                  </div>
                  <div className="mx-auto h-2.5 w-[2px] rounded-b-full"
                    style={{ backgroundColor: pin.color, opacity: 0.75 }} />
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* ── Fixed overlays (not affected by pan/zoom) ── */}

        {/* Search */}
        <div className="absolute left-2 right-2 top-2 z-10 flex gap-1.5">
          <div className="relative flex-1" onPointerDown={e => e.stopPropagation()}>
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-white/30" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search districts…"
              className="w-full rounded-lg border border-white/10 bg-black/55 py-1.5 pl-7 pr-7 font-mono text-[9px] text-white placeholder-white/25 outline-none backdrop-blur-md focus:border-cyan-400/50"
            />
            {search && (
              <button onClick={() => setSearch("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white/35 hover:text-white/70">
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>

        {/* Category filter pills */}
        <div className="absolute left-2 right-2 top-10 z-10 flex flex-wrap gap-1"
          onPointerDown={e => e.stopPropagation()}>
          {PINS.map(p => {
            const off = hiddenCats.has(p.label);
            return (
              <button key={p.label} onClick={() => toggleCat(p.label)}
                className={cn(
                  "flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[7px] font-semibold transition-all duration-150",
                  off ? "border-white/8 bg-black/30 text-white/22 line-through"
                     : "border-white/15 bg-black/45 backdrop-blur-sm",
                )}
                style={!off ? { borderColor: p.color + "55", color: p.color } : {}}
              >
                <span className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: off ? "rgba(255,255,255,0.2)" : p.color }} />
                {p.label}
              </button>
            );
          })}
        </div>

        {/* Bottom bar: zoom + grey toggle */}
        <div className="absolute bottom-2 left-2 right-2 z-10 flex items-center justify-between"
          onPointerDown={e => e.stopPropagation()}>
          <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-black/55 px-2 py-1 backdrop-blur-md">
            <button onClick={() => zoomBy(0.8)} className="text-white/45 hover:text-white transition-colors">
              <ZoomOut className="h-3 w-3" />
            </button>
            <span className="w-9 text-center font-mono text-[8px] text-white/45">
              {Math.round(zoom * 100)}%
            </span>
            <button onClick={() => zoomBy(1.25)} className="text-white/45 hover:text-white transition-colors">
              <ZoomIn className="h-3 w-3" />
            </button>
          </div>

          <button
            onClick={() => setGreyUnassigned(g => !g)}
            className={cn(
              "flex items-center gap-1.5 rounded-lg border px-2 py-1 font-mono text-[8px] backdrop-blur-md transition-all duration-200",
              greyUnassigned
                ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-300"
                : "border-white/10 bg-black/55 text-white/38 hover:text-white/60",
            )}
          >
            {greyUnassigned ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
            Grey unassigned
          </button>
        </div>
      </div>

      {/* ── Side panel ── */}
      <div className="flex w-[200px] shrink-0 flex-col overflow-hidden border-l border-white/[0.06] bg-white/[0.018]">
        <AnimatePresence mode="wait">

          {/* Tile detail */}
          {selectedPin ? (
            <motion.div key="detail" className="flex h-full flex-col"
              initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }} transition={{ duration: 0.2, ease: EASE_PREMIUM }}>

              <div className="shrink-0 border-b border-white/[0.06] px-3.5 py-2.5">
                <button onClick={() => setSelected(null)}
                  className="mb-2 flex items-center gap-0.5 font-mono text-[7px] text-white/30 transition-colors hover:text-white/60">
                  <ChevronLeft className="h-3 w-3" /> Back to overview
                </button>
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                    style={{ backgroundColor: selectedPin.color + "25", boxShadow: `0 0 14px ${selectedPin.color}55` }}>
                    <selectedPin.Icon className="h-4 w-4" style={{ color: selectedPin.color }} />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold leading-snug text-white">{selectedPin.label}</p>
                    <p className="font-mono text-[7.5px] text-white/35">{selectedPin.count} data items</p>
                  </div>
                </div>
              </div>

              <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-3.5 py-2.5">
                <p className="mb-2 shrink-0 font-mono text-[7px] uppercase tracking-widest text-white/28">
                  Data Points
                </p>
                <div className="flex flex-col gap-1.5">
                  {selectedPin.items.map((item, i) => (
                    <motion.div key={item}
                      initial={{ opacity: 0, x: 6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.045, duration: 0.18, ease: EASE_PREMIUM }}
                      className="group flex cursor-pointer items-center justify-between gap-1 rounded-lg border border-white/[0.05] bg-white/[0.03] px-2.5 py-1.5 transition-all hover:border-white/12 hover:bg-white/[0.07]"
                    >
                      <span className="truncate text-[8px] font-medium text-white/60 transition-colors group-hover:text-white/90">
                        {item}
                      </span>
                      <ExternalLink className="h-2.5 w-2.5 shrink-0 text-white/18 transition-colors group-hover:text-cyan-400" />
                    </motion.div>
                  ))}
                </div>
                <p className="mt-3 font-mono text-[7px] text-white/20">
                  → Opens pre-filtered Product Catalog
                </p>
              </div>
            </motion.div>

          ) : (
            /* Default view */
            <motion.div key="default" className="flex h-full flex-col"
              initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2, ease: EASE_PREMIUM }}>

              <div className="shrink-0 border-b border-white/[0.06] px-3.5 py-2.5">
                <p className="text-[13px] font-bold tracking-tight text-cyan-300">Map Explorer</p>
                <p className="mt-0.5 flex items-center gap-1.5 font-mono text-[8px] text-white/30">
                  <span className="relative flex h-[7px] w-[7px]">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-60" />
                    <span className="relative inline-flex h-[7px] w-[7px] rounded-full bg-cyan-400" />
                  </span>
                  4 active quests
                </p>
              </div>

              <div className="shrink-0 space-y-3 border-b border-white/[0.06] px-3.5 py-3">
                <p className="font-mono text-[8px] uppercase tracking-widest text-white/30">Active Quests</p>
                {QUEST_LIST.map((q, i) => (
                  <motion.div key={q.label}
                    initial={{ opacity: 0, x: 8 }}
                    animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 8 }}
                    transition={{ delay: 1.9 + i * 0.14, duration: 0.28, ease: EASE_PREMIUM }}>
                    <div className="mb-[5px] flex items-center justify-between">
                      <span className="truncate text-[8.5px] font-semibold text-white/70">{q.label}</span>
                      <span className="ml-1 shrink-0 font-mono text-[7px] text-white/35">{q.done}/{q.total}</span>
                    </div>
                    <div className="h-[3px] overflow-hidden rounded-full bg-white/[0.07]">
                      <motion.div className="h-full rounded-full" style={{ backgroundColor: q.color }}
                        initial={{ width: 0 }}
                        animate={inView ? { width: `${(q.done / q.total) * 100}%` } : { width: 0 }}
                        transition={{ delay: 2.1 + i * 0.14, duration: 0.5, ease: EASE_PREMIUM }} />
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-3.5 py-2.5">
                <p className="mb-2 shrink-0 font-mono text-[8px] uppercase tracking-widest text-white/30">Districts</p>
                <div className="flex flex-col gap-[5px] overflow-hidden">
                  {DISTRICTS.map(({ name, color }) => (
                    <div key={name} className="flex items-center gap-1.5">
                      <div className="h-[7px] w-[7px] shrink-0 rounded-sm" style={{ backgroundColor: color }} />
                      <span className="truncate text-[8px] text-white/40">{name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
