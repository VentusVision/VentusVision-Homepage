import { motion, AnimatePresence, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Search, BarChart3, Globe } from "lucide-react";
import { CatalogPreview } from "../sections/FeatureBentoGrid";
import { DataExplorerPreview } from "./DataExplorerPreview";
import { MapPreview } from "./MapPreview";
import { EASE_PREMIUM } from "../../lib/motion";

const TABS = [
  { id: "catalog",  label: "Data Catalog",  color: "#60a5fa", Icon: Search    },
  { id: "explorer", label: "Data Explorer", color: "#a855f7", Icon: BarChart3 },
  { id: "map",      label: "Map Explorer",  color: "#22d3ee", Icon: Globe     },
] as const;

const TAB_DURATION = 6000;

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

  useEffect(() => {
    if (!inView) return;
    const t = setInterval(() => setTabIdx(i => (i + 1) % TABS.length), TAB_DURATION);
    return () => clearInterval(t);
  }, [inView]);

  const activeTab = TABS[tabIdx];

  return (
    <div ref={ref} className="flex h-full w-full flex-col overflow-hidden text-white">

      {/* ── Tab bar ── */}
      <div className="shrink-0 border-b border-white/[0.06]">
        <div className="flex">
          {TABS.map((tab, i) => {
            const isActive = i === tabIdx;
            return (
              <button
                key={tab.id}
                onClick={() => setTabIdx(i)}
                className="relative flex flex-1 items-center justify-center gap-2.5 px-6 py-4 transition-colors"
              >
                <tab.Icon
                  className="h-4 w-4 shrink-0 transition-colors"
                  style={{ color: isActive ? tab.color : "rgba(255,255,255,0.25)" }}
                />
                <span
                  className="text-sm font-semibold tracking-wide transition-colors"
                  style={{ color: isActive ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.3)" }}
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
        <div className="h-[3px] overflow-hidden bg-white/[0.04]">
          <motion.div
            key={tabIdx}
            className="h-full rounded-full"
            style={{ backgroundColor: activeTab.color + "70" }}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
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
            {/* Scale up to fill the wider monitor — less shrinking than before */}
            {tabIdx === 0 && <ScaledPreview scale={0.88}><CatalogPreview /></ScaledPreview>}
            {tabIdx === 1 && <ScaledPreview scale={0.92}><DataExplorerPreview /></ScaledPreview>}
            {tabIdx === 2 && <ScaledPreview scale={0.88}><MapPreview /></ScaledPreview>}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Footer ── */}
      <div className="shrink-0 border-t border-white/[0.05] px-6 py-2.5">
        <div className="flex items-center">
          <span className="text-xs text-white/20">
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
  );
}
