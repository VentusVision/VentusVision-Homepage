import { motion, useInView, useReducedMotion } from "framer-motion";
import { memo, useEffect, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { Car, Truck, Gauge, BatteryCharging, Navigation, Cpu, Activity, Zap } from "lucide-react";
import { EASE_PREMIUM } from "../../lib/motion";

/**
 * Tuning knobs — easy to adjust per-section:
 *
 *  iconOpacity    : floating icon visibility   (0-1) default 0.16
 *  laneOpacity    : vehicle + lane visibility  (0-1) default 0.15
 *  laneSpeed      : seconds to cross viewport  default 32 (higher = slower)
 *  floatAmplitude : px per float cycle         default 14
 */
export interface VehicleBackgroundConfig {
  iconOpacity?:    number;
  laneOpacity?:    number;
  laneSpeed?:      number;
  floatAmplitude?: number;
}

// ── Data ──────────────────────────────────────────────────────────────────────

interface LaneDef {
  Icon:     LucideIcon;
  top:      string;
  duration: number;
  delay:    number;
  size:     number;
}

interface FloaterDef {
  Icon:     LucideIcon;
  left:     string;
  top:      string;
  entrance: number;
  floatDur: number;
  size:     number;
  rings?:   boolean;  // pulsing sonar rings
  radar?:   boolean;  // rotating conic radar sweep
  rotate?:  boolean;  // slow icon rotation
}

interface ConnDef {
  x1: number; y1: number;
  x2: number; y2: number;
  delay: number;
}

const LANES: LaneDef[] = [
  { Icon: Car,   top: "18%", duration: 30, delay:   0, size: 34 },
  { Icon: Truck, top: "76%", duration: 46, delay: -21, size: 42 },
];

// left/top values also act as viewBox 0-100 coords for SVG connections
const FLOATERS: FloaterDef[] = [
  { Icon: Gauge,           left:  "6%", top:  "8%", entrance: 0.1, floatDur: 7.0, size: 58, rings: true,  rotate: true            },
  { Icon: BatteryCharging, left: "80%", top:  "7%", entrance: 0.5, floatDur: 8.5, size: 54, rings: true                           },
  { Icon: Navigation,      left: "91%", top: "48%", entrance: 0.9, floatDur: 6.5, size: 50,               radar:  true            },
  { Icon: Cpu,             left: "42%", top: "75%", entrance: 0.3, floatDur: 9.0, size: 56, rings: true                           },
  { Icon: Activity,        left: "15%", top: "67%", entrance: 0.7, floatDur: 7.5, size: 50                                       },
  { Icon: Zap,             left: "62%", top: "26%", entrance: 1.2, floatDur: 8.0, size: 46                                       },
];

// x/y match the floater left/top percentages
const CONNECTIONS: ConnDef[] = [
  { x1:  6, y1:  8, x2: 62, y2: 26, delay: 1.2 }, // Gauge → Zap
  { x1: 91, y1: 48, x2: 42, y2: 75, delay: 1.7 }, // Navigation → Cpu
  { x1: 80, y1:  7, x2: 15, y2: 67, delay: 2.2 }, // BatteryCharging → Activity
];

// ── PulseRing ─────────────────────────────────────────────────────────────────

const PulseRing = memo(function PulseRing({ delay, baseOpacity }: { delay: number; baseOpacity: number }) {
  return (
    <motion.span
      className="absolute inset-0 rounded-full"
      style={{ border: "1.5px solid var(--c-brand)" }}
      initial={{ scale: 0.8, opacity: Math.min(0.95, baseOpacity * 2.8) }}
      animate={{ scale: 3.6, opacity: 0 }}
      transition={{
        duration:    2.6,
        delay,
        repeat:      Infinity,
        repeatDelay: 0.4,
        ease:        "easeOut",
      }}
    />
  );
});

// ── RadarSweep ────────────────────────────────────────────────────────────────

const RadarSweep = memo(function RadarSweep({ size, opacity }: { size: number; opacity: number }) {
  const d = size * 3.0;
  return (
    <div
      className="pointer-events-none absolute"
      style={{
        width:     d,
        height:    d,
        left:      size / 2,
        top:       size / 2,
        transform: "translate(-50%,-50%)",
      }}
    >
      {/* Outer static rings */}
      <div
        className="absolute inset-0 rounded-full"
        style={{ border: `1px solid rgba(37,99,235,${(opacity * 1.4).toFixed(2)})` }}
      />
      <div
        className="absolute rounded-full"
        style={{
          inset:  "22%",
          border: `1px solid rgba(37,99,235,${(opacity * 0.8).toFixed(2)})`,
        }}
      />

      {/* Rotating conic sweep */}
      <motion.div
        className="absolute inset-0 overflow-hidden rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      >
        <div
          className="h-full w-full"
          style={{
            background: `conic-gradient(from 270deg, transparent 60%, rgba(37,99,235,${(opacity * 2.2).toFixed(2)}) 100%)`,
          }}
        />
      </motion.div>

      {/* Center dot */}
      <div
        className="absolute rounded-full bg-brand"
        style={{
          width:   6,
          height:  6,
          left:    "50%",
          top:     "50%",
          transform: "translate(-50%,-50%)",
          opacity: opacity * 2.5,
        }}
      />
    </div>
  );
});

// ── DrivingLane ───────────────────────────────────────────────────────────────

const DrivingLane = memo(function DrivingLane({
  lane,
  opacity,
  speed,
}: {
  lane:    LaneDef;
  opacity: number;
  speed:   number;
}) {
  const duration = lane.duration * (speed / 32);

  return (
    <div className="absolute left-0 right-0" style={{ top: lane.top }}>
      {/* Dashed road line */}
      <div
        className="absolute inset-x-0 border-t-2 border-dashed border-brand"
        style={{ top: 0, opacity: opacity * 0.6 }}
      />

      {/* Vehicle + speed-blur trail */}
      <motion.div
        className="absolute flex items-center"
        style={{ top: -(lane.size / 2), willChange: "transform" }}
        initial={{ x: -lane.size - 40 }}
        animate={{ x: 2500 }}
        transition={{
          duration,
          delay:       lane.delay,
          repeat:      Infinity,
          ease:        "linear",
          repeatDelay: 0,
        }}
      >
        {/* Gradient trail behind vehicle */}
        <div
          style={{
            width:      90,
            height:     lane.size,
            background: `linear-gradient(to right, transparent, rgba(37,99,235,${(opacity * 0.6).toFixed(2)}))`,
          }}
        />
        {/* Vehicle icon */}
        <div style={{ position: "relative" }}>
          {/* Soft glow halo */}
          <div
            style={{
              position:    "absolute",
              inset:       -4,
              borderRadius: "50%",
              background:  `radial-gradient(circle, rgba(37,99,235,${(opacity * 0.55).toFixed(2)}), transparent 70%)`,
            }}
          />
          <lane.Icon
            style={{
              width:    lane.size,
              height:   lane.size,
              color:    "var(--c-brand)",
              opacity,
              position: "relative",
            }}
          />
        </div>
      </motion.div>
    </div>
  );
});

// ── FloatingIcon ──────────────────────────────────────────────────────────────

const FloatingIcon = memo(function FloatingIcon({
  floater,
  opacity,
  amplitude,
}: {
  floater:   FloaterDef;
  opacity:   number;
  amplitude: number;
}) {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px 0px" });

  return (
    <motion.div
      ref={ref}
      className="absolute"
      style={{ left: floater.left, top: floater.top }}
      initial={{ opacity: 0, y: 28, scale: 0.78 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 1.4, delay: floater.entrance, ease: EASE_PREMIUM }}
    >
      {/* Radar behind icon */}
      {floater.radar && <RadarSweep size={floater.size} opacity={opacity} />}

      <div className="relative inline-flex">
        {/* Pulsing sonar rings */}
        {floater.rings && (
          <>
            <PulseRing delay={floater.entrance + 0.2} baseOpacity={opacity} />
            <PulseRing delay={floater.entrance + 1.1} baseOpacity={opacity} />
            <PulseRing delay={floater.entrance + 2.0} baseOpacity={opacity} />
          </>
        )}

        {/* Icon — float + optional rotation */}
        <motion.div
          animate={inView ? {
            y:      [0, -amplitude, 0],
            ...(floater.rotate ? { rotate: [0, 15, -8, 0] } : {}),
          } : {}}
          transition={{
            y: {
              duration:    floater.floatDur,
              repeat:      Infinity,
              ease:        "easeInOut",
              delay:       floater.entrance + 1.5,
              repeatDelay: 0,
            },
            ...(floater.rotate ? {
              rotate: {
                duration:    floater.floatDur * 1.5,
                repeat:      Infinity,
                ease:        "easeInOut",
                delay:       floater.entrance + 1.5,
                repeatDelay: 0,
              },
            } : {}),
          }}
        >
          <floater.Icon
            style={{
              width:   floater.size,
              height:  floater.size,
              color:   "var(--c-brand)",
              opacity,
            }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
});

// ── ConnectionLines (SVG) ─────────────────────────────────────────────────────

const ConnectionLines = memo(function ConnectionLines({ connections, opacity }: { connections: ConnDef[]; opacity: number }) {
  const ref    = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px 0px" });

  return (
    <svg
      ref={ref}
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      {connections.map((c, i) => (
        <g key={i}>
          {/* Dashed line drawing in */}
          <motion.path
            d={`M ${c.x1} ${c.y1} L ${c.x2} ${c.y2}`}
            stroke={`rgba(37,99,235,${(opacity * 1.6).toFixed(2)})`}
            strokeWidth="0.5"
            strokeDasharray="2.5 3.5"
            fill="none"
            vectorEffect="non-scaling-stroke"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={inView ? { pathLength: 1, opacity: 1 } : {}}
            transition={{
              pathLength: { duration: 2.0, delay: c.delay, ease: EASE_PREMIUM },
              opacity:    { duration: 0.5, delay: c.delay },
            }}
          />

          {/* Traveling data packet */}
          <motion.circle
            r="0.8"
            fill={`rgba(37,99,235,${Math.min(0.9, opacity * 6).toFixed(2)})`}
            vectorEffect="non-scaling-stroke"
            animate={inView ? {
              cx:      [c.x1, c.x2],
              cy:      [c.y1, c.y2],
              opacity: [0, 1, 1, 0],
            } : {}}
            transition={{
              duration:    3.5,
              delay:       c.delay + 2.4,
              repeat:      Infinity,
              repeatDelay: 2.8,
              ease:        "easeInOut",
            }}
          />
        </g>
      ))}
    </svg>
  );
});

// ── Main export ───────────────────────────────────────────────────────────────

export function VehicleBackground({
  iconOpacity    = 0.16,
  laneOpacity    = 0.15,
  laneSpeed      = 32,
  floatAmplitude = 14,
}: VehicleBackgroundConfig = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-8% 0px", amount: 0.01 });
  const shouldReduce = useReducedMotion();

  // Mobile devices don't have the GPU budget for ~20 simultaneous animations
  // per VehicleBackground instance (floaters, pulse rings, lanes, scan sweep).
  // The background is purely decorative — disable it below the sm breakpoint.
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window === "undefined" ? false : window.matchMedia("(max-width: 639px)").matches,
  );
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  if (shouldReduce || isMobile) return null;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ zIndex: 0 }}
    >
      {inView && (
        <>
      {/* ── Layer 1: Slow scan-line sweep ── */}
      <motion.div
        className="pointer-events-none absolute inset-x-0"
        style={{
          height:     "26%",
          background: "linear-gradient(to bottom, transparent, rgba(37,99,235,0.055), transparent)",
          willChange: "transform",
        }}
        animate={{ y: ["-100%", "480%"] }}
        transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
      />

      {/* ── Layer 3: SVG connection lines + data packets ── */}
      <ConnectionLines connections={CONNECTIONS} opacity={iconOpacity} />

      {/* ── Layer 4: Driving lanes ── */}
      {LANES.map((lane, i) => (
        <DrivingLane key={i} lane={lane} opacity={laneOpacity} speed={laneSpeed} />
      ))}

      {/* ── Layer 5: Floating data icons ── */}
      {FLOATERS.map((floater, i) => (
        <FloatingIcon key={i} floater={floater} opacity={iconOpacity} amplitude={floatAmplitude} />
      ))}
        </>
      )}
    </div>
  );
}
