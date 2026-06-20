import { motion, useReducedMotion } from "framer-motion";

/**
 * Softly drifting colour blobs — fixed in viewport, z-index: -2.
 * Adjust blob colours / opacity / blur / drift speed here:
 *
 *   bg    → blob fill colour (rgba)
 *   blur  → CSS blur radius in px  (higher = softer)
 *   dur   → seconds per drift loop  (higher = slower)
 *   xKf/yKf → pixel keyframes for the drift path
 */

interface BlobDef {
  left: string; top: string;
  w:    string; h:   string;
  bg:   string;
  blur: number;
  dur:  number;
  xKf:  number[];
  yKf:  number[];
}

const BLOBS: BlobDef[] = [
  // Top-left — soft mint/green
  {
    left: "-10%", top: "-8%", w: "58%", h: "60%",
    bg:   "rgba(167,243,208,0.52)",
    blur: 90, dur: 22,
    xKf: [0, 55, -25, 0], yKf: [0, -40, 65, 0],
  },
  // Top-right — soft cyan
  {
    left: "52%", top: "-12%", w: "56%", h: "58%",
    bg:   "rgba(165,243,252,0.46)",
    blur: 100, dur: 28,
    xKf: [0, -50, 30, 0], yKf: [0, 60, -35, 0],
  },
  // Bottom-left — soft blue
  {
    left: "-8%", top: "52%", w: "54%", h: "58%",
    bg:   "rgba(147,197,253,0.46)",
    blur: 95, dur: 24,
    xKf: [0, 45, -55, 0], yKf: [0, -50, 30, 0],
  },
  // Bottom-right — faint violet accent
  {
    left: "54%", top: "54%", w: "50%", h: "56%",
    bg:   "rgba(196,181,253,0.28)",
    blur: 110, dur: 20,
    xKf: [0, -38, 48, 0], yKf: [0, 50, -42, 0],
  },
];

export function AuroraBackground() {
  const reduced = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 overflow-hidden"
      style={{ zIndex: -2 }}
    >
      {BLOBS.map((blob, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left:       blob.left,
            top:        blob.top,
            width:      blob.w,
            height:     blob.h,
            background: blob.bg,
            filter:     `blur(${blob.blur}px)`,
            willChange: reduced ? "auto" : "transform",
          }}
          animate={reduced ? undefined : {
            x: blob.xKf,
            y: blob.yKf,
          }}
          transition={{
            duration:   blob.dur,
            repeat:     Infinity,
            ease:       "easeInOut",
            repeatType: "loop",
          }}
        />
      ))}
    </div>
  );
}
