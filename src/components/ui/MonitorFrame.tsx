import { motion, useInView } from "framer-motion";
import type { ReactNode } from "react";
import { useRef } from "react";
import { ExternalLink } from "lucide-react";
import { floatLoop } from "../../lib/motion";

const DEMO_URL = "https://caruso-data-marketplace.vercel.app/";

interface MonitorFrameProps {
  children: ReactNode;
  title?: string;
}

export function MonitorFrame({ children, title = "CARUSO Data Marketplace" }: MonitorFrameProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-10% 0px", amount: 0.08 });

  return (
    <motion.div
      ref={ref}
      animate={inView ? floatLoop.animate : undefined}
      transition={inView ? floatLoop.transition : undefined}
      className="flex flex-col items-center"
    >
      {/* ── Outer shadow ── */}
      <div
        className="relative w-full"
        style={{ filter: "drop-shadow(0 0 40px rgba(37,99,235,0.10)) drop-shadow(0 40px 80px rgba(15,23,42,0.22))" }}
      >
        {/* ── Monitor body ── */}
        <div
          className="relative w-full overflow-hidden rounded-[14px]"
          style={{
            background: "#E4EBF8",
            border: "10px solid #B8C8E8",
            boxShadow:
              "inset 0 0 0 1px rgba(255,255,255,0.85), 0 0 0 1px rgba(37,99,235,0.12), 0 0 40px rgba(37,99,235,0.06)",
          }}
        >
          {/* ── Title bar ── */}
          <div
            className="flex shrink-0 items-center gap-1.5 border-b px-4 py-2.5"
            style={{ borderColor: "rgba(15,23,42,0.08)", background: "rgba(255,255,255,0.7)" }}
          >
            <span className="h-[9px] w-[9px] rounded-full" style={{ backgroundColor: "#ff5f57" }} />
            <span className="h-[9px] w-[9px] rounded-full" style={{ backgroundColor: "#febc2e" }} />
            <span className="h-[9px] w-[9px] rounded-full" style={{ backgroundColor: "#28c840" }} />
            <span className="ml-3 font-mono text-[9px] tracking-wide" style={{ color: "rgba(15,23,42,0.35)" }}>{title}</span>
            <div className="ml-auto flex items-center gap-1">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-50" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-500" />
              </span>
              <span className="font-mono text-[8px]" style={{ color: "rgba(34,197,94,0.7)" }}>LIVE</span>
            </div>
          </div>

          {/* ── Screen content — tall portrait on mobile, 16:9 on sm+ ── */}
          <div className="relative w-full bg-base aspect-[9/16] sm:aspect-video">
            {children}
          </div>

          {/* ── Bottom bezel: brand + LIVE badge + power LED ── */}
          <div
            className="flex shrink-0 items-center gap-2 px-3 py-2 sm:justify-between sm:px-5 sm:py-2.5"
            style={{ background: "#E4EBF8", borderTop: "1px solid rgba(37,99,235,0.10)" }}
          >
            {/* Brand */}
            <span className="shrink-0 font-mono text-[8px] font-bold uppercase tracking-[0.25em]" style={{ color: "rgba(37,99,235,0.30)" }}>
              CARUSO
            </span>

            {/* LIVE badge */}
            <motion.a
              href={DEMO_URL}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, boxShadow: "0 4px 20px rgba(37,99,235,0.28)" }}
              whileTap={{ scale: 0.97 }}
              className="flex min-w-0 flex-1 items-center gap-1.5 overflow-hidden rounded-full px-2.5 py-1.5 sm:flex-none sm:gap-2.5 sm:px-4"
              style={{
                border: "1px solid rgba(37,99,235,0.25)",
                background: "rgba(255,255,255,0.88)",
                boxShadow: "0 2px 10px rgba(37,99,235,0.14), inset 0 1px 0 rgba(255,255,255,1)",
              }}
            >
              {/* Pulsing green dot */}
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
              </span>
              <span className="shrink-0 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-green-600">Live</span>
              <span className="h-3 w-px shrink-0" style={{ background: "rgba(15,23,42,0.15)" }} />
              <span className="min-w-0 truncate font-mono text-[10px] font-medium" style={{ color: "rgba(15,23,42,0.55)" }}>
                caruso-data-marketplace.vercel.app
              </span>
              <ExternalLink className="h-3 w-3 shrink-0" style={{ color: "rgba(37,99,235,0.55)" }} />
            </motion.a>

            {/* Power LED */}
            <span
              className="h-2 w-2 rounded-full"
              style={{
                backgroundColor: "#2563EB",
                boxShadow: "0 0 8px rgba(37,99,235,0.9)",
              }}
            />
          </div>
        </div>

        {/* ── Screen reflective sheen ── */}
        <div
          className="pointer-events-none absolute inset-0 rounded-[14px]"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 50%, rgba(255,255,255,0.06) 100%)",
          }}
        />
      </div>

      {/* ── Stand neck (trapezoid) ── */}
      <div
        className="mx-auto"
        style={{
          width: "6%",
          height: "28px",
          background: "linear-gradient(to bottom, #B8C8E8, #A8BAD8)",
          clipPath: "polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)",
        }}
      />

      {/* ── Stand base ── */}
      <div
        className="mx-auto"
        style={{
          width: "22%",
          height: "10px",
          borderRadius: "999px",
          background: "linear-gradient(to bottom, #B8C8E8, #A4B8D8)",
          boxShadow: "0 4px 16px rgba(15,23,42,0.12)",
        }}
      />

      {/* ── Desk reflection ── */}
      <div
        className="mx-auto mt-1"
        style={{
          width: "40%",
          height: "1px",
          background:
            "linear-gradient(to right, transparent, rgba(15,23,42,0.08), transparent)",
        }}
      />
    </motion.div>
  );
}
