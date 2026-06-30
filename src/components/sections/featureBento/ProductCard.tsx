import { memo } from "react";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { cn } from "../../../lib/utils";
import { EASE_PREMIUM } from "../../../lib/motion";
import type { DataItem } from "../../../data/catalog";
import { CatalogHighlight } from "./CatalogHighlight";

export const ProductCard = memo(function ProductCard({
  title, status, type, suppliers, description, Icon, delay, query = "", highlightOn = false,
  compact = false,
}: Omit<DataItem, "id" | "category"> & { delay: number; query?: string; highlightOn?: boolean; compact?: boolean }) {
  const typeLabels = type.split(" + ") as ("B2B" | "B2C")[];
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.34, ease: EASE_PREMIUM }}
      className={cn(
        "flex h-full min-h-0 flex-col rounded-xl border border-border bg-base",
        compact ? "p-3" : "p-3 sm:p-5",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className={cn(
          "font-bold leading-snug text-fg",
          compact ? "text-[13px] leading-[1.25]" : "text-[15px]",
        )}>
          <CatalogHighlight text={title} query={query} on={highlightOn} />
        </p>
        <span className={cn("mt-0.5 shrink-0 rounded-md bg-brand-subtle", compact ? "p-1.5" : "p-2")}>
          <Icon className={cn("text-brand", compact ? "h-4 w-4" : "h-5 w-5")} />
        </span>
      </div>

      <div className={cn("flex flex-wrap items-center", compact ? "mt-2 gap-1" : "mt-3 gap-1.5")}>
        <span
          className={cn(
            "rounded-full font-bold uppercase tracking-wide",
            compact ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-[11px]",
            status === "AVAILABLE" ? "bg-green-500/15 text-green-500" : "bg-yellow-500/15 text-yellow-500",
          )}
        >
          ● {status}
        </span>
        {typeLabels.map((t) => (
          <span
            key={t}
            className={cn(
              "rounded-full font-semibold",
              compact ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-[11px]",
              t === "B2B" ? "bg-blue-500/15 text-blue-500" : "bg-orange-500/15 text-orange-500",
            )}
          >
            {t}
          </span>
        ))}
      </div>

      <p className={cn(
        "text-fg-muted",
        compact
          ? "mt-2 shrink-0 line-clamp-3 text-[11px] leading-[1.45]"
          : "mt-3 shrink-0 line-clamp-4 text-[13px] leading-relaxed",
      )}>
        <CatalogHighlight text={description} query={query} on={highlightOn} />
      </p>

      {/* Monitor: flexible gap — grows with cell height, min spacing on small tiles */}
      {compact && <div className="min-h-3 flex-1 shrink" aria-hidden />}

      <div className={cn(
        "flex shrink-0 items-end justify-between gap-1",
        compact ? "mt-1" : "mt-auto pt-3",
      )}>
        <div className={cn("flex flex-wrap", compact ? "gap-1" : "gap-1.5")}>
          {suppliers.slice(0, 2).map((s) => (
            <span
              key={s}
              className={cn(
                "rounded border border-border font-mono uppercase tracking-wide text-fg-subtle",
                compact ? "px-1.5 py-0.5 text-[9px]" : "px-2 py-1 text-[11px]",
              )}
            >
              {s}
            </span>
          ))}
        </div>
        <ShoppingCart className={cn("shrink-0", compact ? "h-4 w-4 text-fg/75" : "h-5 w-5 text-brand/50")} />
      </div>
    </motion.div>
  );
});
