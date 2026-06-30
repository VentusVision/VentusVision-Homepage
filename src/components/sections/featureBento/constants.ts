import { EASE_PREMIUM } from "../../../lib/motion";

export const BENTO_SHADOW =
  "0 0 0 1px rgba(37,99,235,0.22), 0 1px 3px rgba(15,23,42,0.06), 0 4px 12px rgba(37,99,235,0.10), 0 16px 40px rgba(37,99,235,0.13), 0 48px 100px rgba(37,99,235,0.08), 0 80px 140px rgba(15,23,42,0.06)";

export const BENTO_HOVER_SHADOW =
  "0 0 0 2px rgba(37,99,235,0.50), 0 2px 8px rgba(37,99,235,0.18), 0 12px 36px rgba(37,99,235,0.22), 0 40px 80px rgba(37,99,235,0.14), 0 0 70px rgba(6,182,212,0.13)";

export const TICKER_RAW = [
  "vehicleSpeed · 2m ago",
  "motorTorque · 5m ago",
  "chargingPower · 12m ago",
  "batteryCapacity · 18m ago",
  "odometer · 24m ago",
  "gearState · 31m ago",
] as const;

export const CART_ITEMS = [
  { id: 1, title: "Battery Health Index", price: "1.00 EUR" },
  { id: 2, title: "Trip Summary Data", price: "1.00 EUR" },
  { id: 3, title: "OBD-II Diagnostic Codes", price: "1.00 EUR" },
] as const;

export const ITEM_ACCENT_COLORS = ["#2563EB", "#06B6D4", "#7C3AED"] as const;
export const CONFETTI_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315] as const;
export const CONFETTI_COLORS = [
  "#2563EB", "#06B6D4", "#22c55e", "#a855f7", "#f59e0b", "#ec4899", "#6366f1", "#14b8a6",
] as const;

// ── Bento card header data ─────────────────────────────────────────────────

export const CATALOG_MOBILE_STATS = [
  { value: "433+", label: "Data"  },
  { value: "10",   label: "Kat."  },
  { value: "8+",   label: "OEM"   },
] as const;

export const CATALOG_CHIPS = [
  { value: "433+", label: "Data Items"   },
  { value: "10",   label: "Kategorien"   },
  { value: "8+",   label: "OEM-Partner"  },
] as const;

export const DETAIL_MOBILE_STATS = [
  { value: "6+",  label: "OEMs"    },
  { value: "B2C", label: "Channel" },
] as const;

export const DETAIL_CHIPS = [
  { value: "6+",  label: "OEMs"    },
  { value: "B2C", label: "Channel" },
] as const;

export const CART_MOBILE_STATS = [
  { value: "UUID", label: "Items"  },
  { value: "API",  label: "Access" },
] as const;

export const CART_CHIPS = [
  { value: "UUID", label: "Items"  },
  { value: "API",  label: "Access" },
] as const;

export const CARD_REVEAL = {
  hidden: { opacity: 0, y: 48 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.72, ease: EASE_PREMIUM },
  },
};

export const STAGGER = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14, delayChildren: 0.05 } },
};
