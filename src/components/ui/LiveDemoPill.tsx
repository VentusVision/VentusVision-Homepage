import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { springSnappy } from "../../lib/motion";

const DEMO_URL = "https://caruso-data-marketplace.vercel.app/";
const DOMAIN   = "caruso-data-marketplace.vercel.app";

export function LiveDemoPill() {
  return (
    <motion.div
      initial={{ y: 32, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 2.8, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="pointer-events-none fixed bottom-7 left-1/2 z-50 -translate-x-1/2"
    >
      {/* Ambient glow behind the pill */}
      <div
        aria-hidden
        className="absolute inset-x-4 -bottom-3 h-6 rounded-full blur-xl"
        style={{ background: "rgba(34,211,238,0.18)" }}
      />

      <motion.a
        href={DEMO_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="pointer-events-auto relative flex items-center gap-3 rounded-full border border-white/[0.12] bg-[#05060b]/85 px-5 py-2.5 backdrop-blur-2xl"
        whileHover={{
          scale: 1.03,
          borderColor: "rgba(34,211,238,0.3)",
          boxShadow: "0 0 40px rgba(34,211,238,0.2)",
        }}
        whileTap={{ scale: 0.97 }}
        transition={springSnappy}
      >
        {/* Live indicator */}
        <span className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-green-400">
            Live
          </span>
        </span>

        {/* Divider */}
        <span className="h-3.5 w-px shrink-0 bg-white/15" />

        {/* Domain */}
        <span className="font-mono text-[11px] text-white/45 transition-colors duration-200 group-hover:text-white/70">
          {DOMAIN}
        </span>

        {/* Arrow */}
        <ExternalLink className="h-3 w-3 shrink-0 text-white/30" />
      </motion.a>
    </motion.div>
  );
}
