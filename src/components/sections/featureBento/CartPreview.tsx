import { memo, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { ShoppingCart, X, Check, Clock } from "lucide-react";
import { cn } from "../../../lib/utils";
import { CART_ITEMS, ITEM_ACCENT_COLORS, CONFETTI_ANGLES, CONFETTI_COLORS } from "./constants";

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


export const CartPreview = memo(function CartPreview() {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, margin: "-40px" });
  const [items,   setItems]   = useState<(typeof CART_ITEMS)[number][]>([...CART_ITEMS]);
  const [tab,     setTab]     = useState<"requests" | "orders">("requests");
  const [ordered, setOrdered] = useState(false);

  useEffect(() => {
    if (!inView) return;
    const t1 = setTimeout(() => setItems(p => p.slice(0, -1)), 4200);
    const t2 = setTimeout(() => setItems([...CART_ITEMS]), 6500);
    const t3 = setTimeout(() => { setOrdered(true); setItems([]); }, 10500);
    const t4 = setTimeout(() => { setOrdered(false); setTab("orders"); }, 13000);
    const t5 = setTimeout(() => { setTab("requests"); setItems([...CART_ITEMS]); }, 17000);
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
});