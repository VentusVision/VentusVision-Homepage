import { motion } from "framer-motion";

export function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-ink px-6 py-16 text-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: -8 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-cyan-400/20 to-blue-600/20 shadow-glow"
        >
          <span className="text-lg font-bold tracking-tighter text-cyan-300">VV</span>
        </motion.div>

        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-white/30">CARUSO Data Marketplace</p>
          <p className="mt-3 text-2xl font-semibold tracking-tight">Developed by Team Ventus Vision</p>
        </div>

        <div className="flex items-center gap-6 text-sm text-white/40">
          <span>&copy; 2026 Ventus Vision</span>
          <span className="h-1 w-1 rounded-full bg-white/20" />
          <span>All systems operational</span>
        </div>
      </div>
    </footer>
  );
}
