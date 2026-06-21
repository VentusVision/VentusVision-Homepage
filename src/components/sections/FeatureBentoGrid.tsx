import { motion, AnimatePresence, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  Search, ShoppingCart, Battery, X, ArrowUpDown, Check, Clock,
  SlidersHorizontal, ChevronLeft, Copy,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { EASE_PREMIUM } from "../../lib/motion";
import { VehicleBackground } from "../ui/VehicleBackground";
import { useCatalogFilter, SORT_OPTIONS } from "../../hooks/useCatalogFilter";
import { useAutoDemo } from "../../hooks/useAutoDemo";
import { CATALOG_ITEMS, CATALOG_CATEGORIES, CATALOG_PREVIEW_ITEMS, type DataItem } from "../../data/catalog";

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────

const BENTO_SHADOW = "0 0 0 1px rgba(37,99,235,0.22), 0 1px 3px rgba(15,23,42,0.06), 0 4px 12px rgba(37,99,235,0.10), 0 16px 40px rgba(37,99,235,0.13), 0 48px 100px rgba(37,99,235,0.08), 0 80px 140px rgba(15,23,42,0.06)";
const BENTO_HOVER_SHADOW = "0 0 0 2px rgba(37,99,235,0.50), 0 2px 8px rgba(37,99,235,0.18), 0 12px 36px rgba(37,99,235,0.22), 0 40px 80px rgba(37,99,235,0.14), 0 0 70px rgba(6,182,212,0.13)";

const SEARCH_TERMS = [
  "EV charging range",
  "battery health index",
  "engine rpm telemetry",
  "brake pad wear level",
  "real-time vehicle position",
  "accident call automatic",
];

const TICKER_RAW = [
  "vehicleSpeed · 2m ago",
  "motorTorque · 5m ago",
  "chargingPower · 12m ago",
  "batteryCapacity · 18m ago",
  "odometer · 24m ago",
  "gearState · 31m ago",
];


const CART_ITEMS = [
  { id: 1, title: "Battery Health Index", price: "1.00 EUR" },
  { id: 2, title: "Trip Summary Data", price: "1.00 EUR" },
  { id: 3, title: "OBD-II Diagnostic Codes", price: "1.00 EUR" },
];

// ─────────────────────────────────────────────
// Highlight component
// ─────────────────────────────────────────────

function Highlight({ text, query, on }: { text: string; query: string; on: boolean }) {
  if (!on || !query.trim()) return <>{text}</>;
  const words = query.trim().split(/\s+/).filter(Boolean);
  const escaped = words.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const regex = new RegExp(`(${escaped.join("|")})`, "gi");
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1
          ? <mark key={i} className="rounded bg-brand/15 font-semibold not-italic text-brand">{part}</mark>
          : <span key={i}>{part}</span>
      )}
    </>
  );
}

function LiveTicker() {
  const dup = [...TICKER_RAW, ...TICKER_RAW];
  return (
    <div
      className="relative overflow-hidden border-b border-brand/15"
      style={{
        background: "linear-gradient(90deg, rgba(37,99,235,0.07) 0%, rgba(6,182,212,0.07) 100%)",
      }}
    >
      {/* Left + right fade masks */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-[rgba(37,99,235,0.09)] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-[rgba(6,182,212,0.09)] to-transparent" />

      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        className="flex gap-6 whitespace-nowrap py-2 pl-4"
      >
        {dup.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-2 font-mono text-[12px] font-medium"
          >
            <span
              className="h-1.5 w-1.5 shrink-0 rounded-full"
              style={{
                background: "linear-gradient(135deg, #2563EB, #06B6D4)",
                boxShadow: "0 0 6px rgba(37,99,235,0.55)",
              }}
            />
            <span className="text-brand/70">NEW:</span>
            <span className="text-fg-muted">{item}</span>
            <span className="ml-1 text-[11px] text-fg-subtle opacity-50">·</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}
function ProductCard({
  title, status, type, suppliers, description, Icon, delay, query = "", highlightOn = false,
}: Omit<DataItem, "id" | "category"> & { delay: number; query?: string; highlightOn?: boolean }) {
  const typeLabels = type.split(" + ") as ("B2B" | "B2C")[];
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.34, ease: EASE_PREMIUM }}
      className="flex h-full min-h-full flex-col rounded-xl border border-border bg-base p-5"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-[15px] font-bold leading-snug text-fg">
          <Highlight text={title} query={query} on={highlightOn} />
        </p>
        <span className="mt-0.5 shrink-0 rounded-md bg-brand-subtle p-2">
          <Icon className="h-5 w-5 text-brand" />
        </span>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <span
          className={cn(
            "rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide",
            status === "AVAILABLE" ? "bg-green-500/15 text-green-500" : "bg-yellow-500/15 text-yellow-500",
          )}
        >
          ● {status}
        </span>
        {typeLabels.map((t) => (
          <span
            key={t}
            className={cn(
              "rounded-full px-2.5 py-1 text-[11px] font-semibold",
              t === "B2B" ? "bg-blue-500/15 text-blue-500" : "bg-orange-500/15 text-orange-500",
            )}
          >
            {t}
          </span>
        ))}
      </div>

      <p className="mt-3 line-clamp-4 text-[13px] leading-relaxed text-fg-muted">
        <Highlight text={description} query={query} on={highlightOn} />
      </p>

      <div className="mt-auto flex items-end justify-between gap-1 pt-3">
        <div className="flex flex-wrap gap-1.5">
          {suppliers.slice(0, 2).map((s) => (
            <span key={s} className="rounded border border-border px-2 py-1 font-mono text-[11px] uppercase tracking-wide text-fg-subtle">
              {s}
            </span>
          ))}
        </div>
        <ShoppingCart className="h-5 w-5 shrink-0 text-brand/50" />
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// Card 1 — Product Catalog
// ─────────────────────────────────────────────

export function CatalogPreview({ preview = false }: { preview?: boolean }) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, margin: "-60px" });

  // ── Preview (monitor) mode: cycling animation only ──
  const [, setSearchIdx] = useState(0);
  const [,    setCatIdx]    = useState(0);
  useEffect(() => {
    if (!inView) return;
    const s = setInterval(() => setSearchIdx(i => (i + 1) % SEARCH_TERMS.length), 3600);
    return () => clearInterval(s);
  }, [inView]);
  useEffect(() => {
    if (!inView || !preview) return;
    const c = setInterval(() => setCatIdx(i => (i + 1) % CATALOG_CATEGORIES.length), 2800);
    return () => clearInterval(c);
  }, [inView, preview]);

  // ── Auto-demo filter state (drives real filtering) ──
  const { query, setQuery, debouncedQ, selectedCat, setSelectedCat, sortBy, setSortBy, highlightOn, filtered } =
    useCatalogFilter(CATALOG_ITEMS);

  useAutoDemo(inView, setQuery, setSelectedCat, setSortBy);

  const currentSort = SORT_OPTIONS.find(o => o.value === sortBy)!;

  return (
    <div ref={ref} className="flex h-full flex-col overflow-hidden">
      <LiveTicker />

      {/* ── Search bar ── */}
      <div className="flex shrink-0 items-center gap-3 border-b border-border px-5 py-3.5">
        <Search className="h-5 w-5 shrink-0 text-brand" />

        {/* Both modes: show typed query with blinking cursor */}
        <span className="min-w-0 flex-1 text-[15px] text-fg">
          {query ? (
            <>
              <span>{query}</span>
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.55, repeat: Infinity, repeatType: "reverse" }}
                className="text-brand"
              >|</motion.span>
            </>
          ) : (
            <span className="text-fg-subtle">Search data items…</span>
          )}
        </span>

        <div className="flex shrink-0 items-center gap-1.5">
          <span className="rounded-full border border-border px-3 py-1 text-[12px] text-fg-muted">
            <SlidersHorizontal className="inline h-3.5 w-3.5 mr-1" />Filter
          </span>
          <span className="rounded-full border border-border px-3 py-1 text-[12px] text-fg-muted">CSV</span>
          <span className={cn(
            "rounded-full px-3.5 py-1 text-[12px] font-semibold",
            highlightOn ? "bg-cyan-500/75 text-white" : "border border-border text-fg-muted"
          )}>
            Highlighting
          </span>
        </div>
      </div>

      {preview ? (
        /* Monitor: 3×3 grid — live filtered */
        <div className="min-h-0 flex-1 overflow-hidden px-4 pb-3 pt-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${debouncedQ}-${selectedCat}-${sortBy}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="grid h-full grid-cols-3 grid-rows-3 gap-3"
            >
              {(filtered.length > 0 ? filtered : CATALOG_PREVIEW_ITEMS).slice(0, 9).map((item, i) => (
                <ProductCard
                  key={item.id}
                  {...item}
                  delay={0.01 + i * 0.03}
                  query={debouncedQ}
                  highlightOn={highlightOn}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      ) : (
        <>
          {/* ── Category pills ── */}
          <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-border px-5 py-3">
            <span className="shrink-0 font-mono text-[11px] uppercase tracking-widest text-fg-subtle">
              CATEGORIES:
            </span>
            <div className="flex flex-wrap gap-2">
              <span
                style={{
                  backgroundColor: !selectedCat ? "rgba(37,99,235,0.10)" : "transparent",
                  color:           !selectedCat ? "rgba(37,99,235,1)"    : "rgba(15,23,42,0.35)",
                  borderColor:     !selectedCat ? "rgba(37,99,235,0.30)" : "rgba(15,23,42,0.12)",
                  transition:      "background-color 0.32s ease, color 0.32s ease, border-color 0.32s ease",
                }}
                className="shrink-0 cursor-default rounded-full border px-3 py-1 text-[12px] font-medium"
              >
                All Categories
              </span>

              {CATALOG_CATEGORIES.map((cat, i) => (
                <span key={cat}>
                  {i === 7 && <span className="block w-full" />}
                  <span
                    style={{
                      backgroundColor: selectedCat === cat ? "rgba(37,99,235,0.10)" : "transparent",
                      color:           selectedCat === cat ? "rgba(37,99,235,1)"    : "rgba(15,23,42,0.35)",
                      borderColor:     selectedCat === cat ? "rgba(37,99,235,0.30)" : "rgba(15,23,42,0.12)",
                      transition:      "background-color 0.32s ease, color 0.32s ease, border-color 0.32s ease",
                    }}
                    className="shrink-0 cursor-default rounded-full border px-3 py-1 text-[12px] font-medium"
                  >
                    {cat}
                  </span>
                </span>
              ))}
            </div>
          </div>

          {/* ── Active filter chips ── */}
          <AnimatePresence>
            {(debouncedQ || selectedCat) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex shrink-0 items-center gap-2 overflow-hidden px-5 py-2"
              >
                <span className="text-[11px] text-fg-subtle">● Active:</span>
                {debouncedQ && (
                  <span className="flex items-center gap-1 rounded-full bg-brand-subtle px-2.5 py-0.5 text-[11px] font-semibold text-brand">
                    <Search className="h-3 w-3" />„{debouncedQ}"
                  </span>
                )}
                {selectedCat && (
                  <span className="flex items-center gap-1 rounded-full bg-brand-subtle px-2.5 py-0.5 text-[11px] font-semibold text-brand">
                    {selectedCat}
                  </span>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Result header + sort indicator ── */}
          <div className="flex shrink-0 items-center justify-between px-5 py-3">
            <div className="flex items-center gap-3">
              <AnimatePresence mode="wait">
                <motion.span
                  key={selectedCat ?? "all"}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  transition={{ duration: 0.2 }}
                  className="text-[20px] font-extrabold text-brand"
                >
                  {selectedCat ?? "All Categories"}
                </motion.span>
              </AnimatePresence>
              <AnimatePresence mode="wait">
                <motion.span
                  key={filtered.length}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-full bg-brand-subtle px-3 py-1 text-[12px] font-semibold text-brand"
                >
                  {filtered.length} items
                </motion.span>
              </AnimatePresence>
            </div>
            {/* Sort indicator (read-only, driven by demo) */}
            <motion.div
              key={sortBy}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-1.5 rounded-full border border-border bg-base px-3 py-1.5 text-[12px] font-medium text-fg-muted"
            >
              <ArrowUpDown className="h-3.5 w-3.5" />
              {currentSort.label}
            </motion.div>
          </div>

          {/* ── Results grid ── */}
          <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${debouncedQ}-${selectedCat}-${sortBy}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="grid grid-cols-3 gap-3"
              >
                {filtered.map((item, i) => (
                  <div key={item.id} className="min-h-[240px]">
                    <ProductCard
                      {...item}
                      delay={Math.min(i * 0.025, 0.2)}
                      query={debouncedQ}
                      highlightOn={highlightOn}
                    />
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Card 2 — Item Detail
// ─────────────────────────────────────────────

type OEMChild = { abbr: string; name: string };

// Pure-SVG orbital group — avoids CSS transform conflicts between
// Framer Motion rotation and the translate(-50%,-50%) centering trick.
// Strategy: static SVG `transform="translate(cx,cy)"` moves the coordinate
// origin to the parent OEM center, then Framer Motion only manages `rotate`.
// `transformBox:"fill-box" + transformOrigin:"center"` always rotates around
// the element's own geometric center — no extra offset math needed.
function OEMOrbitSVG({
  abbr, label, cx, cy, orbitR, color, duration, inView, children,
}: {
  abbr: string; label: string; cx: number; cy: number;
  orbitR: number; color: string; duration: number;
  inView: boolean; children: OEMChild[];
}) {
  const PARENT_R = 26;
  const CHILD_R  = 17;
  return (
    <>
      {/* Dashed orbit ring */}
      <circle cx={cx} cy={cy} r={orbitR}
        fill="none" stroke="rgba(147,197,253,0.5)" strokeWidth={1.5} strokeDasharray="3 2" />

      {/* Pulsing glow around parent */}
      <motion.circle cx={cx} cy={cy} r={PARENT_R + 8}
        fill="none" stroke={`${color}28`} strokeWidth={2.5}
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
        animate={inView ? { scale: [1, 1.18, 1], opacity: [0.25, 1, 0.25] } : {}}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Parent OEM circle */}
      <circle cx={cx} cy={cy} r={PARENT_R}
        fill="white" stroke={`${color}35`} strokeWidth={2}
      />
      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle"
        fontSize={11} fontWeight={800} fill={color} fontFamily="Inter,ui-sans-serif">
        {abbr}
      </text>

      {/* Orbital group */}
      <g transform={`translate(${cx},${cy})`}>
        <motion.g
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
          animate={inView ? { rotate: 360 } : { rotate: 0 }}
          transition={{ duration, repeat: Infinity, ease: "linear" }}
        >
          {children.map((child, i) => {
            const ang = (i / children.length) * 2 * Math.PI - Math.PI / 2;
            const x   = Math.cos(ang) * orbitR;
            const y   = Math.sin(ang) * orbitR;
            return (
              <g key={child.abbr}>
                <line x1={0} y1={0} x2={x} y2={y}
                  stroke="rgba(147,197,253,0.35)" strokeWidth={0.8} strokeDasharray="3 2" />
                <motion.g
                  style={{ transformBox: "fill-box", transformOrigin: "center" }}
                  animate={inView ? { rotate: -360 } : { rotate: 0 }}
                  transition={{ duration, repeat: Infinity, ease: "linear" }}
                >
                  <circle cx={x} cy={y} r={CHILD_R}
                    fill="white" stroke="#dbeafe" strokeWidth={1.5} />
                  <text x={x} y={y} textAnchor="middle" dominantBaseline="middle"
                    fontSize={8.5} fontWeight={700} fill="#334155"
                    fontFamily="Inter,ui-sans-serif">
                    {child.abbr}
                  </text>
                </motion.g>
              </g>
            );
          })}
        </motion.g>
      </g>

      {/* Label + B2C badge */}
      <text x={cx} y={cy + orbitR + 17}
        textAnchor="middle" fontSize={10} fontWeight={700} fill="#1e293b"
        fontFamily="Inter,ui-sans-serif">{label}</text>
      <rect x={cx - 14} y={cy + orbitR + 21} width={28} height={13} rx={6.5}
        fill={`${color}18`} />
      <text x={cx} y={cy + orbitR + 30}
        textAnchor="middle" dominantBaseline="middle" fontSize={8} fontWeight={700}
        fill={color} fontFamily="Inter,ui-sans-serif">B2C</text>
    </>
  );
}

function DetailPreview() {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, margin: "-40px" });
  const [tab, setTab] = useState<"attributes" | "schema" | "example">("attributes");

  const ATTRS = [
    { name: "unit",      type: "string" },
    { name: "value",     type: "number" },
    { name: "timestamp", type: "string" },
  ];

  const BMW_CHILDREN:   OEMChild[] = [{ abbr: "RR",  name: "Rolls-Royce" }, { abbr: "MINI", name: "MINI" }];
  const STELL_CHILDREN: OEMChild[] = [{ abbr: "FI",  name: "Fiat" }, { abbr: "OP", name: "Opel" }, { abbr: "JP", name: "Jeep" }, { abbr: "AR", name: "Alfa" }];

  return (
    <div ref={ref} className="flex h-full flex-col overflow-hidden bg-surface text-fg">

      {/* Header bar */}
      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-border bg-base px-4 py-2.5">
        <div className="flex items-center gap-1">
          <ChevronLeft className="h-3 w-3 shrink-0 text-brand" />
          <span className="text-[10px] font-medium text-brand">Data Catalog</span>
          <span className="px-0.5 text-[10px] text-fg-subtle">/</span>
          <span className="flex items-center gap-1.5 text-[10px] font-medium text-fg-muted">
            <Battery className="h-3 w-3 text-brand/60" />
            Battery Care Mode
          </span>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          className="shrink-0 rounded-lg bg-brand px-2.5 py-1 text-[9px] font-bold text-white"
          style={{ boxShadow: "0 3px 8px rgba(37,99,235,.30)" }}
        >
          ▶ Request
        </motion.button>
      </div>

      {/* MANUFACTURERS — flex-1, SVG orbital */}
      <div className="flex min-h-0 flex-1 flex-col border-b border-border px-4 py-2">
        <p className="mb-1 shrink-0 font-mono text-[9px] uppercase tracking-[0.18em] text-fg-subtle">⊞ Manufacturers</p>
        <div className="min-h-0 flex-1">
          {/* Single SVG — both orbital groups share one coordinate system.
              viewBox tuned so each group has breathing room. */}
          <svg viewBox="0 0 290 185" className="h-full w-full" style={{ overflow: "visible" }}>
            <OEMOrbitSVG
              abbr="BMW" label="BMW" color="#1d4ed8"
              cx={70} cy={82} orbitR={52} duration={10}
              inView={inView} children={BMW_CHILDREN}
            />
            <OEMOrbitSVG
              abbr="ST" label="Stellantis" color="#7c3aed"
              cx={215} cy={82} orbitR={58} duration={16}
              inView={inView} children={STELL_CHILDREN}
            />
          </svg>
        </div>
      </div>

      {/* TECHNICAL INFO — static, shrink-0 */}
      <div className="flex shrink-0 flex-col px-4 pb-3 pt-2.5">
        <p className="mb-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-fg-subtle">↻ Technical Info</p>

        {/* Tabs */}
        <div className="mb-2 flex border-b border-border">
          {(["attributes", "schema", "example"] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "pb-1.5 pr-4 text-[11px] font-semibold transition-colors duration-200",
                tab === t ? "border-b-2 border-brand text-brand" : "border-b-2 border-transparent text-fg-subtle",
              )}
            >
              {t === "schema" ? "JSON Schema" : t === "example" ? "JSON Example" : "Attributes"}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {tab === "attributes" && (
            <motion.div key="attributes" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
              <div className="overflow-hidden rounded-xl border border-border">
                <div className="grid grid-cols-[1fr_58px_46px] gap-2 border-b border-border bg-base px-3 py-1.5">
                  {["NAME", "TYPE", "REQ"].map(h => (
                    <span key={h} className="font-mono text-[9px] uppercase tracking-widest text-fg-subtle">{h}</span>
                  ))}
                </div>
                {ATTRS.map((a, i) => (
                  <div key={a.name} className={cn("grid grid-cols-[1fr_58px_46px] items-center gap-2 px-3 py-2", i < ATTRS.length - 1 && "border-b border-border/50")}>
                    <span className="font-mono text-[11px] font-bold text-fg">{a.name}</span>
                    <span className={cn("font-mono text-[11px] font-semibold", a.type === "number" ? "text-orange-500" : "text-blue-500")}>{a.type}</span>
                    <span className="rounded-full bg-green-500/10 px-1.5 py-0.5 text-center font-mono text-[9px] font-bold text-green-600">✓</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

            {tab === "schema" && (
              <motion.div key="schema" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                <div className="overflow-hidden rounded-xl border border-border">
                  {/* Header — matches real CARUSO JSON view */}
                  <div className="flex items-center gap-1.5 border-b border-border bg-[#f8fafc] px-3 py-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                    <span className="font-mono text-[9px] font-semibold text-slate-500">JSON</span>
                    <span className="font-mono text-[9px] text-slate-400">│ 13 lines</span>
                    <Copy className="ml-auto h-2.5 w-2.5 cursor-pointer text-slate-400" />
                  </div>
                  {/* Light-theme code with line numbers */}
                  <div className="bg-white py-1.5">
                    {([
                      [<span className="text-slate-600">{"{"}</span>],
                      [<span className="text-slate-400">{"  "}</span>, <span className="text-teal-600">"type"</span>, <span className="text-slate-500">: </span>, <span className="text-emerald-600">"object"</span>, <span className="text-slate-500">,</span>],
                      [<span className="text-slate-400">{"  "}</span>, <span className="text-teal-600">"title"</span>, <span className="text-slate-500">: </span>, <span className="text-emerald-600">"Battery Care Mode"</span>, <span className="text-slate-500">,</span>],
                      [<span className="text-slate-400">{"  "}</span>, <span className="text-teal-600">"required"</span>, <span className="text-slate-500">: [</span>, <span className="text-emerald-600">"value"</span>, <span className="text-slate-500">, </span>, <span className="text-emerald-600">"unit"</span>, <span className="text-slate-500">, </span>, <span className="text-emerald-600">"timestamp"</span>, <span className="text-slate-500">],</span>],
                      [<span className="text-slate-400">{"  "}</span>, <span className="text-teal-600">"properties"</span>, <span className="text-slate-500">: {"{"}</span>],
                      [<span className="text-slate-400">{"    "}</span>, <span className="text-teal-600">"unit"</span>, <span className="text-slate-500">: {"{"}</span>],
                      [<span className="text-slate-400">{"      "}</span>, <span className="text-teal-600">"type"</span>, <span className="text-slate-500">: </span>, <span className="text-emerald-600">"string"</span>, <span className="text-slate-500">, </span>, <span className="text-teal-600">"enum"</span>, <span className="text-slate-500">: [</span>, <span className="text-emerald-600">"kWh"</span>, <span className="text-slate-500">]</span>],
                      [<span className="text-slate-400">{"    "}</span>, <span className="text-slate-500">{"}, "}</span>, <span className="text-teal-600">"value"</span>, <span className="text-slate-500">{": { "}</span>, <span className="text-teal-600">"type"</span>, <span className="text-slate-500">: </span>, <span className="text-orange-500">&#34;number&#34;</span>, <span className="text-slate-500">{" }"}</span>],
                      [<span className="text-slate-400">{"    "}</span>, <span className="text-teal-600">"timestamp"</span>, <span className="text-slate-500">: {"{"}</span>],
                      [<span className="text-slate-400">{"      "}</span>, <span className="text-teal-600">"type"</span>, <span className="text-slate-500">: </span>, <span className="text-emerald-600">"string"</span>, <span className="text-slate-500">,</span>],
                      [<span className="text-slate-400">{"      "}</span>, <span className="text-teal-600">"format"</span>, <span className="text-slate-500">: </span>, <span className="text-emerald-600">"date-time"</span>],
                      [<span className="text-slate-400">{"    "}</span>, <span className="text-slate-500">{"}"}</span>],
                      [<span className="text-slate-500">{"  } }"}</span>],
                    ] as React.ReactNode[][]).map((parts, i) => (
                      <div key={i} className="flex items-baseline">
                        <span className="w-7 shrink-0 select-none pr-2 text-right font-mono text-[8px] text-slate-300">{i + 1}</span>
                        <span className="font-mono text-[9.5px] leading-[1.6]">{parts}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {tab === "example" && (
              <motion.div key="example" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                <div className="overflow-hidden rounded-xl border border-border">
                  <div className="flex items-center gap-1.5 border-b border-border bg-[#f8fafc] px-3 py-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                    <span className="font-mono text-[9px] font-semibold text-slate-500">JSON</span>
                    <span className="font-mono text-[9px] text-slate-400">│ 5 lines</span>
                    <Copy className="ml-auto h-2.5 w-2.5 cursor-pointer text-slate-400" />
                  </div>
                  <div className="bg-white py-1.5">
                    {([
                      [<span className="text-slate-600">{"{"}</span>],
                      [<span className="text-slate-400">{"  "}</span>, <span className="text-teal-600">"unit"</span>, <span className="text-slate-500">: </span>, <span className="text-emerald-600">"kWh"</span>, <span className="text-slate-500">,</span>],
                      [<span className="text-slate-400">{"  "}</span>, <span className="text-teal-600">"value"</span>, <span className="text-slate-500">: </span>, <span className="text-orange-500">2.4</span>, <span className="text-slate-500">,</span>],
                      [<span className="text-slate-400">{"  "}</span>, <span className="text-teal-600">"timestamp"</span>, <span className="text-slate-500">: </span>, <span className="text-emerald-600">"2024-12-01T10:30:00Z"</span>],
                      [<span className="text-slate-600">{"}"}</span>],
                    ] as React.ReactNode[][]).map((parts, i) => (
                      <div key={i} className="flex items-baseline">
                        <span className="w-7 shrink-0 select-none pr-2 text-right font-mono text-[8px] text-slate-300">{i + 1}</span>
                        <span className="font-mono text-[9.5px] leading-[1.6]">{parts}</span>
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

// ─────────────────────────────────────────────
// Card 3 — Shopping Cart
// ─────────────────────────────────────────────

const ITEM_ACCENT_COLORS = ["#2563EB", "#06B6D4", "#7C3AED"] as const;
const CONFETTI_ANGLES    = [0, 45, 90, 135, 180, 225, 270, 315] as const;
const CONFETTI_COLORS    = ["#2563EB","#06B6D4","#22c55e","#a855f7","#f59e0b","#ec4899","#6366f1","#14b8a6"] as const;

function BagIllustration() {
  return (
    <svg viewBox="0 0 80 90" className="h-[88px] w-20" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Handle arch */}
      <path d="M26 32 C26 16 54 16 54 32" stroke="rgba(147,197,253,0.75)" strokeWidth="3" strokeLinecap="round" />
      {/* Bag body — dashed border */}
      <rect x="10" y="29" width="60" height="50" rx="10"
        stroke="rgba(191,219,254,0.7)" strokeWidth="2.5" strokeDasharray="5 3"
        fill="rgba(219,234,254,0.15)" />
      {/* Dashed content lines */}
      <line x1="22" y1="50" x2="58" y2="50" stroke="rgba(191,219,254,0.55)" strokeWidth="2" strokeDasharray="4 3" strokeLinecap="round" />
      <line x1="22" y1="61" x2="50" y2="61" stroke="rgba(191,219,254,0.4)"  strokeWidth="2" strokeDasharray="4 3" strokeLinecap="round" />
    </svg>
  );
}

function CartPreview() {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, margin: "-40px" });
  const [items,   setItems]   = useState(CART_ITEMS);
  const [tab,     setTab]     = useState<"requests" | "orders">("requests");
  const [ordered, setOrdered] = useState(false);

  useEffect(() => {
    if (!inView) return;
    const t1 = setTimeout(() => setItems(p => p.slice(0, -1)), 4200);
    const t2 = setTimeout(() => setItems(CART_ITEMS), 6500);
    const t3 = setTimeout(() => { setOrdered(true); setItems([]); }, 10500);
    const t4 = setTimeout(() => { setOrdered(false); setTab("orders"); }, 13000);
    const t5 = setTimeout(() => { setTab("requests"); setItems(CART_ITEMS); }, 17000);
    return () => [t1, t2, t3, t4, t5].forEach(clearTimeout);
  }, [inView]);

  return (
    <div ref={ref} className="flex h-full flex-col overflow-hidden bg-surface text-fg">

      {/* Tabs header — exactly like real CARUSO cart */}
      <div className="flex shrink-0 items-center justify-between border-b border-border px-5 pt-1">
        <div className="flex">
          {(["requests", "orders"] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "flex items-center gap-1.5 px-1 pb-3 pt-3.5 text-[13px] font-semibold mr-5 transition-colors",
                tab === t ? "border-b-2 border-brand text-brand" : "border-b-2 border-transparent text-fg-subtle",
              )}
            >
              {t === "requests" ? <><ShoppingCart className="h-3.5 w-3.5" />My Requests</> : <><Clock className="h-3.5 w-3.5" />Orders</>}
            </button>
          ))}
        </div>
        <X className="h-4 w-4 cursor-pointer text-fg-subtle" />
      </div>

      <div className="min-h-0 flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {tab === "requests" && (
            <motion.div key="requests" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex h-full flex-col">

              {ordered ? (
                /* ── Order confirmed ── */
                <div className="relative flex h-full flex-col items-center justify-center gap-3 overflow-hidden">
                  {/* Confetti burst */}
                  {CONFETTI_ANGLES.map((angle, i) => {
                    const rad = (angle * Math.PI) / 180;
                    return (
                      <motion.div
                        key={i}
                        aria-hidden="true"
                        className="pointer-events-none absolute h-2 w-2 rounded-full"
                        style={{ left: "50%", top: "40%", marginLeft: -4, marginTop: -4, background: CONFETTI_COLORS[i % CONFETTI_COLORS.length] }}
                        initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                        animate={{ opacity: 0, x: Math.cos(rad) * 68, y: Math.sin(rad) * 68, scale: 0 }}
                        transition={{ duration: 0.72, delay: 0.1 + i * 0.05, ease: "easeOut" }}
                      />
                    );
                  })}
                  <motion.div
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500/15"
                    style={{ boxShadow: "0 0 0 1px rgba(34,197,94,0.25), 0 8px 24px rgba(34,197,94,0.15)" }}
                  >
                    <Check className="h-7 w-7 text-green-500" />
                  </motion.div>
                  <div className="text-center">
                    <p className="text-[17px] font-bold text-fg">Order placed!</p>
                    <p className="mt-0.5 text-[13px] text-fg-muted">Access granted immediately</p>
                    <motion.span
                      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
                      className="mt-2.5 inline-flex items-center gap-1.5 rounded-full border border-brand/20 bg-brand-subtle px-3 py-1 font-mono text-[12px] font-bold text-brand"
                    >
                      <Check className="h-3 w-3" />ORDER #20241201
                    </motion.span>
                  </div>
                </div>

              ) : items.length === 0 ? (
                /* ── Empty bag — matches real CARUSO design ── */
                <div className="flex h-full flex-col items-center justify-between px-5 pb-4 pt-6">
                  <div className="flex flex-1 flex-col items-center justify-center gap-4">
                    {/* Bag illustration with pulsing corner dots */}
                    <div className="relative">
                      {([[-30,-12],[30,-12],[-30,20],[30,20]] as [number,number][]).map(([x, y], i) => (
                        <motion.div
                          key={i}
                          aria-hidden="true"
                          className="pointer-events-none absolute h-1.5 w-1.5 rounded-full bg-brand/30"
                          style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)`, marginLeft: -3, marginTop: -3 }}
                          animate={{ opacity: [0.2, 0.75, 0.2] }}
                          transition={{ duration: 2.8, repeat: Infinity, delay: i * 0.5 }}
                        />
                      ))}
                      <BagIllustration />
                    </div>
                    <div className="text-center">
                      <p className="text-[16px] font-bold text-fg">Oops. Your Shopping Bag is Empty</p>
                      <p className="mt-1 text-[13px] leading-snug text-fg-muted">Add data items from the catalog to get started.</p>
                    </div>
                  </div>
                  {/* Browse button pinned to bottom */}
                  <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    className="w-full rounded-2xl bg-brand py-3 text-[14px] font-bold text-white"
                    style={{ boxShadow: "0 4px 16px rgba(37,99,235,0.35)" }}
                  >
                    <span className="flex items-center justify-center gap-2">
                      <ShoppingCart className="h-4 w-4" />Browse Data Catalog
                    </span>
                  </motion.button>
                </div>

              ) : (
                /* ── Items in cart ── */
                <>
                  <div className="min-h-0 flex-1 space-y-2 overflow-hidden px-4 py-3">
                    <AnimatePresence>
                      {items.map((item) => {
                        const accent = ITEM_ACCENT_COLORS[(item.id - 1) % ITEM_ACCENT_COLORS.length];
                        return (
                          <motion.div
                            key={item.id}
                            layout
                            initial={{ opacity: 0, x: 24 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -24, height: 0, marginBottom: 0 }}
                            transition={{ duration: 0.28 }}
                            className="flex items-center overflow-hidden rounded-2xl border border-border bg-base shadow-sm"
                          >
                            {/* Colored accent bar on left edge */}
                            <div className="h-full w-1 shrink-0 self-stretch" style={{ background: accent }} />
                            <div className="min-w-0 flex-1 py-3 pl-3 pr-1">
                              <p className="truncate text-[14px] font-semibold text-fg">{item.title}</p>
                              <div className="mt-1 flex items-center gap-2">
                                <span className="rounded-md px-2 py-0.5 font-mono text-[11px] font-bold" style={{ background: `${accent}18`, color: accent }}>
                                  {item.price}
                                </span>
                                <span className="font-mono text-[11px] text-fg-subtle">· 1 token</span>
                              </div>
                            </div>
                            <X className="mr-4 h-3.5 w-3.5 shrink-0 cursor-pointer text-fg-subtle" />
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>

                  {/* Total + Order button */}
                  <div className="shrink-0 border-t border-border px-4 pb-4 pt-3">
                    <div className="mb-3 rounded-xl border border-border bg-base/60 px-3 py-2">
                      <div className="flex items-center justify-between text-[12px] text-fg-subtle">
                        <span>Subtotal ({items.length} item{items.length !== 1 ? "s" : ""})</span>
                        <span>{items.length}.00 EUR</span>
                      </div>
                      <div className="mt-1.5 flex items-center justify-between border-t border-border/50 pt-1.5">
                        <span className="text-[14px] font-bold text-fg">Total</span>
                        <span className="font-mono text-[19px] font-extrabold text-fg">{items.length}.00 EUR</span>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                      className="relative w-full overflow-hidden rounded-2xl bg-brand py-3 text-[14px] font-bold text-white"
                      style={{ boxShadow: "0 4px 20px rgba(37,99,235,0.30)" }}
                    >
                      <motion.span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 rounded-2xl"
                        style={{ boxShadow: "0 4px 28px rgba(37,99,235,0.45)" }}
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                      />
                      <span className="relative">Order All</span>
                    </motion.button>
                  </div>
                </>
              )}
            </motion.div>
          )}

          {tab === "orders" && (
            <motion.div key="orders" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="overflow-y-auto p-4 [scrollbar-width:none]">
              <div className="overflow-hidden rounded-2xl border border-border bg-base shadow-sm">
                {/* Order header */}
                <div className="flex items-center justify-between border-b border-border px-4 py-3">
                  <div>
                    <p className="text-[15px] font-bold text-fg">Order #001</p>
                    <div className="mt-0.5 flex items-center gap-1.5">
                      <span className="rounded-full bg-green-500/15 px-2 py-0.5 font-mono text-[11px] font-bold text-green-600">✓ COMPLETED</span>
                      <span className="flex items-center gap-1 text-[12px] text-fg-subtle"><Clock className="h-3 w-3" />just now</span>
                    </div>
                  </div>
                  <span className="font-mono text-[18px] font-extrabold text-brand">3.00 EUR</span>
                </div>
                {/* Line items */}
                <div className="divide-y divide-border/50 px-4">
                  {CART_ITEMS.map((item, i) => {
                    const accent = ITEM_ACCENT_COLORS[i % ITEM_ACCENT_COLORS.length];
                    return (
                      <div key={item.id} className="flex items-center gap-2.5 py-2.5">
                        <div className="h-2 w-2 shrink-0 rounded-full" style={{ background: accent }} />
                        <p className="min-w-0 flex-1 truncate text-[13px] text-fg-muted">{item.title}</p>
                        <span className="font-mono text-[12px] text-fg-subtle">{item.price}</span>
                      </div>
                    );
                  })}
                </div>
                {/* Access banner */}
                <div className="border-t border-green-500/20 bg-green-500/5 px-4 py-2.5 text-center">
                  <p className="text-[12px] font-semibold text-green-600">✓ Data access granted · API key active</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Section
// ─────────────────────────────────────────────

const CARD_REVEAL = {
  hidden: { opacity: 0, y: 48 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.72, ease: EASE_PREMIUM },
  },
};

const STAGGER = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14, delayChildren: 0.05 } },
};

function MacOSBar({ label }: { label: string }) {
  return (
    <div className="flex shrink-0 items-center gap-1.5 border-b border-brand/10 bg-base px-4 py-2.5">
      <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
      <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
      <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
      <span className="ml-auto font-mono text-[10px] text-fg-subtle">{label}</span>
    </div>
  );
}

export function FeatureBentoGrid() {
  return (
    <section id="catalog" className="relative bg-base px-8 py-28">
      <VehicleBackground iconOpacity={0.15} laneOpacity={0.15} laneSpeed={34} floatAmplitude={13} />
      <div className="relative z-[1] mx-auto max-w-[1560px]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
          className="mb-16 max-w-2xl"
        >
          <h2 className="text-4xl font-extrabold tracking-tight text-fg sm:text-5xl">
            Built for the way{" "}
            <span className="text-brand">enterprises</span> buy data.
          </h2>
          <p className="mt-4 text-fg-muted">
            Every feature engineered for security, speed, and a frictionless B2B
            checkout.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.12 }}
          variants={STAGGER}
          className="grid h-[1260px] grid-cols-1 gap-6 lg:grid-cols-[1fr_340px] lg:grid-rows-2"
        >
          {/* ── Product Catalog (col-span-3, row-span-2) ── */}
          <motion.div
            variants={CARD_REVEAL}
            whileHover={{ y: -3, boxShadow: BENTO_HOVER_SHADOW }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            style={{ boxShadow: BENTO_SHADOW }}
            className="relative flex flex-col overflow-hidden rounded-3xl border border-brand/25 bg-surface lg:col-span-1 lg:row-span-2"
          >
            <MacOSBar label="caruso · data-catalog" />

            {/* Ambient glows */}
            <div className="pointer-events-none absolute -right-24 top-8 h-72 w-72 rounded-full bg-cyan-400/8 blur-[80px]" />
            <div className="pointer-events-none absolute -left-16 top-8 h-48 w-48 rounded-full bg-brand/5 blur-[60px]" />

            {/* Header */}
            <div className="shrink-0 px-6 pt-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full border border-brand/25 bg-brand-subtle px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-brand">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand" />
                    Data Catalog
                  </span>
                  <h3 className="mt-3 text-2xl font-extrabold tracking-tight text-fg">
                    Discover &amp;{" "}
                    <span
                      style={{
                        background: "linear-gradient(to right, #2563EB, #06B6D4)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      Filter
                    </span>
                  </h3>
                  <p className="mt-1 text-[12px] text-fg-muted">
                    Fuzzy full-text search · 433+ Data Items · B2B API
                  </p>
                </div>
                {/* Stat chips */}
                <div className="flex shrink-0 flex-col gap-2 pt-1">
                  {[
                    { value: "433+", label: "Data Items" },
                    { value: "10",  label: "Kategorien" },
                    { value: "8+",  label: "OEM-Partner" },
                  ].map(({ value, label }) => (
                    <div
                      key={label}
                      className="flex items-center gap-2 rounded-xl border border-border bg-base px-3 py-1.5 shadow-sm"
                    >
                      <span className="text-[15px] font-extrabold text-brand">{value}</span>
                      <span className="text-[10px] text-fg-muted">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mx-6 mt-4 h-px shrink-0 bg-gradient-to-r from-brand/20 via-border to-transparent" />
            <div className="min-h-0 flex-1 overflow-hidden">
              <CatalogPreview />
            </div>
          </motion.div>

          {/* ── Item Detail / OEM Orbital (col-span-1, row-span-1) ── */}
          <motion.div
            variants={CARD_REVEAL}
            whileHover={{ y: -3, boxShadow: BENTO_HOVER_SHADOW }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            style={{ boxShadow: BENTO_SHADOW }}
            className="relative flex flex-col overflow-hidden rounded-3xl border border-brand/25 bg-surface lg:col-span-1 lg:row-span-1"
          >
            <MacOSBar label="caruso · item-detail" />
            <div className="pointer-events-none absolute -left-12 top-8 h-48 w-48 rounded-full bg-blue-400/8 blur-[60px]" />
            <div className="shrink-0 px-5 pt-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full border border-brand/25 bg-brand-subtle px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-brand">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand" />
                    Item Detail
                  </span>
                  <h3 className="mt-2.5 text-xl font-extrabold tracking-tight text-fg">
                    OEM{" "}
                    <span style={{ background: "linear-gradient(to right, #2563EB, #06B6D4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                      Deep-Dive
                    </span>
                  </h3>
                  <p className="mt-0.5 text-[11px] text-fg-muted">Specs card · JSON Schema · Attributes</p>
                </div>
                <div className="flex shrink-0 flex-col gap-1.5 pt-0.5">
                  {[
                    { value: "6+",  label: "OEMs"    },
                    { value: "B2C", label: "Channel"  },
                  ].map(({ value, label }) => (
                    <div key={label} className="flex items-center gap-2 rounded-xl border border-border bg-base px-3 py-1.5 shadow-sm">
                      <span className="text-[13px] font-extrabold text-brand">{value}</span>
                      <span className="text-[10px] text-fg-muted">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mx-5 mt-3 h-px shrink-0 bg-gradient-to-r from-brand/20 via-border to-transparent" />
            <div className="min-h-0 flex-1 overflow-hidden">
              <DetailPreview />
            </div>
          </motion.div>

          {/* ── Shopping Cart (col-span-1, row-span-1) ── */}
          <motion.div
            variants={CARD_REVEAL}
            whileHover={{ y: -3, boxShadow: BENTO_HOVER_SHADOW }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            style={{ boxShadow: BENTO_SHADOW }}
            className="relative flex flex-col overflow-hidden rounded-3xl border border-brand/25 bg-surface lg:col-span-1 lg:row-span-1"
          >
            <MacOSBar label="caruso · shopping-cart" />
            <div className="pointer-events-none absolute -bottom-12 -right-12 h-48 w-48 rounded-full bg-purple-400/8 blur-[60px]" />
            <div className="shrink-0 px-5 pt-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full border border-brand/25 bg-brand-subtle px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-brand">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand" />
                    Request System
                  </span>
                  <h3 className="mt-2.5 text-xl font-extrabold tracking-tight text-fg">
                    Shopping{" "}
                    <span style={{ background: "linear-gradient(to right, #2563EB, #06B6D4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                      Cart
                    </span>
                  </h3>
                  <p className="mt-0.5 text-[11px] text-fg-muted">UUID items · Order history · API access</p>
                </div>
                <div className="flex shrink-0 flex-col gap-1.5 pt-0.5">
                  {[
                    { value: "UUID", label: "Items"  },
                    { value: "API",  label: "Access"  },
                  ].map(({ value, label }) => (
                    <div key={label} className="flex items-center gap-2 rounded-xl border border-border bg-base px-3 py-1.5 shadow-sm">
                      <span className="text-[13px] font-extrabold text-brand">{value}</span>
                      <span className="text-[10px] text-fg-muted">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mx-5 mt-3 h-px shrink-0 bg-gradient-to-r from-brand/20 via-border to-transparent" />
            <div className="min-h-0 flex-1 overflow-hidden">
              <CartPreview />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
