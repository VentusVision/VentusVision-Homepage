import { motion } from "framer-motion";

interface Waypoint {
  top: string;
  left: string;
}

interface RoutePulseProps {
  path: Waypoint[];
  duration?: number;
  delay?: number;
}

export function RoutePulse({ path, duration = 9, delay = 0 }: RoutePulseProps) {
  const loop = [...path, path[0]];

  return (
    <motion.div
      className="pointer-events-none absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300"
      style={{ boxShadow: "0 0 10px rgba(34,211,238,0.9), 0 0 24px rgba(34,211,238,0.5)" }}
      animate={{
        top: loop.map((point) => point.top),
        left: loop.map((point) => point.left),
      }}
      transition={{ duration, repeat: Infinity, ease: "linear", delay }}
    />
  );
}
