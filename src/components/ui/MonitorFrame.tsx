import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { floatLoop } from "../../lib/motion";

interface MonitorFrameProps {
  children: ReactNode;
  title?: string;
}

export function MonitorFrame({ children, title = "CARUSO Data Marketplace" }: MonitorFrameProps) {
  return (
    <motion.div
      animate={floatLoop.animate}
      transition={floatLoop.transition}
      className="flex flex-col items-center"
    >
      {/* ── Outer glow ── */}
      <div
        className="relative w-full"
        style={{ filter: "drop-shadow(0 0 60px rgba(34,211,238,0.18)) drop-shadow(0 40px 80px rgba(0,0,0,0.7))" }}
      >
        {/* ── Monitor body ── */}
        <div
          className="relative w-full overflow-hidden rounded-[14px]"
          style={{
            background: "#0e0e18",
            border: "10px solid #16162a",
            boxShadow:
              "inset 0 0 0 1px rgba(255,255,255,0.07), 0 0 0 1px rgba(255,255,255,0.04)",
          }}
        >
          {/* ── Title bar ── */}
          <div
            className="flex shrink-0 items-center gap-1.5 border-b px-4 py-2.5"
            style={{ borderColor: "rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.025)" }}
          >
            <span className="h-[9px] w-[9px] rounded-full" style={{ backgroundColor: "#ff5f57" }} />
            <span className="h-[9px] w-[9px] rounded-full" style={{ backgroundColor: "#febc2e" }} />
            <span className="h-[9px] w-[9px] rounded-full" style={{ backgroundColor: "#28c840" }} />
            <span className="ml-3 font-mono text-[9px] text-white/25 tracking-wide">{title}</span>
            <div className="ml-auto flex items-center gap-1">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-50" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-400" />
              </span>
              <span className="font-mono text-[8px] text-green-400/60">LIVE</span>
            </div>
          </div>

          {/* ── Screen content — 16:9 ── */}
          <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
            {children}
          </div>

          {/* ── Bottom bezel: brand + power LED ── */}
          <div
            className="flex shrink-0 items-center justify-between px-5 py-1.5"
            style={{ background: "#0e0e18", borderTop: "1px solid rgba(255,255,255,0.04)" }}
          >
            <span className="font-mono text-[7.5px] font-bold tracking-[0.25em] text-white/15 uppercase">
              CARUSO
            </span>
            {/* Power LED */}
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{
                backgroundColor: "#22d3ee",
                boxShadow: "0 0 6px rgba(34,211,238,0.9)",
              }}
            />
          </div>
        </div>

        {/* ── Screen reflective sheen ── */}
        <div
          className="pointer-events-none absolute inset-0 rounded-[14px]"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 50%, rgba(255,255,255,0.01) 100%)",
          }}
        />
      </div>

      {/* ── Stand neck (trapezoid) ── */}
      <div
        className="mx-auto"
        style={{
          width: "6%",
          height: "28px",
          background: "linear-gradient(to bottom, #16162a, #111120)",
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
          background: "linear-gradient(to bottom, #16162a, #0e0e18)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.6)",
        }}
      />

      {/* ── Desk reflection ── */}
      <div
        className="mx-auto mt-1"
        style={{
          width: "40%",
          height: "1px",
          background:
            "linear-gradient(to right, transparent, rgba(255,255,255,0.06), transparent)",
        }}
      />
    </motion.div>
  );
}
