import { memo, useRef, useState, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Search, ArrowUpDown, SlidersHorizontal, ChevronDown } from "lucide-react";
import { cn } from "../../../lib/utils";
import { useCatalogFilter, SORT_OPTIONS } from "../../../hooks/useCatalogFilter";
import { useAutoDemo } from "../../../hooks/useAutoDemo";
import { CATALOG_ITEMS, CATALOG_CATEGORIES, CATALOG_PREVIEW_ITEMS } from "../../../data/catalog";
import { LiveTicker } from "./LiveTicker";
import { ProductCard } from "./ProductCard";
import { useElementWidth } from "../../../hooks/useElementWidth";

export const CatalogPreview = memo(function CatalogPreview({
  preview = false,
  monitorMode = false,
}: {
  preview?: boolean;
  /** When true: disables the heavy 75ms-tick typing demo and runs a lightweight
   *  category-cycling loop instead. Cuts re-renders from ~13/sec to 1 per 3 s. */
  monitorMode?: boolean;
}) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, margin: "-60px" });

  const containerW  = useElementWidth(ref);
  const isMobile    = containerW > 0 && containerW < 480;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { query, setQuery, debouncedQ, selectedCat, setSelectedCat, sortBy, setSortBy, highlightOn, filtered } =
    useCatalogFilter(CATALOG_ITEMS);

  // In monitorMode pass inView=false to disable the typing-heavy auto-demo.
  useAutoDemo(monitorMode ? false : inView, setQuery, setSelectedCat, setSortBy);

  // monitorMode: simple category cycling — 1 render per 3 s instead of 13+/s.
  useEffect(() => {
    if (!monitorMode || !inView) return;
    const cats: Array<string | null> = [null, ...CATALOG_CATEGORIES.slice(0, 5)];
    let i = 0;
    const id = setInterval(() => {
      i = (i + 1) % cats.length;
      setSelectedCat(cats[i]);
    }, 3000);
    return () => clearInterval(id);
  }, [monitorMode, inView, setSelectedCat]);

  // On mobile: auto-open the dropdown when a category is selected by the demo
  useEffect(() => {
    if (!isMobile) return;
    if (dropTimerRef.current) clearTimeout(dropTimerRef.current);
    if (selectedCat !== null) {
      setDropdownOpen(true);
      dropTimerRef.current = setTimeout(() => setDropdownOpen(false), 2200);
    } else {
      setDropdownOpen(false);
    }
    return () => { if (dropTimerRef.current) clearTimeout(dropTimerRef.current); };
  }, [selectedCat, isMobile]);

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
          <span className="hidden rounded-full border border-border px-3 py-1 text-[12px] text-fg-muted sm:inline">CSV</span>
          <span className={cn(
            "hidden rounded-full px-3.5 py-1 text-[12px] font-semibold sm:inline",
            highlightOn ? "bg-cyan-500/75 text-white" : "border border-border text-fg-muted"
          )}>
            Highlighting
          </span>
        </div>
      </div>

      {preview ? (
        /* Monitor grid — 2×3 on mobile, 3×3 on desktop */
        <div className="min-h-0 flex-1 overflow-hidden px-3 pb-3 pt-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${debouncedQ}-${selectedCat}-${sortBy}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className={cn(
                "grid h-full min-h-0 gap-2",
                isMobile ? "grid-cols-2 grid-rows-2" : "grid-cols-3 grid-rows-3"
              )}
            >
              {(filtered.length > 0 ? filtered : CATALOG_PREVIEW_ITEMS).slice(0, isMobile ? 4 : 9).map((item, i) => (
                <ProductCard
                  key={item.id}
                  {...item}
                  compact
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
          {/* ── Category pills (desktop) / dropdown (mobile) ── */}
          {isMobile ? (
            <div className="relative shrink-0 border-b border-border px-4 py-2.5">
              <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.18em] text-fg-subtle">
                Categories
              </span>
              {/* Dropdown button */}
              <div className="relative">
                <div className="flex items-center justify-between rounded-xl border border-border bg-base px-3 py-2 text-[13px] font-medium text-fg">
                  <span className="truncate" style={{ color: selectedCat ? "rgba(37,99,235,1)" : undefined }}>
                    {selectedCat ?? "All Categories"}
                  </span>
                  <motion.div animate={{ rotate: dropdownOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 text-fg-subtle" />
                  </motion.div>
                </div>

                {/* Dropdown list */}
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, scaleY: 0.92, y: -4 }}
                      animate={{ opacity: 1, scaleY: 1,    y: 0  }}
                      exit={{    opacity: 0, scaleY: 0.92, y: -4 }}
                      transition={{ duration: 0.16 }}
                      style={{ transformOrigin: "top" }}
                      className="absolute left-0 right-0 top-full z-20 mt-1 max-h-56 overflow-y-auto rounded-xl border border-border bg-surface shadow-lg [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                    >
                      {[null, ...CATALOG_CATEGORIES].map((cat) => (
                        <div
                          key={cat ?? "all"}
                          className={cn(
                            "px-3 py-2 text-[12px] transition-colors",
                            selectedCat === cat
                              ? "bg-brand/8 font-semibold text-brand"
                              : "text-fg-muted",
                          )}
                        >
                          {cat ?? "All Categories"}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ) : (
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
          )}

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
                className="grid grid-cols-2 gap-2 sm:gap-3 2xl:grid-cols-3"
              >
                {filtered.map((item, i) => (
                  <div key={item.id} className="min-h-[160px] sm:min-h-[220px] lg:min-h-[240px]">
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
});