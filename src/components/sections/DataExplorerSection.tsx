import { AnimatePresence, motion, useInView } from "framer-motion";
import { useRef, useState, useMemo } from "react";
import { ArrowLeftRight, ChevronDown } from "lucide-react";
import { EASE_PREMIUM } from "../../lib/motion";
import { cn } from "../../lib/utils";
import { SectionBadge } from "../ui/SectionBadge";
import { EXPLORER_Y_TICKS } from "../../lib/explorerChart";
import { CATEGORIES, OEMS, DATA_MATRIX, type OEM } from "../../data/explorerData";
import { useElementWidth } from "../../hooks/useElementWidth";

// ── Types ─────────────────────────────────────────────────────────────────────
type Mode = "oem-by-category" | "category-by-oem";

interface Bar {
  key: string;
  label: string;       // full label for tooltip + x-axis
  pct: number;
  color: string;
  oem?: OEM;           // present only in oem-by-category mode, for the logo circle
}

// ── Constants ─────────────────────────────────────────────────────────────────
const OEM_BAR_COLOR  = "#06B6D4";
const Y_TICKS        = EXPLORER_Y_TICKS;
const SCALE          = 0.88; // 88% of chart height = 100% data value
const X_AXIS_HEIGHT  = 72;   // px reserved for angled labels (desktop only)

// ── OEM Brand Circle ──────────────────────────────────────────────────────────
function BrandCircle({ oem, size = 28 }: { oem: OEM; size?: number }) {
  const abbr = oem.key.toUpperCase().slice(0, 3);
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full border-2 bg-white font-bold"
      style={{
        width:         size,
        height:        size,
        borderColor:   "#06B6D4",
        color:         "#06B6D4",
        fontSize:      abbr.length > 2 ? 6 : 8,
        letterSpacing: "-0.03em",
      }}
    >
      {abbr}
    </div>
  );
}

// ── Category Dot ──────────────────────────────────────────────────────────────
function CategoryDot({ color, size = 8 }: { color: string; size?: number }) {
  return (
    <span
      className="shrink-0 rounded-full"
      style={{ width: size, height: size, backgroundColor: color }}
    />
  );
}

// ── NEU: Einzelner Chart-Balken (Verhindert Re-Render der ganzen Section) ───
function ChartBar({ bar, barH, i, chartKey, inView }: { bar: Bar; barH: number; i: number; chartKey: string; inView: boolean }) {
  // Der Hover-State lebt jetzt HIER drinnen. Nur dieser Balken rendert neu!
  const [isHov, setIsHov] = useState(false);

  return (
    <div
      className="relative flex-1"
      onMouseEnter={() => setIsHov(true)}
      onMouseLeave={() => setIsHov(false)}
    >
      {/* OEM logo circle (only in oem-by-category mode) */}
      {bar.oem && (
        <motion.div
          key={`logo-${chartKey}-${i}`}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: inView ? 1 : 0, scale: inView ? 1 : 0.5 }}
          transition={{ duration: 0.4, ease: EASE_PREMIUM, delay: 0.12 + i * 0.04 }}
          className="pointer-events-none absolute left-1/2 -translate-x-1/2 -translate-y-full"
          style={{ bottom: `calc(${barH}% + 6px)` }}
        >
          <BrandCircle oem={bar.oem} size={26} />
        </motion.div>
      )}

      {/* Pct label */}
      {!isHov && (
        <motion.span
          key={`pct-${chartKey}-${i}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: inView ? 1 : 0 }}
          transition={{ duration: 0.2, delay: 0.6 + i * 0.04 }}
          className="pointer-events-none absolute left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[9px] tabular-nums text-fg-muted"
          style={{
            bottom: bar.oem
              ? `calc(${barH}% + 38px)` // above logo in OEM mode
              : `calc(${barH}% + 6px)`, // above bar in category mode
          }}
        >
          {bar.pct.toFixed(1)}%
        </motion.span>
      )}

      {/* Hover tooltip */}
      <AnimatePresence>
        {isHov && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.9 }}
            transition={{ duration: 0.14 }}
            className="pointer-events-none absolute z-20 -translate-x-1/2 rounded-lg border border-border bg-surface px-3 py-2 shadow-card-md"
            style={{ bottom: `calc(${barH}% + 44px)`, left: "50%" }}
          >
            <p className="whitespace-nowrap font-mono text-[11px] font-semibold text-fg">
              {bar.label}
            </p>
            <p className="font-mono text-[11px] text-fg-muted">
              {bar.pct.toFixed(1)}% coverage
            </p>
            <div className="absolute -bottom-[5px] left-1/2 h-[9px] w-[9px] -translate-x-1/2 rotate-45 border-b border-r border-border bg-surface" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bar */}
      <motion.div
        key={`bar-${chartKey}-${i}`}
        className="absolute bottom-0 rounded-t-[3px]"
        style={{
          left:            "16%",
          right:           "16%",
          height:          `${barH}%`,
          backgroundColor: bar.color,
          transformOrigin: "bottom",
          opacity:         isHov ? 1 : 0.82,
          boxShadow:       isHov ? `0 0 20px ${bar.color}55` : "none",
          transition:      "opacity 0.18s, box-shadow 0.18s",
        }}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: inView ? 1 : 0 }}
        transition={{
          duration: 0.65,
          ease:     EASE_PREMIUM,
          delay:    0.08 + i * 0.05,
        }}
      />
    </div>
  );
}

// ── Main Section ──────────────────────────────────────────────────────────────
export function DataExplorerSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRef    = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: false, margin: "-80px 0px" });

  // On narrow viewports switch to a mobile layout:
  // – horizontal scrollable chip-legend above the bars instead of angled x-axis labels below
  // – bars fill full chart height (no bottom padding for labels)
  const cardWidth    = useElementWidth(cardRef);
  const isMobile     = cardWidth > 0 && cardWidth < 640;
  const xAxisHeight  = isMobile ? 0 : X_AXIS_HEIGHT;

  const [mode, setMode]                 = useState<Mode>("oem-by-category");
  const [selectedCategory, setCategory] = useState(CATEGORIES[4].key); // Maintenance & Diagnostics
  const [selectedOEM, setOEM]           = useState(OEMS[1].key);       // BMW
  const [dropdownOpen, setDropdown]     = useState(false);
  
  // HIER WURDE `hoveredBar` ENTFERNT!

  // ── Derived bars ─────────────────────────────────────────────────────────
  const bars = useMemo<Bar[]>(() => {
    if (mode === "oem-by-category") {
      return OEMS.map(oem => ({
        key:   oem.key,
        label: oem.label,
        pct:   DATA_MATRIX[oem.key]?.[selectedCategory] ?? 0,
        color: OEM_BAR_COLOR,
        oem,
      }));
    }
    return CATEGORIES.map(cat => ({
      key:   cat.key,
      label: cat.label,
      pct:   DATA_MATRIX[selectedOEM]?.[cat.key] ?? 0,
      color: cat.color,
    }));
  }, [mode, selectedCategory, selectedOEM]);

  const activeCat = CATEGORIES.find(c => c.key === selectedCategory)!;
  const activeOEM = OEMS.find(o => o.key === selectedOEM)!;

  const yLabel   = mode === "oem-by-category" ? activeCat.label : activeOEM.label;
  const yColor   = mode === "oem-by-category" ? activeCat.color : OEM_BAR_COLOR;
  const chartKey = `${mode}::${selectedCategory}::${selectedOEM}`;

  const statusText =
    mode === "oem-by-category"
      ? `${activeCat.count} category-relevant data items · OEM distribution for ${activeCat.label}`
      : `${activeOEM.label} · Category distribution across all data items`;

  // ── Dropdown items ────────────────────────────────────────────────────────
  const dropdownItems =
    mode === "oem-by-category"
      ? CATEGORIES.map(c => ({ key: c.key, label: c.label, color: c.color }))
      : OEMS.map(o => ({ key: o.key, label: o.label, color: OEM_BAR_COLOR }));

  const selectedKey = mode === "oem-by-category" ? selectedCategory : selectedOEM;

  function handleSelect(key: string) {
    if (mode === "oem-by-category") setCategory(key);
    else setOEM(key);
    setDropdown(false);
  }

  function handleSwitchAxes() {
    setDropdown(false);
    setMode(m => (m === "oem-by-category" ? "category-by-oem" : "oem-by-category"));
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <section ref={sectionRef} id="explorer" className="relative overflow-x-clip bg-base px-4 py-16 sm:px-6 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE_PREMIUM }}
          className="max-w-2xl"
        >
          <SectionBadge label="Data Explorer" pulse />
          <h2 className="mt-5 text-4xl font-extrabold tracking-tight text-fg sm:text-5xl">
            Explore Data <span className="text-brand">Distribution</span>
          </h2>
          <p className="mt-4 text-lg text-fg-muted">
            Analyze coverage across{" "}
            <span className="font-semibold text-fg">11 OEMs</span> and{" "}
            <span className="font-semibold text-fg">10 categories</span>.
            Click the axis label to change the selection — toggle axes to flip the view.
          </p>
        </motion.div>

        {/* Explorer card */}
        <motion.div
          ref={cardRef}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75, ease: EASE_PREMIUM, delay: 0.15 }}
          className="mt-10 overflow-hidden rounded-2xl border border-border bg-surface shadow-card-lg"
        >

          {/* Card header: status + switch mode label */}
          <div className="flex shrink-0 items-center justify-between border-b border-border px-6 py-3">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
              </span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={chartKey}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.2 }}
                  className="font-mono text-xs text-fg-subtle"
                >
                  {statusText}
                </motion.span>
              </AnimatePresence>
            </div>

            <AnimatePresence mode="wait">
              <motion.span
                key={mode}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.2 }}
                className="font-mono text-xs text-fg-subtle"
              >
                {mode === "oem-by-category" ? "OEM view" : "Category view"}
              </motion.span>
            </AnimatePresence>
          </div>

          {/* Chart body */}
          <div className="flex min-h-[400px] flex-col px-4 pb-5 pt-4 sm:min-h-[540px]">

            {/* ── Mobile chip legend (replaces angled x-axis labels) ── */}
            {isMobile && (
              <AnimatePresence mode="wait">
                <motion.div
                  key={`chips-${chartKey}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mb-3 flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                >
                  {bars.map(bar => (
                    <span
                      key={bar.key}
                      className="flex shrink-0 items-center gap-1.5 rounded-full border border-border/60 bg-base px-2.5 py-1 font-mono text-[10px] text-fg-muted"
                    >
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: bar.color }} />
                      {bar.label}
                    </span>
                  ))}
                </motion.div>
              </AnimatePresence>
            )}

            {/* ── Chart row: rotated Y-label + plot ── */}
            <div className="relative flex min-h-0 flex-1 gap-0">

              {/* Rotated Y-axis label (clickable → dropdown) */}
              <div className="relative flex w-11 shrink-0 items-center justify-center sm:w-10">
                <button
                  type="button"
                  onClick={() => setDropdown(v => !v)}
                  aria-expanded={dropdownOpen}
                  aria-haspopup="listbox"
                  className="flex min-h-11 min-w-11 cursor-pointer items-center justify-center gap-1.5 transition-opacity hover:opacity-75 sm:min-h-0 sm:min-w-0"
                  style={{
                    writingMode: "vertical-lr",
                    transform:   "rotate(180deg)",
                    color:        yColor,
                  }}
                >
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={yLabel}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.22 }}
                      className="font-mono text-[11px] font-semibold tracking-wide"
                    >
                      {yLabel}
                    </motion.span>
                  </AnimatePresence>
                  <motion.span
                    animate={{ rotate: dropdownOpen ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="mb-1"
                  >
                    <ChevronDown className="h-3.5 w-3.5" style={{ transform: "rotate(90deg)" }} />
                  </motion.span>
                </button>

                {/* Dropdown */}
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, x: -6, scale: 0.97 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: -6, scale: 0.97 }}
                      transition={{ duration: 0.16, ease: "easeOut" }}
                      className="absolute left-10 top-1/4 z-50 min-w-[240px] overflow-hidden rounded-xl border border-border bg-surface shadow-card-lg"
                    >
                      <div className="max-h-64 overflow-y-auto py-1.5 [scrollbar-width:thin]">
                        {dropdownItems.map(item => {
                          const isSel = item.key === selectedKey;
                          return (
                            <button
                              key={item.key}
                              onClick={() => handleSelect(item.key)}
                              className={cn(
                                "flex w-full items-center gap-2.5 px-4 py-2 text-sm transition-colors hover:bg-base",
                                isSel ? "font-semibold text-fg" : "text-fg-muted",
                              )}
                            >
                              <CategoryDot color={item.color} />
                              {item.label}
                              {isSel && <span className="ml-auto text-[10px] font-bold text-brand">✓</span>}
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Plot area */}
              <div className="relative min-h-0 flex-1">

                {/* Y-ticks + gridlines — same reference frame as bars */}
                {Y_TICKS.map(tick => (
                  <div
                    key={tick}
                    className="pointer-events-none absolute left-0 right-0 flex items-center"
                    style={{ bottom: `calc(${tick * SCALE}% + ${xAxisHeight}px)` }}
                  >
                    <span className="mr-2 w-8 shrink-0 text-right font-mono text-[10px] leading-none text-fg-subtle">
                      {tick}%
                    </span>
                    <div className="flex-1 border-t border-border/60" />
                  </div>
                ))}

                {/* Bars + logo circles, absolute within plot area */}
                <div
                  className="absolute flex"
                  style={{ left: 40, right: 0, top: 0, bottom: xAxisHeight }}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={chartKey}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.22 }}
                      className="flex flex-1 gap-1"
                    >
                      {bars.map((bar, i) => (
                        <ChartBar
                          key={bar.key}
                          bar={bar}
                          barH={bar.pct * SCALE}
                          i={i}
                          chartKey={chartKey}
                          inView={inView}
                        />
                      ))}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* X-axis labels — angled, desktop only (mobile uses chip legend above) */}
                {!isMobile && (
                  <div
                    className="pointer-events-none absolute flex"
                    style={{ left: 40, right: 0, bottom: 0, height: xAxisHeight }}
                  >
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`xl-${chartKey}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.22 }}
                        className="flex flex-1 gap-1"
                      >
                        {bars.map(bar => (
                          <div key={bar.key} className="relative flex-1">
                            <span
                              className="absolute top-2 left-1/2 block origin-top-left whitespace-nowrap font-mono text-[10px] text-fg-muted"
                              style={{ transform: "translateX(-50%) rotate(-40deg)" }}
                            >
                              {bar.label}
                            </span>
                          </div>
                        ))}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                )}

              </div>{/* /plot area */}
            </div>{/* /chart row */}

            {/* ── Switch Axes button ── */}
            <div className="mt-4 flex items-center">
              <motion.button
                type="button"
                onClick={handleSwitchAxes}
                className="flex min-h-11 items-center gap-2 rounded-full border border-border bg-base px-4 py-2.5 text-sm font-medium text-fg-muted transition-colors hover:border-brand/40 hover:text-brand sm:min-h-0 sm:py-2"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <ArrowLeftRight className="h-4 w-4" />
                Switch Axes
              </motion.button>
            </div>

          </div>{/* /chart body */}
        </motion.div>
      </div>
    </section>
  );
}