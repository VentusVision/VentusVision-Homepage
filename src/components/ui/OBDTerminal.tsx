import { motion } from "framer-motion";
import { useEffect } from "react";
import { EASE_PREMIUM } from "../../lib/motion";

const LINES = [
  { text: "CARUSO OBD-II GATEWAY  v3.1.0",           color: "text-white/60",     delay: 0.00 },
  { text: "ECU CONNECTION ............... OK",        color: "text-green-400/80", delay: 0.20 },
  { text: "VIN DECODE: WBA3A5G51DN570953",            color: "text-cyan-300/80",  delay: 0.38 },
  { text: "CAN BUS: ISO 15765-4 ......... OK",       color: "text-green-400/80", delay: 0.56 },
  { text: "SENSOR MATRIX: 847 / 847 ...... OK",      color: "text-green-400/80", delay: 0.74 },
  { text: "FLEET NODES: 2,847 CONNECTED",             color: "text-cyan-300/80",  delay: 0.92 },
  { text: "DATA STREAMS: ACTIVE",                    color: "text-green-400/80", delay: 1.10 },
  { text: "MARKETPLACE SYNC: ONLINE",                color: "text-cyan-300/80",  delay: 1.28 },
  { text: "─────────────────────────────────────",   color: "text-white/12",     delay: 1.46 },
  { text: "▶  READY.",                               color: "text-white",        delay: 1.64 },
] as const;

const COMPLETE_AT = 1.64 + 0.6; // fire onComplete after last line + short pause

interface OBDTerminalProps {
  onComplete: () => void;
}

export function OBDTerminal({ onComplete }: OBDTerminalProps) {
  useEffect(() => {
    const t = setTimeout(onComplete, COMPLETE_AT * 1000);
    return () => clearTimeout(t);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-hidden bg-[#02030a] pt-[14vh]"
      exit={{ scaleY: 0, opacity: 0.6 }}
      transition={{ duration: 0.48, ease: EASE_PREMIUM }}
      style={{ transformOrigin: "top" }}
    >
      {/* Scanline texture */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.2) 3px, rgba(0,0,0,0.2) 4px)",
        }}
      />

      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[30%] h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20"
        style={{ background: "radial-gradient(circle, rgba(34,211,238,0.15), transparent 70%)" }}
      />

      <div className="relative w-full max-w-xl px-6">
        {/* Window chrome */}
        <div className="mb-5 flex items-center gap-2.5">
          <span className="h-3 w-3 rounded-full bg-red-500/60" />
          <span className="h-3 w-3 rounded-full bg-yellow-500/60" />
          <span className="h-3 w-3 rounded-full bg-green-500/60" />
          <span className="ml-3 font-mono text-[11px] tracking-widest text-white/18">
            caruso-obd-gateway — zsh
          </span>
        </div>

        {/* Terminal lines */}
        <div className="space-y-[7px]">
          {LINES.map((line, i) => (
            <motion.div
              key={i}
              className={`flex items-baseline gap-2.5 font-mono text-[13px] leading-relaxed ${line.color}`}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.18, delay: line.delay, ease: "easeOut" }}
            >
              {i < LINES.length - 1 && (
                <span className="shrink-0 text-white/20">{">"}</span>
              )}
              <span>{line.text}</span>
            </motion.div>
          ))}
        </div>

        {/* Blinking cursor on last line */}
        <motion.span
          className="mt-px inline-block font-mono text-[13px] text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0, 1, 1, 0] }}
          transition={{
            duration: 0.9,
            repeat: Infinity,
            delay: LINES[LINES.length - 1].delay + 0.2,
            times: [0, 0.35, 0.35, 0.65, 1],
          }}
        >
          ▋
        </motion.span>
      </div>
    </motion.div>
  );
}
