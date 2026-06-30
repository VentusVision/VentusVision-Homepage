import { motion, useInView } from "framer-motion";
import { memo, useRef } from "react";
import {
  Server, Database, Code2, Globe, GitBranch,
  PenTool, Upload, FileJson, Layers, RefreshCw, Layout,
} from "lucide-react";
import { useElementHeight } from "../../hooks/useElementHeight";
import { useElementWidth } from "../../hooks/useElementWidth";
import { EASE_PREMIUM } from "../../lib/motion";
import { SectionBadge } from "../ui/SectionBadge";

// ── Data ──────────────────────────────────────

const DATA_SOURCES = [
  { name: "BMW Group",     abbr: "BMW", from: "#1C69D3", to: "#0EA5E9" },
  { name: "Volkswagen",    abbr: "VW",  from: "#00438B", to: "#2563EB" },
  { name: "Audi",          abbr: "AU",  from: "#BB0A14", to: "#EF4444" },
  { name: "Mercedes-Benz", abbr: "MB",  from: "#374151", to: "#6B7280" },
  { name: "Ford",          abbr: "FD",  from: "#003499", to: "#3B82F6" },
  { name: "Tesla",         abbr: "TS",  from: "#E82127", to: "#F97316" },
  { name: "Stellantis",    abbr: "ST",  from: "#7C3AED", to: "#A855F7" },
  { name: "Renault",       abbr: "RN",  from: "#0F766E", to: "#06B6D4" },
];

// Platform core — what runs the marketplace
const PLATFORM = [
  { Icon: Server,    label: "Go",          desc: "Backend · HTTP Server · SSR" },
  { Icon: Database,  label: "PostgreSQL",  desc: "Relational DB"               },
  { Icon: RefreshCw, label: "HTMX",        desc: "Dynamic UI updates"          },
  { Icon: Globe,     label: "REST API",    desc: "JSON · OpenAPI"              },
  { Icon: Upload,    label: "Supabase",    desc: "Managed DB hosting"          },
  { Icon: Layout,    label: "Vercel",      desc: "Production hosting"          },
];

// Dev tools & frontend stack
const DEV_STACK = [
  { name: "Vanilla JS",      desc: "Canvas · localStorage",  from: "#F7DF1E", to: "#FBBF24", Icon: Code2      },
  { name: "HTML5 / CSS3",    desc: "Templates · Styling",    from: "#E34F26", to: "#F97316", Icon: Layout     },
  { name: "Material Icons",  desc: "UI Icon set (MDI)",      from: "#2563EB", to: "#06B6D4", Icon: Layers     },
  { name: "Git / GitHub",    desc: "Version control",        from: "#24292E", to: "#6B7280", Icon: GitBranch  },
  { name: "Figma",           desc: "UI/UX Design",           from: "#A259FF", to: "#F24E1E", Icon: PenTool    },
  { name: "JSON Files",      desc: "OEM data source format", from: "#0F766E", to: "#06B6D4", Icon: FileJson   },
];

const PACKET_STREAM_COLORS = [
  "#2563EB", "#06B6D4", "#7C3AED", "#0EA5E9", "#A855F7", "#06B6D4", "#3B82F6", "#10B981",
] as const;

// ── Animated packet stream ─────────────────────

const PacketStream = memo(function PacketStream({ reverse = false, count = 6 }: { reverse?: boolean; count?: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { margin: "-10% 0px", amount: 0.05 });
  const w = useElementWidth(containerRef);

  const spread = Math.max(count - 1, 1);

  return (
    <div ref={containerRef} className="relative h-full w-full overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand/4 to-transparent" />
      <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-brand/15 to-transparent" />
      {w > 0 && inView && Array.from({ length: count }).map((_, i) => {
        const top   = 6 + (i / spread) * 88;
        const dur   = 1.3 + i * 0.18;
        const delay = i * 0.3;
        const color = PACKET_STREAM_COLORS[i % PACKET_STREAM_COLORS.length];
        return (
          <motion.div
            key={i}
            className="absolute h-2 w-2 rounded-full"
            style={{ top: `${top}%`, background: color, boxShadow: `0 0 8px 3px ${color}77`, left: 0 }}
            initial={{ x: reverse ? w : -8, opacity: 0 }}
            animate={{ x: reverse ? -8 : w, opacity: [0, 1, 1, 0] }}
            transition={{ duration: dur, repeat: Infinity, delay, ease: "linear" }}
          />
        );
      })}
    </div>
  );
});

// ── Vertical packet stream (mobile) ───────────
// reverse=true  → dots flow UP   (bottom → Caruso hub)
// reverse=false → dots flow DOWN (OEMs  → Caruso hub)

const PacketStreamVertical = memo(function PacketStreamVertical({
  count = 5,
  reverse = false,
}: {
  count?: number;
  reverse?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { margin: "-10% 0px", amount: 0.05 });
  const h = useElementHeight(containerRef);

  const spread = Math.max(count - 1, 1);
  // gradient: brighter toward the Hub end (bottom for top-stream, top for bottom-stream)
  const lineGradient = reverse
    ? "bg-gradient-to-b from-brand/30 via-brand/15 to-transparent"
    : "bg-gradient-to-b from-transparent via-brand/15 to-brand/30";

  return (
    <div ref={containerRef} className="relative h-full w-full overflow-hidden">
      <div className={`absolute left-1/2 top-0 h-full w-px -translate-x-1/2 ${lineGradient}`} />
      {h > 0 && inView && Array.from({ length: count }).map((_, i) => {
        const left  = 15 + (i / spread) * 70;
        const dur   = 1.1 + i * 0.18;
        const delay = i * 0.25;
        const color = PACKET_STREAM_COLORS[i % PACKET_STREAM_COLORS.length];
        return (
          <motion.div
            key={i}
            className="absolute h-2 w-2 rounded-full"
            style={{
              left: `${left}%`,
              background: color,
              boxShadow: `0 0 8px 3px ${color}77`,
              top: reverse ? undefined : 0,
              bottom: reverse ? 0 : undefined,
            }}
            initial={{ y: reverse ? 8 : -8, opacity: 0 }}
            animate={{ y: reverse ? -(h + 8) : h + 8, opacity: [0, 1, 1, 0] }}
            transition={{ duration: dur, repeat: Infinity, delay, ease: "linear" }}
          />
        );
      })}
    </div>
  );
});

// ── Source card (OEMs) ─────────────────────────

const SourceCard = memo(function SourceCard({ name, abbr, from, to, delay, inView }: typeof DATA_SOURCES[0] & { delay: number; inView: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -28 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: EASE_PREMIUM }}
      className="flex items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-2.5"
      style={{ boxShadow: "0 1px 3px rgba(15,23,42,0.06), 0 4px 10px rgba(15,23,42,0.04)" }}
    >
      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-[10px] font-black text-white"
        style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
      >
        {abbr}
      </div>
      <div className="min-w-0">
        <p className="text-[14px] font-semibold text-fg">{name}</p>
        <p className="text-[11px] text-fg-subtle">· JSON</p>
      </div>
      <span className="ml-auto h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-green-500" />
    </motion.div>
  );
});

// ── Dev tool card (right column) ──────────────

const DevCard = memo(function DevCard({ name, desc, from, to, Icon, delay, inView }: typeof DEV_STACK[0] & { delay: number; inView: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 28 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: EASE_PREMIUM }}
      className="flex items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-2.5"
      style={{ boxShadow: "0 1px 3px rgba(15,23,42,0.06), 0 4px 10px rgba(15,23,42,0.04)" }}
    >
      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl"
        style={{ background: `linear-gradient(135deg, ${from}22, ${to}22)`, border: `1px solid ${from}44` }}
      >
        <Icon className="h-3.5 w-3.5" style={{ color: from }} />
      </div>
      <div className="min-w-0">
        <p className="text-[14px] font-semibold text-fg">{name}</p>
        <p className="text-[11px] text-fg-subtle">{desc}</p>
      </div>
    </motion.div>
  );
});

// ── Center Hub ─────────────────────────────────

const Hub = memo(function Hub({ inView }: { inView: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88, y: 16 }}
      animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: EASE_PREMIUM, delay: 0.2 }}
      className="relative w-full overflow-hidden rounded-3xl border border-brand/25 bg-surface"
      style={{ boxShadow: "0 0 0 1px rgba(37,99,235,0.15), 0 8px 32px rgba(37,99,235,0.15), 0 32px 80px rgba(37,99,235,0.10)" }}
    >
      <div className="pointer-events-none absolute -top-12 left-1/2 h-36 w-36 -translate-x-1/2 rounded-full bg-brand/10 blur-[48px]" />

      {/* Header */}
      <div className="relative border-b border-brand/10 px-5 py-5 text-center">
        <div
          className="relative mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white p-1.5"
          style={{ boxShadow: "0 0 0 1px rgba(37,99,235,0.12), 0 4px 14px rgba(37,99,235,0.18)" }}
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 animate-pulse rounded-2xl"
            style={{ boxShadow: "0 0 32px rgba(37,99,235,0.45)" }}
          />
          <img
            src={`${import.meta.env.BASE_URL}CarusoBall.png`}
            alt="Caruso"
            className="relative h-full w-full object-contain"
          />
        </div>
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand/60">CARUSO</p>
        <p className="mt-0.5 text-[17px] font-extrabold tracking-tight text-fg">Data Marketplace</p>
        <div className="mt-1.5 flex items-center justify-center gap-1.5">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
          <span className="text-[10px] font-semibold text-green-600">Live · 99.9% uptime</span>
        </div>
      </div>

      {/* Platform features */}
      <div className="relative grid grid-cols-2 gap-px bg-border">
        {PLATFORM.map(({ Icon, label, desc }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.5 + i * 0.08, duration: 0.4 }}
            className="flex flex-col gap-0.5 bg-surface px-3 py-3"
          >
            <div className="flex items-center gap-1.5">
              <div className="rounded-md bg-brand-subtle p-1">
                <Icon className="h-3 w-3 text-brand" />
              </div>
              <span className="text-[13px] font-bold text-fg">{label}</span>
            </div>
            <span className="pl-6 text-[11px] leading-tight text-fg-subtle">{desc}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
});

// ── Section ────────────────────────────────────

export function TechStackSection() {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px 0px" });

  return (
    <section ref={ref} id="techstack" className="relative overflow-hidden bg-base px-4 py-16 sm:px-8 sm:py-24 lg:py-28">
      <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(37,99,235,0.05) 0%, transparent 70%)" }} />

      <div className="relative mx-auto max-w-7xl">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE_PREMIUM }}
          className="mb-16 text-center"
        >
          <SectionBadge label="Techstack" pulse className="text-[11px]" />
          <h2 className="mt-5 text-4xl font-extrabold tracking-tight text-fg sm:text-5xl">
            Gebaut mit{" "}
            <span style={{ background: "linear-gradient(to right, #2563EB, #06B6D4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              modernen Tools.
            </span>
          </h2>
          <p className="mt-3 text-lg text-fg-muted">
            Go · PostgreSQL · HTMX · Vanilla JS — kein Framework-Overhead, maximale Performance
          </p>
        </motion.div>

        {/* Desktop layout (lg+) — 5-column horizontal */}
        <div className="hidden items-center gap-0 lg:flex">

          {/* Left: OEM Sources */}
          <div className="flex w-[220px] shrink-0 flex-col gap-2">
            <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-fg-subtle">Data Sources · JSON</p>
            {DATA_SOURCES.map((src, i) => (
              <SourceCard key={src.name} {...src} delay={0.08 + i * 0.06} inView={inView} />
            ))}
          </div>

          {/* Left stream */}
          <div className="h-[430px] flex-1">
            <PacketStream count={8} />
          </div>

          {/* Center Hub */}
          <div className="w-[250px] shrink-0">
            <Hub inView={inView} />
          </div>

          {/* Right stream */}
          <div className="h-[360px] flex-1">
            <PacketStream reverse count={6} />
          </div>

          {/* Right: Dev Stack */}
          <div className="flex w-[220px] shrink-0 flex-col gap-2">
            <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-fg-subtle">Dev Stack · Tools</p>
            {DEV_STACK.map((tool, i) => (
              <DevCard key={tool.name} {...tool} delay={0.12 + i * 0.07} inView={inView} />
            ))}
          </div>
        </div>

        {/* Mobile/tablet layout (< lg) — vertical stack with horizontal scroll rows */}
        <div className="flex flex-col gap-0 lg:hidden">

          {/* OEM Sources — compact 2-column grid */}
          <div>
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-fg-subtle">
              Data Sources · JSON
            </p>
            <div className="grid grid-cols-2 gap-2">
              {DATA_SOURCES.map((src, i) => (
                <motion.div
                  key={src.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.06 + i * 0.05, ease: EASE_PREMIUM }}
                  className="flex items-center gap-2.5 rounded-2xl border border-border bg-surface px-3 py-2.5"
                  style={{ boxShadow: "0 1px 4px rgba(15,23,42,0.06)" }}
                >
                  <div
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[9px] font-black text-white"
                    style={{ background: `linear-gradient(135deg, ${src.from}, ${src.to})` }}
                  >
                    {src.abbr}
                  </div>
                  <span className="min-w-0 flex-1 truncate text-[12px] font-semibold text-fg">{src.name}</span>
                  <span className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-green-500" />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Stream: OEM → Hub (dots flow DOWN toward Caruso) */}
          <div className="h-16">
            <PacketStreamVertical count={5} reverse={false} />
          </div>

          {/* Hub */}
          <div className="mx-auto w-full max-w-[340px]">
            <Hub inView={inView} />
          </div>

          {/* Stream: Dev Stack → Hub (dots flow UP toward Caruso) */}
          <div className="h-16">
            <PacketStreamVertical count={5} reverse={true} />
          </div>

          {/* Dev Stack — compact 2-column grid */}
          <div>
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-fg-subtle">
              Dev Stack · Tools
            </p>
            <div className="grid grid-cols-2 gap-2">
              {DEV_STACK.map((tool, i) => {
                const Icon = tool.Icon;
                return (
                  <motion.div
                    key={tool.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.1 + i * 0.05, ease: EASE_PREMIUM }}
                    className="flex items-center gap-2.5 rounded-2xl border border-border bg-surface px-3 py-2.5"
                    style={{ boxShadow: "0 1px 4px rgba(15,23,42,0.06)" }}
                  >
                    <div
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                      style={{
                        background: `linear-gradient(135deg, ${tool.from}20, ${tool.to}20)`,
                        border: `1px solid ${tool.from}40`,
                      }}
                    >
                      <Icon className="h-3.5 w-3.5" style={{ color: tool.from }} />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-[12px] font-semibold text-fg">{tool.name}</p>
                      <p className="truncate text-[10px] text-fg-subtle">{tool.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.9, ease: EASE_PREMIUM }}
          className="mt-16 grid grid-cols-2 gap-4 rounded-3xl border border-brand/15 bg-surface p-8 shadow-[0_0_0_1px_rgba(37,99,235,0.08),0_8px_32px_rgba(37,99,235,0.08)] sm:grid-cols-4"
        >
          {[
            { value: "Go",      label: "Backend Language"  },
            { value: "HTMX",    label: "Kein JS-Framework" },
            { value: "433+",    label: "Data Streams"      },
            { value: "Vercel",  label: "Hosting Platform"  },
          ].map(({ value, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1.0 + i * 0.1, duration: 0.5, ease: EASE_PREMIUM }}
              className="text-center"
            >
              <p
                className="text-3xl font-black tracking-tight"
                style={{ background: "linear-gradient(135deg, #2563EB, #06B6D4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
              >
                {value}
              </p>
              <p className="mt-1 text-[12px] font-medium text-fg-muted">{label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
