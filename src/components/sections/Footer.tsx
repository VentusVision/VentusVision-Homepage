import { motion } from "framer-motion";
import { ExternalLink, Code2, Globe } from "lucide-react";
import { EASE_PREMIUM } from "../../lib/motion";

const NAV = [
  {
    heading: "Produkt",
    links: ["Data Catalog", "Map Explorer", "Data Explorer", "Shopping Cart"],
  },
  {
    heading: "Plattform",
    links: ["B2B API", "OEM Coverage", "Data Streams", "Pricing"],
  },
  {
    heading: "Projekt",
    links: ["SEP 2025/26", "Hochschule Mannheim", "Team Ventus Vision", "CARUSO GmbH"],
  },
] as const;

const STAGGER = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};
const ITEM = {
  hidden:  { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE_PREMIUM } },
};

export function Footer() {
  return (
    <footer className="relative overflow-hidden" style={{ background: "linear-gradient(160deg, #0B1629 0%, #0F1F3D 50%, #0B1629 100%)" }}>

      {/* ── Large watermark ── */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center select-none"
        aria-hidden
      >
        <span
          className="whitespace-nowrap font-extrabold tracking-tighter"
          style={{
            fontSize: "clamp(80px, 18vw, 220px)",
            color: "rgba(255,255,255,0.025)",
            letterSpacing: "-0.04em",
          }}
        >
          VENTUS
        </span>
      </div>

      {/* ── Top glow line ── */}
      <div
        className="absolute left-0 right-0 top-0 h-px"
        style={{ background: "linear-gradient(to right, transparent, rgba(37,99,235,0.6), rgba(6,182,212,0.4), transparent)" }}
      />

      <div className="relative mx-auto max-w-7xl px-8">

        {/* ── Main grid ── */}
        <div className="grid gap-16 pb-16 pt-20 lg:grid-cols-[1fr_2fr]">

          {/* Left: brand block */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE_PREMIUM }}
          >
            {/* VentusVision logo */}
            <div
              className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white p-2"
              style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.12), 0 0 28px rgba(37,99,235,0.35)" }}
            >
              <img
                src={`${import.meta.env.BASE_URL}ventusvision.png`}
                alt="Ventus Vision"
                className="h-full w-full object-contain"
              />
            </div>

            <h3 className="text-xl font-bold text-white">Ventus Vision</h3>
            <p className="mt-2 max-w-xs text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
              B2B-Prototyp für den CARUSO Data Marketplace. Entwickelt im Rahmen
              des Software Engineering Projekts an der Hochschule Mannheim.
            </p>

            {/* Links */}
            <div className="mt-6 flex items-center gap-4">
              <motion.a
                href="https://caruso-data-marketplace.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold"
                style={{
                  borderColor: "rgba(37,99,235,0.40)",
                  color: "rgba(255,255,255,0.75)",
                  background: "rgba(37,99,235,0.12)",
                }}
              >
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-70" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-400" />
                </span>
                Live Demo
                <ExternalLink className="h-3 w-3" />
              </motion.a>

              <motion.a
                href="https://github.com/VentusVision/DummyWebseite"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.08 }}
                className="flex h-9 w-9 items-center justify-center rounded-full border"
                style={{ borderColor: "rgba(255,255,255,0.10)", color: "rgba(255,255,255,0.45)" }}
              >
                <Code2 className="h-4 w-4" />
              </motion.a>

              <motion.a
                href="https://www.hs-mannheim.de"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.08 }}
                className="flex h-9 w-9 items-center justify-center rounded-full border"
                style={{ borderColor: "rgba(255,255,255,0.10)", color: "rgba(255,255,255,0.45)" }}
              >
                <Globe className="h-4 w-4" />
              </motion.a>
            </div>
          </motion.div>

          {/* Right: nav columns */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={STAGGER}
            className="grid grid-cols-3 gap-8"
          >
            {NAV.map((col) => (
              <motion.div key={col.heading} variants={ITEM}>
                <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.22em]" style={{ color: "rgba(37,99,235,0.8)" }}>
                  {col.heading}
                </p>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link}>
                      <span
                        className="cursor-default text-sm transition-colors hover:text-white"
                        style={{ color: "rgba(255,255,255,0.42)" }}
                      >
                        {link}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* ── Bottom bar ── */}
        <div
          className="flex flex-col items-center justify-between gap-4 border-t py-6 sm:flex-row"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}
        >
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.28)" }}>
            © 2026 Team Ventus Vision · Hochschule Mannheim · SEP
          </p>

          {/* Status */}
          <div className="flex items-center gap-2">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-400" />
            </span>
            <span className="text-xs" style={{ color: "rgba(255,255,255,0.32)" }}>
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
