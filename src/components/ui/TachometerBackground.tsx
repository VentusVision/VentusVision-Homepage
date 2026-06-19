import { motion, useMotionValue, animate as mAnimate } from "framer-motion";
import { useEffect, useState } from "react";
import { EASE_PREMIUM } from "../../lib/motion";

const CX = 250;
const CY = 258;
const R = 205;
const START = 240;  // degrees from 12 o'clock, clockwise
const SWEEP = 240;

function pt(angleDeg: number, r = R) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: CX + r * Math.sin(rad), y: CY - r * Math.cos(rad) };
}

function arcD(startAngle: number, sweep: number, r = R) {
  const s = pt(startAngle, r);
  const e = pt(startAngle + sweep, r);
  const large = sweep > 180 ? 1 : 0;
  return `M ${s.x.toFixed(2)} ${s.y.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${e.x.toFixed(2)} ${e.y.toFixed(2)}`;
}

const MAJOR_TICKS = Array.from({ length: 9 }, (_, i) => {
  const angle = START + (i / 8) * SWEEP;
  return {
    outer: pt(angle, R + 2),
    inner: pt(angle, R - 18),
    label: String(i),
    labelPt: pt(angle, R - 38),
  };
});

const MINOR_TICKS = Array.from({ length: 40 }, (_, i) => {
  if (i % 5 === 0) return null;
  const angle = START + (i / 40) * SWEEP;
  return { outer: pt(angle, R + 2), inner: pt(angle, R - 10) };
}).filter(Boolean) as { outer: ReturnType<typeof pt>; inner: ReturnType<typeof pt> }[];

function RpmCounter({ value }: { value: ReturnType<typeof useMotionValue<number>> }) {
  const [display, setDisplay] = useState("0");
  useEffect(
    () => value.on("change", (v) => setDisplay(Math.round(v).toLocaleString("de-DE"))),
    [value],
  );
  return <>{display}</>;
}

interface TachometerBackgroundProps {
  onComplete?: () => void;
}

export function TachometerBackground({ onComplete }: TachometerBackgroundProps) {
  const rpm = useMotionValue(0);

  useEffect(() => {
    const controls = mAnimate(rpm, 9400, {
      duration: 1.5,
      ease: EASE_PREMIUM as never,
      delay: 0.3,
    });
    const timeout = setTimeout(() => onComplete?.(), 1900);
    return () => {
      controls.stop();
      clearTimeout(timeout);
    };
  }, [rpm, onComplete]);

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
      {/* SVG ring */}
      <svg
        viewBox="0 0 500 516"
        className="absolute h-[580px] w-[580px] opacity-[0.28]"
        aria-hidden
      >
        {/* Outer glow ring */}
        <path
          d={arcD(START, SWEEP, R + 14)}
          fill="none"
          stroke="rgba(34,211,238,0.05)"
          strokeWidth="28"
          strokeLinecap="round"
        />

        {/* Background track */}
        <path
          d={arcD(START, SWEEP)}
          fill="none"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Minor ticks */}
        {MINOR_TICKS.map((t, i) => (
          <line
            key={i}
            x1={t.outer.x} y1={t.outer.y}
            x2={t.inner.x} y2={t.inner.y}
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="1"
            strokeLinecap="round"
          />
        ))}

        {/* Major ticks + labels */}
        {MAJOR_TICKS.map((t, i) => (
          <g key={i}>
            <line
              x1={t.outer.x} y1={t.outer.y}
              x2={t.inner.x} y2={t.inner.y}
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <text
              x={t.labelPt.x} y={t.labelPt.y}
              textAnchor="middle" dominantBaseline="middle"
              fill="rgba(255,255,255,0.28)"
              fontSize="11"
              fontFamily="ui-monospace, SFMono-Regular, monospace"
            >
              {t.label}
            </text>
          </g>
        ))}

        {/* Animated fill arc — main (cyan) */}
        <motion.path
          d={arcD(START, SWEEP * 0.84)}
          fill="none"
          stroke="rgba(34,211,238,0.9)"
          strokeWidth="2.5"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: EASE_PREMIUM, delay: 0.3 }}
          style={{ filter: "drop-shadow(0 0 5px rgba(34,211,238,0.7))" }}
        />

        {/* Redline zone (last 16%) */}
        <motion.path
          d={arcD(START + SWEEP * 0.84, SWEEP * 0.16)}
          fill="none"
          stroke="rgba(239,68,68,0.95)"
          strokeWidth="2.5"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.25, ease: "easeOut", delay: 1.56 }}
          style={{ filter: "drop-shadow(0 0 5px rgba(239,68,68,0.7))" }}
        />

        {/* Needle shadow */}
        <motion.line
          x1={CX} y1={CY + 6}
          x2={CX} y2={72}
          stroke="rgba(0,0,0,0.4)"
          strokeWidth="3"
          strokeLinecap="round"
          style={{ transformOrigin: `${CX}px ${CY}px`, translateX: 1, translateY: 1 }}
          initial={{ rotate: START }}
          animate={{ rotate: START + SWEEP }}
          transition={{ duration: 1.5, ease: EASE_PREMIUM, delay: 0.3 }}
        />

        {/* Needle */}
        <motion.line
          x1={CX} y1={CY + 6}
          x2={CX} y2={72}
          stroke="rgba(255,255,255,0.95)"
          strokeWidth="1.5"
          strokeLinecap="round"
          style={{ transformOrigin: `${CX}px ${CY}px` }}
          initial={{ rotate: START }}
          animate={{ rotate: START + SWEEP }}
          transition={{ duration: 1.5, ease: EASE_PREMIUM, delay: 0.3 }}
        />

        {/* Center hub */}
        <circle cx={CX} cy={CY} r="10" fill="rgba(8,10,18,1)" stroke="rgba(34,211,238,0.4)" strokeWidth="1.5" />
        <circle cx={CX} cy={CY} r="4" fill="rgba(34,211,238,0.85)" />

        {/* Unit label */}
        <text
          x={CX} y={CY + 80}
          textAnchor="middle"
          fill="rgba(255,255,255,0.18)"
          fontSize="8.5"
          fontFamily="ui-monospace, SFMono-Regular, monospace"
          letterSpacing="3.5"
        >
          ×1000  RPM
        </text>
      </svg>

      {/* RPM counter (HTML overlay, centered on gauge) */}
      <div
        className="pointer-events-none absolute flex flex-col items-center opacity-[0.28]"
        style={{ marginTop: "56px" }}
      >
        <span className="font-mono text-3xl font-bold tabular-nums text-cyan-300">
          <RpmCounter value={rpm} />
        </span>
        <span className="mt-1 font-mono text-[9px] uppercase tracking-[0.35em] text-white/30">
          Data Streams / sec
        </span>
      </div>
    </div>
  );
}
