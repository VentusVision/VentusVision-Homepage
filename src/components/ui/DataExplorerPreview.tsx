import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { ArrowUpDown } from "lucide-react";
import { cn } from "../../lib/utils";
import { CATEGORIES, OEMS, DATA_MATRIX } from "../../data/explorerData";
import { useDataExplorerAutoDemo } from "../../hooks/useDataExplorerAutoDemo";

// ── Constants ─────────────────────────────────────────────────────────────────
const SCALE    = 0.86;
const X_AXIS_H = 96;
const Y_TICK_W = 40;
const Y_TICKS  = [0, 20, 40, 60, 80, 100];
const TEAL     = "#22d3ee";
const OEM_DOT  = "#3b82f6";
const EASE     = [0.22, 1, 0.36, 1] as const;

type Mode = "oem-by-cat" | "cat-by-oem";

interface Bar { key: string; label: string; pct: number; color: string; logoFile?: string }

function randomStartMode(): Mode {
  return Math.random() < 0.5 ? "oem-by-cat" : "cat-by-oem";
}

function itemKeysForMode(mode: string): string[] {
  return mode === "oem-by-cat"
    ? CATEGORIES.map((c) => c.key)
    : OEMS.map((o) => o.key);
}

// ── Component ─────────────────────────────────────────────────────────────────
export function DataExplorerPreview() {
  const [mode, setMode]                 = useState<Mode>(randomStartMode);
  const [selectedCat, setSelectedCat]   = useState("maintenance_diag");
  const [selectedOem, setSelectedOem]   = useState("ford");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [hoveredBar, setHoveredBar]     = useState<string | null>(null);

  const rootRef = useRef<HTMLDivElement>(null);
  const modeRef  = useRef(mode);
  const barInView  = useInView(rootRef, { once: true, amount: 0.2 });
  const demoInView = useInView(rootRef, { once: false, amount: 0.35 });

  useEffect(() => { modeRef.current = mode; }, [mode]);

  const selectedKey = mode === "oem-by-cat" ? selectedCat : selectedOem;

  const handleSelect = useCallback((key: string) => {
    if (modeRef.current === "oem-by-cat") setSelectedCat(key);
    else setSelectedOem(key);
    setDropdownOpen(false);
  }, []);

  const handleSwitchAxes = useCallback(() => {
    setMode((m) => (m === "oem-by-cat" ? "cat-by-oem" : "oem-by-cat"));
    setDropdownOpen(false);
  }, []);

  const { demoHighlightKey, onUserInteraction } = useDataExplorerAutoDemo({
    inView: demoInView,
    mode,
    selectedKey,
    getItemKeys: itemKeysForMode,
    setDropdownOpen,
    onSelect: handleSelect,
    onSwitchAxes: handleSwitchAxes,
  });

  const bars: Bar[] = (mode === "oem-by-cat"
    ? OEMS.map((o) => ({ key: o.key, label: o.label, pct: DATA_MATRIX[o.key]?.[selectedCat] ?? 0, color: TEAL,    logoFile: o.logoFile }))
    : CATEGORIES.map((c) => ({ key: c.key, label: c.label, pct: DATA_MATRIX[selectedOem]?.[c.key] ?? 0, color: c.color }))
  ).sort((a, b) => b.pct - a.pct);

  const chartKey   = `${mode}-${mode === "oem-by-cat" ? selectedCat : selectedOem}`;
  const currentCat = CATEGORIES.find((c) => c.key === selectedCat);
  const currentOem = OEMS.find((o) => o.key === selectedOem);
  const yLabel     = mode === "oem-by-cat" ? (currentCat?.label ?? selectedCat) : (currentOem?.label ?? selectedOem);
  const statusLine = mode === "oem-by-cat"
    ? `${currentCat?.count ?? ""} category-relevant data items · OEM distribution for ${currentCat?.label ?? selectedCat}`
    : `Category distribution for ${currentOem?.label ?? selectedOem}`;

  const dropdownItems = mode === "oem-by-cat"
    ? CATEGORIES.map((c) => ({ key: c.key, label: c.label, dot: c.color }))
    : OEMS.map((o) => ({ key: o.key, label: o.label, dot: OEM_DOT }));

  return (
    <div
      ref={rootRef}
      className="absolute inset-0 flex flex-col bg-surface text-fg"
      style={{ overflow: "clip" } as React.CSSProperties}
      onMouseEnter={onUserInteraction}
      onClick={() => dropdownOpen && setDropdownOpen(false)}
    >
      {/* ── Title bar ────────────────────────────────────────────────────────── */}
      <div className="flex shrink-0 items-center gap-2.5 border-b border-border/50 px-5 py-3.5">
        <span className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-emerald-400" />
        <span className="truncate font-mono text-[10px] text-fg-subtle">{statusLine}</span>
      </div>

      {/* ── Chart body ───────────────────────────────────────────────────────── */}
      <div className="relative flex min-h-0 flex-1 px-3 pb-5 pt-4">

        {/* Y-axis label — overflow: clip on the container prevents the rotated
            button text from bleeding outside the 28 px column */}
        <div
          className="relative flex w-7 shrink-0 items-center justify-center"
          style={{ overflow: "clip" } as React.CSSProperties}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onUserInteraction();
              setDropdownOpen((v) => !v);
            }}
            style={{ writingMode: "vertical-lr", transform: "rotate(180deg)", whiteSpace: "nowrap" }}
            className="select-none rounded px-0.5 font-mono text-xs font-semibold text-brand transition-colors hover:text-brand/60"
          >
            {yLabel}
          </button>

          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 4 }}
                transition={{ duration: 0.13 }}
                onClick={(e) => e.stopPropagation()}
                className="absolute left-8 top-1/2 z-50 max-h-60 min-w-[230px] -translate-y-1/2 overflow-y-auto rounded-xl border border-border bg-surface shadow-2xl"
              >
                {dropdownItems.map((item) => {
                  const isSelected = item.key === selectedKey;
                  const isDemoHighlight = item.key === demoHighlightKey;

                  return (
                    <button
                      key={item.key}
                      onClick={() => {
                        onUserInteraction();
                        handleSelect(item.key);
                      }}
                      className={cn(
                        "flex w-full items-center gap-3 px-4 py-2.5 text-left text-[13px] transition-colors",
                        isSelected && "bg-blue-50 font-semibold text-fg",
                        !isSelected && !isDemoHighlight && "text-fg hover:bg-base",
                        isDemoHighlight && "bg-brand/10 font-semibold text-brand ring-1 ring-inset ring-brand/30",
                      )}
                    >
                      <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: item.dot }} />
                      {item.label}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Switch Axes button — absolute, bottom-left corner of the chart body */}
        <motion.button
          onClick={() => { onUserInteraction(); handleSwitchAxes(); }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.96 }}
          title="Switch axes"
          className="absolute bottom-4 left-6 z-10 flex h-11 w-11 items-center justify-center rounded-xl bg-white"
          style={{
            boxShadow:
              "0 4px 20px rgba(0,0,0,0.14), 0 1px 6px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.05)",
          }}
        >
          <ArrowUpDown className="h-[18px] w-[18px] text-fg-muted" />
        </motion.button>

        {/* ── Plot area ──────────────────────────────────────────────────────── */}
        <div className="relative min-h-0 flex-1">

          {/* BAR AREA */}
          <div className="absolute left-0 right-0 top-0" style={{ bottom: X_AXIS_H }}>

            {/* Y gridlines + tick labels */}
            {Y_TICKS.map((tick) => (
              <div
                key={tick}
                className="pointer-events-none absolute left-0 right-0 flex items-center"
                style={{ bottom: `${tick * SCALE}%` }}
              >
                <span className="shrink-0 pr-2 text-right font-mono text-[9px] text-fg-subtle" style={{ width: Y_TICK_W }}>
                  {tick > 0 ? `${tick}%` : ""}
                </span>
                <div className="flex-1 border-t border-border/35" />
              </div>
            ))}

            {/* Bar columns */}
            <div className="absolute bottom-0 top-0" style={{ left: Y_TICK_W, right: 0 }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={chartKey}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="flex h-full gap-1.5"
                >
                  {bars.map((bar, i) => {
                    const barH  = bar.pct * SCALE;
                    const isHov = hoveredBar === bar.key;

                    return (
                      <div
                        key={bar.key}
                        className="flex flex-1 flex-col"
                        onMouseEnter={() => setHoveredBar(bar.key)}
                        onMouseLeave={() => setHoveredBar(null)}
                      >
                        <div className="relative flex min-h-0 flex-1 flex-col items-center justify-end pb-0.5">
                          {isHov && (
                            <motion.div
                              initial={{ opacity: 0, y: -3 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.12 }}
                              className="pointer-events-none absolute top-2 z-30 -translate-x-1/2 whitespace-nowrap rounded-lg border border-border bg-surface px-2.5 py-1.5 shadow-lg"
                              style={{ left: "50%" }}
                            >
                              <p className="text-[10px] font-semibold text-fg">{bar.label}</p>
                              <p className="text-[9px] text-fg-muted">{bar.pct.toFixed(1)}% coverage</p>
                            </motion.div>
                          )}

                          {bar.logoFile && (
                            <img
                              src={`${import.meta.env.BASE_URL}${bar.logoFile}`}
                              alt={bar.label}
                              className="mb-0.5 h-[20px] w-[28px] object-contain sm:h-[32px] sm:w-[44px]"
                              draggable={false}
                            />
                          )}

                          <span className="shrink-0 font-mono text-[9px] text-fg-muted">
                            {bar.pct.toFixed(1)}%
                          </span>
                        </div>

                        <div
                          className="relative shrink-0"
                          style={{ height: `${Math.max(barH, 0.3)}%` }}
                        >
                          <motion.div
                            className="absolute bottom-0 rounded-t-[3px]"
                            style={{
                              left: "22%",
                              right: "22%",
                              height: "100%",
                              backgroundColor: bar.color,
                              transformOrigin: "bottom",
                            }}
                            initial={{ scaleY: 0 }}
                            animate={{ scaleY: barInView ? 1 : 0 }}
                            exit={{ scaleY: 0, transition: { duration: 0.2 } }}
                            transition={{ duration: 0.65, ease: EASE, delay: barInView ? 0.06 + i * 0.045 : 0 }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* X-AXIS: angled names */}
          <div className="absolute bottom-0" style={{ left: Y_TICK_W, right: 0, height: X_AXIS_H }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={`xl-${chartKey}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18, delay: 0.12 }}
                className="flex h-full gap-1.5"
              >
                {bars.map((bar) => (
                  <div key={bar.key} className="relative flex-1">
                    <div style={{ position: "absolute", left: "50%", top: 4, width: 0 }}>
                      <span
                        style={{
                          position: "absolute",
                          right: 0,
                          top: 0,
                          whiteSpace: "nowrap",
                          transform: "rotate(-40deg)",
                          transformOrigin: "100% 0",
                        }}
                        className="font-mono text-[10px] text-fg-muted"
                      >
                        {bar.label}
                      </span>
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
