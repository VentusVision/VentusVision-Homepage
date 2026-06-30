import { motion, AnimatePresence, useInView } from "framer-motion";
import { useCallback, useRef, useState } from "react";
import { Search, BarChart3, Globe } from "lucide-react";
import { CatalogPreview } from "../sections/FeatureBentoGrid";
import { DataExplorerPreview } from "./DataExplorerPreview";
import { MapPreview } from "./MapPreview";
import { useElementWidth } from "../../hooks/useElementWidth";
import { useIntervalWhen } from "../../hooks/useIntervalWhen";
import { EASE_PREMIUM } from "../../lib/motion";

const TABS = [
  { id: "catalog",  label: "Data Catalog",  color: "#2563EB", Icon: Search    },
  { id: "explorer", label: "Data Explorer", color: "#a855f7", Icon: BarChart3 },
  { id: "map",      label: "Map Explorer",  color: "#06B6D4", Icon: Globe     },
] as const;

const TAB_DURATION = 6000;

const DESIGN_W = 1200;
const DESIGN_H = 675; // 16:9

// Renders children at native size then CSS-shrinks to fill the container exactly.
function ScaledPreview({ children, scale }: { children: React.ReactNode; scale: number }) {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <div
        className="absolute left-0 top-0 origin-top-left"
        style={{
          transform: `scale(${scale})`,
          width:  `${100 / scale}%`,
          height: `${100 / scale}%`,
        }}
      >
        {children}
      </div>
    </div>
  );
}

export function HeroTripleDash() {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px 0px" });
  const [tabIdx, setTabIdx] = useState(0);
  const containerWidth = useElementWidth(ref);
  const isMobile = containerWidth > 0 && containerWidth < 640;
  const scale = containerWidth > 0 ? containerWidth / DESIGN_W : 1;

  useIntervalWhen(
    () => setTabIdx(i => (i + 1) % TABS.length),
    TAB_DURATION,
    inView,
  );

  const handleTabClick = useCallback((index: number) => {
    setTabIdx(index);
  }, []);

  const activeTab = TABS[tabIdx];

  /* ── Mobile: native-size previews (no scaling), just like the sections below ── */
  if (isMobile) {
    return (
      <div ref={ref} className="flex h-full flex-col overflow-hidden bg-base text-fg">
        {/* Tab bar — compact */}
        <div className="shrink-0 border-b border-border bg-surface">
          <div className="flex">
            {TABS.map((tab, i) => {
              const isActive = i === tabIdx;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(i)}
                  className="relative flex flex-1 items-center justify-center gap-1 px-1 py-2.5 transition-colors"
                >
                  <tab.Icon
                    className="h-3 w-3 shrink-0 transition-colors"
                    style={{ color: isActive ? tab.color : "rgba(15,23,42,0.28)" }}
                  />
                  <span
                    className="truncate text-[10px] font-semibold tracking-wide transition-colors"
                    style={{ color: isActive ? "rgba(15,23,42,0.9)" : "rgba(15,23,42,0.35)" }}
                  >
                    {tab.label}
                  </span>
                  {isActive && (
                    <motion.span
                      layoutId="tab-underline-m"
                      className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full"
                      style={{ backgroundColor: tab.color }}
                      transition={{ duration: 0.3, ease: EASE_PREMIUM }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Auto-advance progress bar */}
          <div className="h-[2px] overflow-hidden bg-border">
            <motion.div
              key={tabIdx}
              className="h-full w-full rounded-full"
              style={{ backgroundColor: activeTab.color + "80", transformOrigin: "left center" }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: TAB_DURATION / 1000, ease: "linear" }}
            />
          </div>
        </div>

        {/* Native-size preview — no ScaledPreview wrapper */}
        <div className="min-h-0 flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={tabIdx}
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -18 }}
              transition={{ duration: 0.26, ease: EASE_PREMIUM }}
              className="h-full"
            >
              {tabIdx === 0 && <CatalogPreview />}
              {tabIdx === 1 && <DataExplorerPreview />}
              {tabIdx === 2 && <MapPreview />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-border bg-surface px-3 py-1.5">
          <div className="flex items-center">
            <span className="text-[9px] text-fg-subtle">3 products · 1 platform · 500+ data items</span>
            <div className="ml-auto flex items-center gap-1.5">
              {TABS.map((t, i) => (
                <motion.span
                  key={t.id}
                  animate={{ opacity: i === tabIdx ? 1 : 0.22, scale: i === tabIdx ? 1 : 0.75 }}
                  transition={{ duration: 0.3 }}
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: t.color }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Desktop: existing scaled approach ── */
  return (
    <div ref={ref} className="h-full w-full overflow-hidden">
      <div
        className="flex flex-col overflow-hidden bg-base text-fg"
        style={{ transform: `scale(${scale})`, transformOrigin: "top left", width: DESIGN_W, height: DESIGN_H }}
      >

      {/* ── Tab bar ── */}
      <div className="shrink-0 border-b border-border bg-surface">
        <div className="flex">
          {TABS.map((tab, i) => {
            const isActive = i === tabIdx;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(i)}
                className="relative flex flex-1 items-center justify-center gap-2.5 px-6 py-4 transition-colors"
              >
                <tab.Icon
                  className="h-4 w-4 shrink-0 transition-colors"
                  style={{ color: isActive ? tab.color : "rgba(15,23,42,0.28)" }}
                />
                <span
                  className="text-sm font-semibold tracking-wide transition-colors"
                  style={{ color: isActive ? "rgba(15,23,42,0.9)" : "rgba(15,23,42,0.35)" }}
                >
                  {tab.label}
                </span>
                {isActive && (
                  <motion.span
                    layoutId="tab-underline"
                    className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full"
                    style={{ backgroundColor: tab.color }}
                    transition={{ duration: 0.3, ease: EASE_PREMIUM }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Auto-advance progress bar */}
        <div className="h-[3px] overflow-hidden bg-border">
          <motion.div
            key={tabIdx}
            className="h-full w-full rounded-full"
            style={{ backgroundColor: activeTab.color + "80", transformOrigin: "left center" }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: TAB_DURATION / 1000, ease: "linear" }}
          />
        </div>
      </div>

      {/* ── Content ── */}
      <div className="min-h-0 flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={tabIdx}
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -18 }}
            transition={{ duration: 0.26, ease: EASE_PREMIUM }}
            className="h-full"
          >
            {tabIdx === 0 && <ScaledPreview scale={1.0}><CatalogPreview preview /></ScaledPreview>}
            {tabIdx === 1 && <ScaledPreview scale={1.0}><DataExplorerPreview /></ScaledPreview>}
            {tabIdx === 2 && <ScaledPreview scale={1.0}><MapPreview /></ScaledPreview>}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Footer ── */}
      <div className="shrink-0 border-t border-border bg-surface px-6 py-2.5">
        <div className="flex items-center">
          <span className="text-xs text-fg-subtle">
            3 products · 1 platform · 500+ data items
          </span>
          <div className="ml-auto flex items-center gap-2">
            {TABS.map((t, i) => (
              <motion.span
                key={t.id}
                animate={{ opacity: i === tabIdx ? 1 : 0.22, scale: i === tabIdx ? 1 : 0.75 }}
                transition={{ duration: 0.3 }}
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: t.color }}
              />
            ))}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
