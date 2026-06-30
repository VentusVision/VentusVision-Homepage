import { memo, useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Battery, ChevronLeft, Copy } from "lucide-react";
import { cn } from "../../../lib/utils";

type OEMChild = { abbr: string; name: string };

function OEMOrbitSVG({
  abbr, label, cx, cy, orbitR, color, duration, inView, children,
}: {
  abbr: string; label: string; cx: number; cy: number;
  orbitR: number; color: string; duration: number;
  inView: boolean; children: OEMChild[];
}) {
  const PARENT_R = 26;
  const CHILD_R  = 17;
  return (
    <>
      {/* Dashed orbit ring */}
      <circle cx={cx} cy={cy} r={orbitR}
        fill="none" stroke="rgba(147,197,253,0.5)" strokeWidth={1.5} strokeDasharray="3 2" />

      {/* Pulsing glow around parent */}
      <motion.circle cx={cx} cy={cy} r={PARENT_R + 8}
        fill="none" stroke={`${color}28`} strokeWidth={2.5}
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
        animate={inView ? { scale: [1, 1.18, 1], opacity: [0.25, 1, 0.25] } : {}}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Parent OEM circle */}
      <circle cx={cx} cy={cy} r={PARENT_R}
        fill="white" stroke={`${color}35`} strokeWidth={2}
      />
      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle"
        fontSize={11} fontWeight={800} fill={color} fontFamily="Inter,ui-sans-serif">
        {abbr}
      </text>

      {/* Orbital group */}
      <g transform={`translate(${cx},${cy})`}>
        <motion.g
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
          animate={inView ? { rotate: 360 } : { rotate: 0 }}
          transition={{ duration, repeat: Infinity, ease: "linear" }}
        >
          {children.map((child, i) => {
            const ang = (i / children.length) * 2 * Math.PI - Math.PI / 2;
            const x   = Math.cos(ang) * orbitR;
            const y   = Math.sin(ang) * orbitR;
            return (
              <g key={child.abbr}>
                <line x1={0} y1={0} x2={x} y2={y}
                  stroke="rgba(147,197,253,0.35)" strokeWidth={0.8} strokeDasharray="3 2" />
                <motion.g
                  style={{ transformBox: "fill-box", transformOrigin: "center" }}
                  animate={inView ? { rotate: -360 } : { rotate: 0 }}
                  transition={{ duration, repeat: Infinity, ease: "linear" }}
                >
                  <circle cx={x} cy={y} r={CHILD_R}
                    fill="white" stroke="#dbeafe" strokeWidth={1.5} />
                  <text x={x} y={y} textAnchor="middle" dominantBaseline="middle"
                    fontSize={8.5} fontWeight={700} fill="#334155"
                    fontFamily="Inter,ui-sans-serif">
                    {child.abbr}
                  </text>
                </motion.g>
              </g>
            );
          })}
        </motion.g>
      </g>

      {/* Label + B2C badge */}
      <text x={cx} y={cy + orbitR + 17}
        textAnchor="middle" fontSize={10} fontWeight={700} fill="#1e293b"
        fontFamily="Inter,ui-sans-serif">{label}</text>
      <rect x={cx - 14} y={cy + orbitR + 21} width={28} height={13} rx={6.5}
        fill={`${color}18`} />
      <text x={cx} y={cy + orbitR + 30}
        textAnchor="middle" dominantBaseline="middle" fontSize={8} fontWeight={700}
        fill={color} fontFamily="Inter,ui-sans-serif">B2C</text>
    </>
  );
}

export const DetailPreview = memo(function DetailPreview() {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, margin: "-40px" });
  const [tab, setTab] = useState<"attributes" | "schema" | "example">("attributes");

  const ATTRS = [
    { name: "unit",      type: "string" },
    { name: "value",     type: "number" },
    { name: "timestamp", type: "string" },
  ];

  const BMW_CHILDREN:   OEMChild[] = [{ abbr: "RR",  name: "Rolls-Royce" }, { abbr: "MINI", name: "MINI" }];
  const STELL_CHILDREN: OEMChild[] = [{ abbr: "FI",  name: "Fiat" }, { abbr: "OP", name: "Opel" }, { abbr: "JP", name: "Jeep" }, { abbr: "AR", name: "Alfa" }];

  return (
    <div ref={ref} className="flex h-full flex-col overflow-hidden bg-surface text-fg">

      {/* Header bar */}
      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-border bg-base px-4 py-2.5">
        <div className="flex items-center gap-1">
          <ChevronLeft className="h-3 w-3 shrink-0 text-brand" />
          <span className="text-[10px] font-medium text-brand">Data Catalog</span>
          <span className="px-0.5 text-[10px] text-fg-subtle">/</span>
          <span className="flex items-center gap-1.5 text-[10px] font-medium text-fg-muted">
            <Battery className="h-3 w-3 text-brand/60" />
            Battery Care Mode
          </span>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          className="shrink-0 rounded-lg bg-brand px-2.5 py-1 text-[9px] font-bold text-white"
          style={{ boxShadow: "0 3px 8px rgba(37,99,235,.30)" }}
        >
          ▶ Request
        </motion.button>
      </div>

      {/* MANUFACTURERS — flex-1, SVG orbital */}
      <div className="flex min-h-0 flex-1 flex-col border-b border-border px-4 py-2">
        <p className="mb-1 shrink-0 font-mono text-[9px] uppercase tracking-[0.18em] text-fg-subtle">⊞ Manufacturers</p>
        <div className="min-h-0 flex-1">
          {/* Single SVG — both orbital groups share one coordinate system.
              viewBox tuned so each group has breathing room. */}
          <svg viewBox="0 0 290 185" className="h-full w-full" style={{ overflow: "visible" }}>
            <OEMOrbitSVG
              abbr="BMW" label="BMW" color="#1d4ed8"
              cx={70} cy={82} orbitR={52} duration={10}
              inView={inView} children={BMW_CHILDREN}
            />
            <OEMOrbitSVG
              abbr="ST" label="Stellantis" color="#7c3aed"
              cx={215} cy={82} orbitR={58} duration={16}
              inView={inView} children={STELL_CHILDREN}
            />
          </svg>
        </div>
      </div>

      {/* TECHNICAL INFO — static, shrink-0 */}
      <div className="flex shrink-0 flex-col px-4 pb-3 pt-2.5">
        <p className="mb-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-fg-subtle">↻ Technical Info</p>

        {/* Tabs */}
        <div className="mb-2 flex border-b border-border">
          {(["attributes", "schema", "example"] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "pb-1.5 pr-4 text-[11px] font-semibold transition-colors duration-200",
                tab === t ? "border-b-2 border-brand text-brand" : "border-b-2 border-transparent text-fg-subtle",
              )}
            >
              {t === "schema" ? "JSON Schema" : t === "example" ? "JSON Example" : "Attributes"}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {tab === "attributes" && (
            <motion.div key="attributes" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
              <div className="overflow-hidden rounded-xl border border-border">
                <div className="grid grid-cols-[1fr_58px_46px] gap-2 border-b border-border bg-base px-3 py-1.5">
                  {["NAME", "TYPE", "REQ"].map(h => (
                    <span key={h} className="font-mono text-[9px] uppercase tracking-widest text-fg-subtle">{h}</span>
                  ))}
                </div>
                {ATTRS.map((a, i) => (
                  <div key={a.name} className={cn("grid grid-cols-[1fr_58px_46px] items-center gap-2 px-3 py-2", i < ATTRS.length - 1 && "border-b border-border/50")}>
                    <span className="font-mono text-[11px] font-bold text-fg">{a.name}</span>
                    <span className={cn("font-mono text-[11px] font-semibold", a.type === "number" ? "text-orange-500" : "text-blue-500")}>{a.type}</span>
                    <span className="rounded-full bg-green-500/10 px-1.5 py-0.5 text-center font-mono text-[9px] font-bold text-green-600">✓</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

            {tab === "schema" && (
              <motion.div key="schema" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                <div className="overflow-hidden rounded-xl border border-border">
                  {/* Header — matches real CARUSO JSON view */}
                  <div className="flex items-center gap-1.5 border-b border-border bg-[#f8fafc] px-3 py-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                    <span className="font-mono text-[9px] font-semibold text-slate-500">JSON</span>
                    <span className="font-mono text-[9px] text-slate-400">│ 13 lines</span>
                    <Copy className="ml-auto h-2.5 w-2.5 cursor-pointer text-slate-400" />
                  </div>
                  {/* Light-theme code with line numbers */}
                  <div className="bg-white py-1.5">
                    {([
                      [<span className="text-slate-600">{"{"}</span>],
                      [<span className="text-slate-400">{"  "}</span>, <span className="text-teal-600">"type"</span>, <span className="text-slate-500">: </span>, <span className="text-emerald-600">"object"</span>, <span className="text-slate-500">,</span>],
                      [<span className="text-slate-400">{"  "}</span>, <span className="text-teal-600">"title"</span>, <span className="text-slate-500">: </span>, <span className="text-emerald-600">"Battery Care Mode"</span>, <span className="text-slate-500">,</span>],
                      [<span className="text-slate-400">{"  "}</span>, <span className="text-teal-600">"required"</span>, <span className="text-slate-500">: [</span>, <span className="text-emerald-600">"value"</span>, <span className="text-slate-500">, </span>, <span className="text-emerald-600">"unit"</span>, <span className="text-slate-500">, </span>, <span className="text-emerald-600">"timestamp"</span>, <span className="text-slate-500">],</span>],
                      [<span className="text-slate-400">{"  "}</span>, <span className="text-teal-600">"properties"</span>, <span className="text-slate-500">: {"{"}</span>],
                      [<span className="text-slate-400">{"    "}</span>, <span className="text-teal-600">"unit"</span>, <span className="text-slate-500">: {"{"}</span>],
                      [<span className="text-slate-400">{"      "}</span>, <span className="text-teal-600">"type"</span>, <span className="text-slate-500">: </span>, <span className="text-emerald-600">"string"</span>, <span className="text-slate-500">, </span>, <span className="text-teal-600">"enum"</span>, <span className="text-slate-500">: [</span>, <span className="text-emerald-600">"kWh"</span>, <span className="text-slate-500">]</span>],
                      [<span className="text-slate-400">{"    "}</span>, <span className="text-slate-500">{"}, "}</span>, <span className="text-teal-600">"value"</span>, <span className="text-slate-500">{": { "}</span>, <span className="text-teal-600">"type"</span>, <span className="text-slate-500">: </span>, <span className="text-orange-500">&#34;number&#34;</span>, <span className="text-slate-500">{" }"}</span>],
                      [<span className="text-slate-400">{"    "}</span>, <span className="text-teal-600">"timestamp"</span>, <span className="text-slate-500">: {"{"}</span>],
                      [<span className="text-slate-400">{"      "}</span>, <span className="text-teal-600">"type"</span>, <span className="text-slate-500">: </span>, <span className="text-emerald-600">"string"</span>, <span className="text-slate-500">,</span>],
                      [<span className="text-slate-400">{"      "}</span>, <span className="text-teal-600">"format"</span>, <span className="text-slate-500">: </span>, <span className="text-emerald-600">"date-time"</span>],
                      [<span className="text-slate-400">{"    "}</span>, <span className="text-slate-500">{"}"}</span>],
                      [<span className="text-slate-500">{"  } }"}</span>],
                    ] as React.ReactNode[][]).map((parts, i) => (
                      <div key={i} className="flex items-baseline">
                        <span className="w-7 shrink-0 select-none pr-2 text-right font-mono text-[8px] text-slate-300">{i + 1}</span>
                        <span className="font-mono text-[9.5px] leading-[1.6]">{parts}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {tab === "example" && (
              <motion.div key="example" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                <div className="overflow-hidden rounded-xl border border-border">
                  <div className="flex items-center gap-1.5 border-b border-border bg-[#f8fafc] px-3 py-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                    <span className="font-mono text-[9px] font-semibold text-slate-500">JSON</span>
                    <span className="font-mono text-[9px] text-slate-400">│ 5 lines</span>
                    <Copy className="ml-auto h-2.5 w-2.5 cursor-pointer text-slate-400" />
                  </div>
                  <div className="bg-white py-1.5">
                    {([
                      [<span className="text-slate-600">{"{"}</span>],
                      [<span className="text-slate-400">{"  "}</span>, <span className="text-teal-600">"unit"</span>, <span className="text-slate-500">: </span>, <span className="text-emerald-600">"kWh"</span>, <span className="text-slate-500">,</span>],
                      [<span className="text-slate-400">{"  "}</span>, <span className="text-teal-600">"value"</span>, <span className="text-slate-500">: </span>, <span className="text-orange-500">2.4</span>, <span className="text-slate-500">,</span>],
                      [<span className="text-slate-400">{"  "}</span>, <span className="text-teal-600">"timestamp"</span>, <span className="text-slate-500">: </span>, <span className="text-emerald-600">"2024-12-01T10:30:00Z"</span>],
                      [<span className="text-slate-600">{"}"}</span>],
                    ] as React.ReactNode[][]).map((parts, i) => (
                      <div key={i} className="flex items-baseline">
                        <span className="w-7 shrink-0 select-none pr-2 text-right font-mono text-[8px] text-slate-300">{i + 1}</span>
                        <span className="font-mono text-[9.5px] leading-[1.6]">{parts}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
      </div>
    </div>
  );
});