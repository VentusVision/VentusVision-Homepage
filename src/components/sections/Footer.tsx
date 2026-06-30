import { motion } from "framer-motion";
// Ändere Zeile 3 zu:
import { ExternalLink } from "lucide-react";
import { EASE_PREMIUM } from "../../lib/motion";

const NAV = [
  {
    heading: "Product",
    links: ["Data Catalog", "Map Explorer", "Data Explorer", "Shopping Cart"],
  },
  {
    heading: "Platform",
    links: ["B2B API", "OEM Coverage", "Data Streams", "Pricing"],
  },
  {
    heading: "Project",
    links: ["SEP 2026", "Hochschule Mannheim", "Team Ventus Vision", "CARUSO GmbH"],
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

      <div className="relative mx-auto max-w-7xl px-4 sm:px-8">

        {/* ── Main grid ── */}
        <div className="grid gap-0 pb-12 pt-14 sm:gap-16 sm:pb-16 sm:pt-20 lg:grid-cols-[1fr_2fr] lg:gap-10">

          {/* Left: brand block */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE_PREMIUM }}
            className="pb-8 sm:pb-0"
          >
            {/* VentusVision logo */}
            <div
              className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white p-2 sm:mb-6 sm:h-16 sm:w-16"
              style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.12), 0 0 28px rgba(37,99,235,0.35)" }}
            >
              <img
                src={`${import.meta.env.BASE_URL}ventusvision.png`}
                alt="Ventus Vision"
                className="h-full w-full object-contain"
              />
            </div>

            <h3 className="text-lg font-bold text-white sm:text-xl">Ventus Vision</h3>
            <p className="mt-2 max-w-xs text-[13px] leading-relaxed sm:text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
              B2B prototype for the CARUSO Data Marketplace. Built as part of the
              Software Engineering Project at Hochschule Mannheim.
            </p>

            {/* Links */}
            <div className="mt-5 flex items-center gap-3 sm:mt-6 sm:gap-4">
              <motion.a
                href="https://caruso-data-marketplace.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold sm:px-4 sm:py-2"
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

              {/* GitHub Button (Icon ist jetzt oben importiert) */}
              <motion.a
              href="https://github.com/VentusVision/DummyWebseite"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.08 }}
              aria-label="GitHub repository"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border sm:h-9 sm:w-9"
              style={{ borderColor: "rgba(255,255,255,0.10)", color: "rgba(255,255,255,0.45)" }}
            >
              {/* Direktes SVG statt fehlerhaftem Import */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-3.5 w-3.5 sm:h-4 sm:w-4"
              >
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
            </motion.a>

             {/* E-Mail Button (Modernes Design, passend zu den anderen Icons) */}
              <motion.a
                href="mailto:ventusvision.sep@mail.de"
                whileHover={{ scale: 1.08 }}
                aria-label="Send email"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-colors hover:bg-white/5 hover:text-white sm:h-9 sm:w-9"
                style={{ borderColor: "rgba(255,255,255,0.10)", color: "rgba(255,255,255,0.45)" }}
                title="Schreibe uns eine E-Mail"
              >
                {/* Direktes SVG für das Mail-Icon (absolut sicher, kein Import-Stress) */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-3.5 w-3.5 sm:h-4 sm:w-4"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </motion.a>
            </div>
          </motion.div>

          {/* Mobile separator */}
          <div
            className="mb-8 h-px lg:hidden"
            style={{ background: "linear-gradient(to right, transparent, rgba(37,99,235,0.35), rgba(6,182,212,0.25), transparent)" }}
          />

          {/* Right: nav columns */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={STAGGER}
            className="grid min-w-0 grid-cols-3 gap-3 sm:gap-8"
          >
            {NAV.map((col) => (
              <motion.div key={col.heading} variants={ITEM} className="min-w-0">
                <p className="mb-3 text-[9px] font-bold uppercase tracking-[0.2em] sm:mb-4 sm:text-[11px]" style={{ color: "rgba(37,99,235,0.8)" }}>
                  {col.heading}
                </p>
                <ul className="space-y-2 sm:space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link}>
                      <span
                        className="cursor-default text-[12px] leading-snug transition-colors hover:text-white sm:text-sm"
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
            © 2026 Team Ventus Vision · Technische Hochschule Mannheim · SEP
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