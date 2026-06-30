import { useState, useRef, useCallback, useMemo, memo } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { ArrowUpDown, ChevronDown } from "lucide-react";
import { cn } from "../../lib/utils";
import { useLatestRef } from "../../hooks/useLatestRef";
import { useElementWidth } from "../../hooks/useElementWidth";
import { useDataExplorerAutoDemo } from "../../hooks/useDataExplorerAutoDemo";
import {
  EXPLORER_Y_TICKS,
  buildPreviewExplorerBars,
  explorerItemKeysForMode,
  randomPreviewExplorerMode,
  type PreviewExplorerBar,
  type PreviewExplorerMode,
} from "../../lib/explorerChart";
import { CATEGORIES, OEMS } from "../../data/explorerData";
import { EASE_EXPLORER } from "../../lib/motion";

// ── Constants ─────────────────────────────────────────────────────────────────
const SCALE        = 0.86;
const X_AXIS_H     = 96;  // desktop: space below bars for angled labels
const Y_TICK_W     = 40;
const TEAL     = "#22d3ee";
const OEM_DOT  = "#3b82f6";

type Bar = PreviewExplorerBar;

const PreviewChartBar = memo(function PreviewChartBar({
  bar,
  barH,
  barInView,
  index,
}: {
  bar: Bar;
  barH: number;
  barInView: boolean;
  index: number;
}) {
  const [isHov, setIsHov] = useState(false);

  return (
    <div
      className="flex flex-1 flex-col"
      onMouseEnter={() => setIsHov(true)}
      onMouseLeave={() => setIsHov(false)}
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
          transition={{ duration: 0.65, ease: EASE_EXPLORER, delay: barInView ? 0.06 + index * 0.045 : 0 }}
        />
      </div>
    </div>
  );
});

// ── Component ─────────────────────────────────────────────────────────────────
export function DataExplorerPreview() {
  const [mode, setMode]                 = useState<PreviewExplorerMode>(randomPreviewExplorerMode);
  const [selectedCat, setSelectedCat]   = useState("maintenance_diag");
  const [selectedOem, setSelectedOem]   = useState("ford");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const modeRef = useLatestRef(mode);
  const barInView  = useInView(rootRef, { once: true, amount: 0.2 });
  const demoInView = useInView(rootRef, { once: false, amount: 0.35 });

  // On narrow containers: show a scrollable chip legend above the bars instead
  // of angled x-axis labels below — labels are too crowded at <480px width.
  const containerW = useElementWidth(rootRef);
  const isMobile   = containerW > 0 && containerW < 480;
  const xAxisH     = isMobile ? 0 : X_AXIS_H;

  const selectedKey = mode === "oem-by-cat" ? selectedCat : selectedOem;

  const handleSelect = useCallback((key: string) => {
    if (modeRef.current === "oem-by-cat") setSelectedCat(key);
    else setSelectedOem(key);
    setDropdownOpen(false);
  }, [modeRef]);

  const handleSwitchAxes = useCallback(() => {
    setMode((m) => (m === "oem-by-cat" ? "cat-by-oem" : "oem-by-cat"));
    setDropdownOpen(false);
  }, []);

  const { demoHighlightKey, onUserInteraction } = useDataExplorerAutoDemo({
    inView: demoInView,
    mode,
    selectedKey,
    getItemKeys: explorerItemKeysForMode,
    setDropdownOpen,
    onSelect: handleSelect,
    onSwitchAxes: handleSwitchAxes,
  });

  const bars = useMemo(
    () => buildPreviewExplorerBars(mode, selectedCat, selectedOem, TEAL),
    [mode, selectedCat, selectedOem],
  );

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

      {/* ── Mobile control bar: dropdown + switch (replaces left Y-label on narrow containers) */}
      {isMobile && (
        <div className="relative flex shrink-0 items-center justify-end gap-2 border-b border-border/40 px-3 py-2">
          {/* Selector dropdown button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onUserInteraction();
              setDropdownOpen((v) => !v);
            }}
            className="flex min-w-0 items-center gap-1.5 rounded-lg border border-border bg-base px-2.5 py-1.5 font-mono text-[11px] font-semibold text-brand transition-colors active:opacity-70"
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={yLabel}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="max-w-[160px] truncate"
              >
                {yLabel}
              </motion.span>
            </AnimatePresence>
            <ChevronDown className="h-3 w-3 shrink-0 opacity-60" />
          </button>

          {/* Switch axes button */}
          <button
            onClick={() => { onUserInteraction(); handleSwitchAxes(); }}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-base transition-colors active:opacity-70"
            title="Switch axes"
          >
            <ArrowUpDown className="h-3.5 w-3.5 text-fg-muted" />
          </button>

          {/* Dropdown list — anchored to the control bar */}
          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -4 }}
                transition={{ duration: 0.13 }}
                onClick={(e) => e.stopPropagation()}
                className="absolute right-3 top-full z-50 mt-1 max-h-56 min-w-[200px] overflow-y-auto rounded-xl border border-border bg-surface shadow-2xl [scrollbar-width:thin]"
              >
                {dropdownItems.map((item) => {
                  const isSelected     = item.key === selectedKey;
                  const isDemoHighlight = item.key === demoHighlightKey;
                  return (
                    <button
                      key={item.key}
                      onClick={() => { onUserInteraction(); handleSelect(item.key); }}
                      className={cn(
                        "flex w-full items-center gap-2.5 px-3 py-2 text-left text-[12px] transition-colors",
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
      )}

      {/* ── Chart body ───────────────────────────────────────────────────────── */}
      <div className="relative flex min-h-0 flex-1 px-3 pb-5 pt-4">

        {/* Y-axis column — desktop only; the rotated label IS the dropdown trigger */}
        {!isMobile && (
          <div
            className="flex w-7 shrink-0 items-center justify-center"
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
              <AnimatePresence mode="wait">
                <motion.span
                  key={yLabel}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {yLabel}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        )}

        {/* Desktop dropdown — lives OUTSIDE the overflow:clip Y-axis column,
            anchored to the chart body so it's never clipped. Opens to the right
            of the Y-axis label, vertically centered in the chart area. */}
        {!isMobile && (
          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, x: -6 }}
                animate={{ opacity: 1, scale: 1,    x: 0  }}
                exit={{    opacity: 0, scale: 0.95, x: -6 }}
                transition={{ duration: 0.15 }}
                style={{ transformOrigin: "left center" }}
                onClick={(e) => e.stopPropagation()}
                className="absolute left-10 top-1/2 z-50 max-h-64 min-w-[230px] -translate-y-1/2 overflow-y-auto rounded-xl border border-border bg-surface shadow-2xl [scrollbar-width:thin]"
              >
                {dropdownItems.map((item) => {
                  const isSelected      = item.key === selectedKey;
                  const isDemoHighlight = item.key === demoHighlightKey;
                  return (
                    <button
                      key={item.key}
                      onClick={() => { onUserInteraction(); handleSelect(item.key); }}
                      className={cn(
                        "flex w-full items-center gap-3 px-4 py-2.5 text-left text-[13px] transition-colors",
                        isSelected      && "bg-blue-50 font-semibold text-fg",
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
        )}

        {/* Switch Axes button — desktop only (absolute, bottom-left); mobile has it in control bar */}
        {!isMobile && (
          <motion.button
            onClick={() => { onUserInteraction(); handleSwitchAxes(); }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.96 }}
            title="Switch axes"
            className="absolute bottom-4 left-6 z-10 flex h-11 w-11 items-center justify-center rounded-xl bg-white"
            style={{
              boxShadow: "0 4px 20px rgba(0,0,0,0.14), 0 1px 6px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.05)",
            }}
          >
            <ArrowUpDown className="h-[18px] w-[18px] text-fg-muted" />
          </motion.button>
        )}

        {/* ── Plot area ──────────────────────────────────────────────────────── */}
        <div className="relative min-h-0 flex-1">

          {/* BAR AREA */}
          <div className="absolute left-0 right-0 top-0" style={{ bottom: xAxisH }}>

            {/* Y gridlines + tick labels */}
            {EXPLORER_Y_TICKS.map((tick) => (
              <div
                key={tick}
                className="pointer-events-none absolute left-0 right-0 flex items-center"
                style={{ bottom: `${tick * SCALE}%` }}
              >
                {/* Hide tick label text on mobile to avoid overlap with bars */}
                {!isMobile && (
                  <span className="shrink-0 pr-2 text-right font-mono text-[9px] text-fg-subtle" style={{ width: Y_TICK_W }}>
                    {tick > 0 ? `${tick}%` : ""}
                  </span>
                )}
                <div className="flex-1 border-t border-border/35" />
              </div>
            ))}

            {/* Bar columns — full width on mobile (no Y_TICK_W offset) */}
            <div
              className="absolute bottom-0 top-0"
              style={{ left: isMobile ? 0 : Y_TICK_W, right: 0 }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={chartKey}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="flex h-full gap-1.5"
                >
                  {bars.map((bar, i) => (
                    <PreviewChartBar
                      key={bar.key}
                      bar={bar}
                      barH={bar.pct * SCALE}
                      barInView={barInView}
                      index={i}
                    />
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* X-AXIS: angled names — desktop only */}
          {!isMobile && (
            <div className="absolute bottom-0" style={{ left: Y_TICK_W, right: 0, height: xAxisH }}>
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
          )}
        </div>
      </div>
    </div>
  );
}
