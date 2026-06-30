import { memo } from "react";
import { TICKER_RAW } from "./constants";

const TICKER_DUP = [...TICKER_RAW, ...TICKER_RAW];

export const LiveTicker = memo(function LiveTicker() {
  return (
    <div
      className="relative overflow-hidden border-b border-brand/15"
      style={{
        background: "linear-gradient(90deg, rgba(37,99,235,0.07) 0%, rgba(6,182,212,0.07) 100%)",
      }}
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-[rgba(37,99,235,0.09)] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-[rgba(6,182,212,0.09)] to-transparent" />

      <div
        className="flex w-max gap-6 whitespace-nowrap py-2 pl-4"
        style={{
          animation: "ticker-scroll 28s linear infinite",
          willChange: "transform",
        }}
      >
        {TICKER_DUP.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-2 font-mono text-[12px] font-medium"
          >
            <span
              className="h-1.5 w-1.5 shrink-0 rounded-full"
              style={{
                background: "linear-gradient(135deg, #2563EB, #06B6D4)",
                boxShadow: "0 0 6px rgba(37,99,235,0.55)",
              }}
            />
            <span className="text-brand/70">NEW:</span>
            <span className="text-fg-muted">{item}</span>
            <span className="ml-1 text-[11px] text-fg-subtle opacity-50">·</span>
          </span>
        ))}
      </div>
    </div>
  );
});
