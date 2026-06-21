import { motion, AnimatePresence, useInView } from "framer-motion";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import {
  Search, ShoppingCart, Battery, Copy, X, ArrowUpDown, Check, Clock,
  SlidersHorizontal
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

const ORBITAL_R = 82;
const ORBITAL_NODES = [
  { label: "VW", angle: -90 },
  { label: "Audi", angle: -30 },
  { label: "Seat", angle: 30 },
  { label: "Skoda", angle: 90 },
  { label: "Cupra", angle: 150 },
  { label: "VW CV", angle: 210 },
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
// Card 2 — Item Detail / OEM Orbital
// ─────────────────────────────────────────────

const ORBITAL_SPIN: CSSProperties = {
  transformBox: "fill-box",
  transformOrigin: "center",
  animation: "orbital-spin 120s linear infinite",
};
const ORBITAL_COUNTER: CSSProperties = {
  transformBox: "fill-box",
  transformOrigin: "center",
  animation: "orbital-spin-reverse 120s linear infinite",
};

function OEMOrbital({ active }: { active: boolean }) {
  return (
    <svg viewBox="-120 -120 240 240" className="h-full w-full">
      <g style={ORBITAL_SPIN}>
        {ORBITAL_NODES.map((node, i) => {
          const rad = (node.angle * Math.PI) / 180;
          const x = Math.cos(rad) * ORBITAL_R;
          const y = Math.sin(rad) * ORBITAL_R;
          return (
            <g key={node.label}>
              <motion.path
                d={`M 0 0 L ${x} ${y}`}
                stroke="rgba(37,99,235,0.18)"
                strokeWidth={1}
                fill="none"
                initial={{ pathLength: 0 }}
                animate={active ? { pathLength: 1 } : {}}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.55 }}
              />
              <g transform={`translate(${x},${y})`}>
                <motion.circle
                  r={19}
                  fill="rgba(37,99,235,0.05)"
                  stroke="rgba(37,99,235,0.18)"
                  strokeWidth={1}
                  initial={{ scale: 0 }}
                  animate={active ? { scale: 1 } : {}}
                  transition={{
                    delay: 0.3 + i * 0.1,
                    duration: 0.35,
                    ease: EASE_PREMIUM,
                  }}
                />
                <g style={ORBITAL_COUNTER}>
                  <motion.text
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={6.5}
                    fontWeight={600}
                    fill="rgba(15,23,42,0.65)"
                    fontFamily="ui-monospace, monospace"
                    initial={{ opacity: 0 }}
                    animate={active ? { opacity: 1 } : {}}
                    transition={{ delay: 0.55 + i * 0.1 }}
                  >
                    {node.label}
                  </motion.text>
                </g>
              </g>
            </g>
          );
        })}
      </g>

      <motion.circle
        r={36}
        fill="none"
        stroke="rgba(34,211,238,0.1)"
        strokeWidth={16}
        vectorEffect="non-scaling-stroke"
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
        animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.circle
        cx={0}
        cy={0}
        r={36}
        fill="rgba(34,211,238,0.07)"
        stroke="rgba(34,211,238,0.45)"
        strokeWidth={1.5}
        vectorEffect="non-scaling-stroke"
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
        animate={{ scale: [1, 1.056, 1] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
      />
      <text
        textAnchor="middle"
        y={-5}
        fontSize={10}
        fontWeight={700}
        fill="rgba(255,255,255,0.82)"
        fontFamily="ui-monospace,monospace"
      >
        VW
      </text>
      <text
        textAnchor="middle"
        y={8}
        fontSize={6.5}
        fill="rgba(34,211,238,0.75)"
        fontFamily="ui-monospace,monospace"
      >
        Group
      </text>
      <circle cx={26} cy={-26} r={8} fill="#3b82f6" />
      <text
        x={26}
        y={-23}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={4.5}
        fontWeight={700}
        fill="white"
        fontFamily="sans-serif"
      >
        B2B
      </text>
    </svg>
  );
}

function DetailPreview() {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, margin: "-40px" });

  const SPECS = [
    { label: "Contract", value: "B2B",       accent: "text-blue-500"  },
    { label: "OEMs",     value: "6+",         accent: "text-brand"     },
    { label: "API",      value: "v1",         accent: "text-fg"        },
    { label: "Status",   value: "AVAILABLE",  accent: "text-green-500" },
  ];

  return (
    <div ref={ref} className="flex h-full flex-col overflow-hidden">

      {/* Selected item hero */}
      <div className="shrink-0 border-b border-border bg-gradient-to-br from-brand-subtle/60 to-surface px-5 py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl shadow-sm"
              style={{ background: "linear-gradient(135deg, #2563EB, #06B6D4)", boxShadow: "0 4px 14px rgba(37,99,235,0.30)" }}
            >
              <Battery className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-[14px] font-extrabold leading-tight text-fg">Battery Care Mode</p>
              <div className="mt-1.5 flex items-center gap-1.5">
                <span className="rounded-full bg-green-500/15 px-2 py-0.5 text-[10px] font-bold text-green-600">● AVAILABLE</span>
                <span className="rounded-full bg-blue-500/15 px-2 py-0.5 text-[10px] font-semibold text-blue-600">B2B</span>
                <span className="rounded-full bg-orange-500/15 px-2 py-0.5 text-[10px] font-semibold text-orange-500">B2C</span>
              </div>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.04, boxShadow: "0 0 20px rgba(37,99,235,0.4)" }}
            whileTap={{ scale: 0.97 }}
            className="shrink-0 rounded-xl bg-brand px-3 py-1.5 text-[11px] font-bold text-white shadow-sm"
            style={{ boxShadow: "0 4px 14px rgba(37,99,235,0.30)" }}
          >
            ▶ Request
          </motion.button>
        </div>

        {/* API slug */}
        <div className="mt-3 flex items-center justify-between rounded-xl border border-brand/15 bg-base px-3 py-2">
          <code className="font-mono text-[11px] text-brand/80">caruso.api / battery-care-mode</code>
          <Copy className="h-3.5 w-3.5 text-fg-subtle hover:text-brand cursor-pointer" />
        </div>
      </div>

      {/* OEM Orbital */}
      <div className="min-h-0 flex-1 px-3 py-1">
        <OEMOrbital active={inView} />
      </div>

      {/* Specs bar */}
      <div className="shrink-0 grid grid-cols-4 divide-x divide-border border-t border-border">
        {SPECS.map(({ label, value, accent }) => (
          <div key={label} className="px-2 py-3 text-center">
            <p className="font-mono text-[9px] uppercase tracking-widest text-fg-subtle">{label}</p>
            <p className={cn("mt-0.5 truncate text-[12px] font-extrabold", accent)}>{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Card 3 — Shopping Cart
// ─────────────────────────────────────────────

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
    <div ref={ref} className="flex h-full flex-col overflow-hidden">

      {/* Cart header */}
      <div className="flex shrink-0 items-center justify-between border-b border-border bg-gradient-to-r from-brand-subtle/40 to-surface px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <div className="rounded-xl bg-brand-subtle p-2">
            <ShoppingCart className="h-4.5 w-4.5 text-brand" style={{ width: "1.125rem", height: "1.125rem" }} />
          </div>
          <span className="text-[15px] font-extrabold text-fg">Shopping Bag</span>
          <AnimatePresence mode="wait">
            <motion.span
              key={items.length}
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.6, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex h-5 w-5 items-center justify-center rounded-full bg-brand font-mono text-[10px] font-bold text-white"
            >
              {items.length}
            </motion.span>
          </AnimatePresence>
        </div>
        <X className="h-4 w-4 cursor-pointer text-fg-subtle hover:text-fg" />
      </div>

      {/* Tabs */}
      <div className="flex shrink-0 border-b border-border">
        {(["requests", "orders"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "flex-1 py-2.5 text-[12px] font-semibold transition-colors",
              tab === t ? "border-b-2 border-brand text-brand" : "text-fg-subtle hover:text-fg-muted",
            )}
          >
            {t === "requests" ? "My Requests" : "Orders"}
          </button>
        ))}
      </div>

      <div className="min-h-0 flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {tab === "requests" && (
            <motion.div key="requests" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex h-full flex-col">
              {ordered ? (
                <div className="flex h-full flex-col items-center justify-center gap-3">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500/15"
                    style={{ boxShadow: "0 0 0 1px rgba(34,197,94,0.25), 0 8px 24px rgba(34,197,94,0.15)" }}
                  >
                    <Check className="h-7 w-7 text-green-500" />
                  </motion.div>
                  <p className="text-[15px] font-bold text-fg">Order placed!</p>
                  <p className="text-[12px] text-fg-muted">Saved to order history</p>
                </div>
              ) : items.length === 0 ? (
                <div className="flex h-full items-center justify-center">
                  <p className="text-[13px] text-fg-subtle">Your bag is empty</p>
                </div>
              ) : (
                <>
                  <div className="min-h-0 flex-1 space-y-2.5 overflow-hidden px-4 py-4">
                    <AnimatePresence>
                      {items.map((item) => (
                        <motion.div
                          key={item.id}
                          layout
                          initial={{ opacity: 0, x: 24 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -24, height: 0, marginBottom: 0 }}
                          transition={{ duration: 0.28 }}
                          className="flex items-center justify-between rounded-2xl border border-border bg-base px-4 py-3 shadow-sm"
                        >
                          <div>
                            <p className="text-[13px] font-semibold text-fg">{item.title}</p>
                            <p className="mt-0.5 text-[11px] text-fg-subtle">{item.price}</p>
                          </div>
                          <X className="h-3.5 w-3.5 cursor-pointer text-fg-subtle hover:text-fg" />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  <div className="shrink-0 border-t border-border px-4 pb-4 pt-3">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-[12px] text-fg-muted">Total</span>
                      <span className="text-[18px] font-extrabold text-fg">{items.length}.00 EUR</span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      className="relative w-full overflow-hidden rounded-2xl bg-brand py-3 text-[13px] font-bold text-white"
                      style={{ boxShadow: "0 4px 20px rgba(37,99,235,0.30)" }}
                    >
                      {/* Glow pulse via opacity (compositor-only) */}
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
            <motion.div key="orders" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4">
              <div className="rounded-2xl border border-border bg-base p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[14px] font-bold text-fg">Order #001</span>
                  <span className="text-[14px] font-extrabold text-brand">3.00 EUR</span>
                </div>
                <div className="mt-3 space-y-1.5">
                  {CART_ITEMS.map((item) => (
                    <p key={item.id} className="text-[12px] text-fg-muted">· {item.title}</p>
                  ))}
                </div>
                <div className="mt-3 flex items-center gap-2 border-t border-border pt-3">
                  <Clock className="h-3.5 w-3.5 text-fg-subtle" />
                  <span className="text-[11px] text-fg-subtle">just now</span>
                  <span className="ml-auto rounded-full bg-green-500/15 px-2.5 py-0.5 text-[10px] font-bold text-green-600">
                    COMPLETED
                  </span>
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
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-brand/60">Item Detail</span>
              <h3 className="mt-0.5 text-base font-extrabold tracking-tight text-fg">OEM Deep-Dive</h3>
              <p className="text-[11px] text-fg-muted">Orbital hub · Specs card · JSON Schema · Attributes</p>
            </div>
            <div className="mx-5 mt-3 h-px shrink-0 bg-border" />
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
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-brand/60">Request System</span>
              <h3 className="mt-0.5 text-base font-extrabold tracking-tight text-fg">Shopping Cart</h3>
              <p className="text-[11px] text-fg-muted">localStorage persistence · UUID items · order history</p>
            </div>
            <div className="mx-5 mt-3 h-px shrink-0 bg-border" />
            <div className="min-h-0 flex-1 overflow-hidden">
              <CartPreview />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
