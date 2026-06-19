import { motion } from "framer-motion";

interface TrailDef {
  x: number;
  duration: number;
  delay: number;
  rear: boolean;
  w: number;
  h: number;
}

const TRAILS: TrailDef[] = [
  // Left lanes — headlights (white/blue, oncoming)
  { x: 20, duration: 3.4, delay: 0.0, rear: false, w: 2,   h: 180 },
  { x: 24, duration: 5.1, delay: 2.5, rear: false, w: 1.5, h: 110 },
  { x: 20, duration: 4.0, delay: 4.9, rear: false, w: 2,   h: 155 },
  { x: 36, duration: 3.2, delay: 1.3, rear: false, w: 2,   h: 165 },
  { x: 40, duration: 4.7, delay: 3.3, rear: false, w: 1.5, h: 100 },
  { x: 36, duration: 5.5, delay: 6.1, rear: false, w: 1,   h: 80  },

  // Right lanes — taillights (red, receding)
  { x: 60, duration: 3.6, delay: 0.7, rear: true,  w: 2,   h: 170 },
  { x: 64, duration: 4.4, delay: 2.7, rear: true,  w: 1.5, h: 120 },
  { x: 76, duration: 3.3, delay: 0.2, rear: true,  w: 2,   h: 165 },
  { x: 80, duration: 5.0, delay: 3.9, rear: true,  w: 1,   h: 95  },
  { x: 76, duration: 4.1, delay: 5.6, rear: true,  w: 2,   h: 140 },
  { x: 64, duration: 3.8, delay: 1.0, rear: true,  w: 1.5, h: 105 },
];

function Trail({ x, duration, delay, rear, w, h }: TrailDef) {
  const head = rear ? "rgba(239,68,68,1)"    : "rgba(255,255,255,1)";
  const mid  = rear ? "rgba(239,68,68,0.38)" : "rgba(190,220,255,0.42)";
  const glow = rear ? "rgba(239,68,68,0.7)"  : "rgba(255,255,255,0.75)";
  const halo = rear ? "rgba(239,68,68,0.14)" : "rgba(200,230,255,0.1)";

  return (
    <motion.span
      aria-hidden
      className="pointer-events-none absolute top-0 rounded-full"
      style={{
        left: `${x}%`,
        translateX: "-50%",
        width: w,
        height: h,
        background: `linear-gradient(to bottom, ${head} 0%, ${mid} 58%, transparent 100%)`,
        boxShadow: `0 0 ${w * 4}px ${glow}, 0 0 ${w * 14}px ${halo}`,
      }}
      animate={{ y: ["105vh", `${-(h + 60)}px`] }}
      transition={{ duration, delay, repeat: Infinity, ease: "linear" }}
    />
  );
}

export function HighwayBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{
        maskImage:
          "linear-gradient(to bottom, transparent 0%, black 18%, black 72%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent 0%, black 18%, black 72%, transparent 100%)",
      }}
    >
      {/* Road surfaces — barely-there tint */}
      <div className="absolute inset-y-0 left-[16%] w-[28%] bg-white/[0.013]" />
      <div className="absolute inset-y-0 right-[16%] w-[28%] bg-white/[0.013]" />

      {/* Lane markings */}
      {[28, 50, 72].map((pos) => (
        <div
          key={pos}
          className="absolute inset-y-0"
          style={{
            left: `${pos}%`,
            width: 1,
            backgroundImage:
              "repeating-linear-gradient(to bottom, rgba(255,255,255,0.09) 0px, rgba(255,255,255,0.09) 22px, transparent 22px, transparent 48px)",
          }}
        />
      ))}

      {TRAILS.map((t, i) => (
        <Trail key={i} {...t} />
      ))}
    </div>
  );
}
