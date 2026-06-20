import { motion } from "framer-motion";

const DATA_STREAMS = [
  "VIN Decode Stream",
  "Telemetry Feed",
  "Recall Records",
  "OEM Spec Sheets",
  "Maintenance History",
  "Fleet Diagnostics",
  "Emissions Data",
  "Resale Valuation",
];

export function DataFlowBanner() {
  const items = [...DATA_STREAMS, ...DATA_STREAMS];

  return (
    <section id="data" className="relative overflow-hidden border-y border-border bg-surface py-8">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-surface to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-surface to-transparent" />

      <motion.div
        className="flex w-max items-center gap-12"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
      >
        {items.map((label, i) => (
          <span
            key={`${label}-${i}`}
            className="flex items-center gap-3 text-lg font-medium uppercase tracking-widest text-fg-subtle"
          >
            {label}
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
          </span>
        ))}
      </motion.div>
    </section>
  );
}
