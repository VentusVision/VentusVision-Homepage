import { Fragment } from "react";
import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import { cn } from "../../../lib/utils";
import { VehicleBackground } from "../../ui/VehicleBackground";
import { LazyWhenVisible } from "../../ui/LazyWhenVisible";
import {
  BENTO_SHADOW, BENTO_HOVER_SHADOW, CARD_REVEAL, STAGGER,
  CATALOG_MOBILE_STATS, CATALOG_CHIPS,
  DETAIL_MOBILE_STATS, DETAIL_CHIPS,
  CART_MOBILE_STATS, CART_CHIPS,
} from "./constants";
import { MacOSBar } from "./MacOSBar";
import { CatalogPreview } from "./CatalogPreview";
import { DetailPreview } from "./DetailPreview";
import { CartPreview } from "./CartPreview";

// ── Shared styles ─────────────────────────────────────────────────────────────

const GRADIENT_TEXT: CSSProperties = {
  background: "linear-gradient(to right, #2563EB, #06B6D4)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
};

const HOVER_SPRING = { type: "spring", stiffness: 260, damping: 22 } as const;

// ── BentoCardHeader ───────────────────────────────────────────────────────────

interface StatItem { value: string; label: string }

interface BentoCardHeaderProps {
  size?: "large" | "small";
  badge: string;
  mobileStats: readonly StatItem[];
  titleLeft: string;
  titleGradient: string;
  description: string;
  chips: readonly StatItem[];
}

function BentoCardHeader({
  size = "large",
  badge,
  mobileStats,
  titleLeft,
  titleGradient,
  description,
  chips,
}: BentoCardHeaderProps) {
  const lg = size === "large";
  return (
    <>
      <div className={cn("shrink-0", lg ? "px-6 pt-5" : "px-5 pt-4")}>
        <div className={cn("flex flex-col sm:flex-row sm:items-start sm:justify-between", lg ? "gap-4" : "gap-3")}>
          <div>
            <div className="flex items-center justify-between gap-2 sm:block">
              <span className="inline-flex items-center gap-2 rounded-full border border-brand/25 bg-brand-subtle px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-brand">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand" />
                {badge}
              </span>
              <div className="flex items-center gap-1 sm:hidden">
                {mobileStats.map(({ value, label }, i) => (
                  <Fragment key={label}>
                    {i > 0 && <span className="px-0.5 text-[9px] text-fg-subtle">·</span>}
                    <span className="text-[12px] font-extrabold text-brand">{value}</span>
                    <span className="text-[9px] text-fg-subtle">{label}</span>
                  </Fragment>
                ))}
              </div>
            </div>
            <h3 className={cn("font-extrabold tracking-tight text-fg", lg ? "mt-3 text-2xl" : "mt-2.5 text-xl")}>
              {titleLeft}{" "}
              <span style={GRADIENT_TEXT}>{titleGradient}</span>
            </h3>
            <p className={cn("text-fg-muted", lg ? "mt-1 text-[12px]" : "mt-0.5 text-[11px]")}>
              {description}
            </p>
          </div>
          <div className={cn("hidden shrink-0 flex-col sm:flex", lg ? "gap-2 pt-1" : "gap-1.5 pt-0.5")}>
            {chips.map(({ value, label }) => (
              <div key={label} className="flex items-center gap-2 rounded-xl border border-border bg-base px-3 py-1.5 shadow-sm">
                <span className={cn("font-extrabold text-brand", lg ? "text-[15px]" : "text-[13px]")}>{value}</span>
                <span className="text-[10px] text-fg-muted">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={cn("h-px shrink-0 bg-gradient-to-r from-brand/20 via-border to-transparent", lg ? "mx-6 mt-4" : "mx-5 mt-3")} />
    </>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────

export function FeatureBentoGrid() {
  return (
    <section id="catalog" className="relative overflow-hidden bg-base px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
      <VehicleBackground iconOpacity={0.15} laneOpacity={0.15} laneSpeed={34} floatAmplitude={13} />
      <div className="relative z-[1] mx-auto max-w-[1560px]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
          className="mb-10 max-w-2xl sm:mb-16"
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
          className="grid grid-cols-1 gap-6 lg:h-[1260px] lg:grid-cols-[1fr_340px] lg:grid-rows-2"
        >
          {/* ── Product Catalog (col-span-1, row-span-2) ── */}
          <motion.div
            variants={CARD_REVEAL}
            whileHover={{ y: -3, boxShadow: BENTO_HOVER_SHADOW }}
            transition={HOVER_SPRING}
            style={{ boxShadow: BENTO_SHADOW }}
            className="relative flex h-[800px] flex-col overflow-hidden rounded-3xl border border-brand/25 bg-surface lg:col-span-1 lg:h-auto lg:row-span-2"
          >
            <MacOSBar label="caruso · data-catalog" />
            <div className="pointer-events-none absolute -right-24 top-8 h-72 w-72 rounded-full bg-cyan-400/8 blur-[80px]" />
            <div className="pointer-events-none absolute -left-16 top-8 h-48 w-48 rounded-full bg-brand/5 blur-[60px]" />
            <BentoCardHeader
              size="large"
              badge="Data Catalog"
              mobileStats={CATALOG_MOBILE_STATS}
              titleLeft="Discover &"
              titleGradient="Filter"
              description="Fuzzy full-text search · 433+ Data Items · B2B API"
              chips={CATALOG_CHIPS}
            />
            <div className="min-h-0 flex-1 overflow-hidden">
              <LazyWhenVisible className="h-full">
                <CatalogPreview />
              </LazyWhenVisible>
            </div>
          </motion.div>

          {/* ── Item Detail (col-span-1, row-span-1) ── */}
          <motion.div
            variants={CARD_REVEAL}
            whileHover={{ y: -3, boxShadow: BENTO_HOVER_SHADOW }}
            transition={HOVER_SPRING}
            style={{ boxShadow: BENTO_SHADOW }}
            className="relative flex h-[680px] flex-col overflow-hidden rounded-3xl border border-brand/25 bg-surface lg:col-span-1 lg:h-auto lg:row-span-1"
          >
            <MacOSBar label="caruso · item-detail" />
            <div className="pointer-events-none absolute -left-12 top-8 h-48 w-48 rounded-full bg-blue-400/8 blur-[60px]" />
            <BentoCardHeader
              size="small"
              badge="Item Detail"
              mobileStats={DETAIL_MOBILE_STATS}
              titleLeft="OEM"
              titleGradient="Deep-Dive"
              description="Specs card · JSON Schema · Attributes"
              chips={DETAIL_CHIPS}
            />
            <div className="min-h-0 flex-1 overflow-hidden">
              <LazyWhenVisible className="h-full">
                <DetailPreview />
              </LazyWhenVisible>
            </div>
          </motion.div>

          {/* ── Shopping Cart (col-span-1, row-span-1) ── */}
          <motion.div
            variants={CARD_REVEAL}
            whileHover={{ y: -3, boxShadow: BENTO_HOVER_SHADOW }}
            transition={HOVER_SPRING}
            style={{ boxShadow: BENTO_SHADOW }}
            className="relative flex h-[580px] flex-col overflow-hidden rounded-3xl border border-brand/25 bg-surface lg:col-span-1 lg:h-auto lg:row-span-1"
          >
            <MacOSBar label="caruso · shopping-cart" />
            <div className="pointer-events-none absolute -bottom-12 -right-12 h-48 w-48 rounded-full bg-purple-400/8 blur-[60px]" />
            <BentoCardHeader
              size="small"
              badge="Request System"
              mobileStats={CART_MOBILE_STATS}
              titleLeft="Shopping"
              titleGradient="Cart"
              description="UUID items · Order history · API access"
              chips={CART_CHIPS}
            />
            <div className="min-h-0 flex-1 overflow-hidden">
              <LazyWhenVisible className="h-full">
                <CartPreview />
              </LazyWhenVisible>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
