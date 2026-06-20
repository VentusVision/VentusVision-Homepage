/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Keep ink for intentionally-dark elements (MonitorFrame, OBD Terminal, product previews)
        ink: "#05060b",

        // Light-theme semantic tokens (backed by CSS variables)
        base:    "var(--c-base)",
        surface: "var(--c-surface)",
        border:  "var(--c-border)",

        fg: {
          DEFAULT: "var(--c-fg)",
          muted:   "var(--c-fg-muted)",
          subtle:  "var(--c-fg-subtle)",
        },

        brand: {
          DEFAULT: "var(--c-brand)",
          hover:   "var(--c-brand-hover)",
          subtle:  "var(--c-brand-subtle)",
          muted:   "var(--c-brand-muted)",
        },

        accent: {
          DEFAULT: "var(--c-accent)",
          subtle:  "var(--c-accent-subtle)",
        },
      },

      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
      },

      boxShadow: {
        // Light-mode card shadows
        card:      "0 1px 3px rgba(15,23,42,0.05), 0 1px 2px rgba(15,23,42,0.03)",
        "card-md": "0 4px 16px rgba(15,23,42,0.07), 0 2px 4px rgba(15,23,42,0.04)",
        "card-lg": "0 10px 40px rgba(15,23,42,0.09), 0 4px 8px rgba(15,23,42,0.04)",
        // Brand-blue glow (for CTA / focused elements)
        brand:     "0 0 0 3px rgba(37,99,235,0.12), 0 4px 24px rgba(37,99,235,0.18)",
        // Keep cyan glows for the intentionally-dark MonitorFrame / OBD terminal sections
        glow:      "0 0 40px rgba(34,211,238,0.45)",
        "glow-lg": "0 0 100px rgba(34,211,238,0.25)",
      },

      backgroundImage: {
        // Updated to soft blue-tinted radial for light hero
        "radial-glow": "radial-gradient(ellipse at 50% 0%, rgba(37,99,235,0.06) 0%, transparent 68%)",
      },
    },
  },
  plugins: [],
}
