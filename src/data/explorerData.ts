// ── Types ─────────────────────────────────────────────────────────────────────
export interface Category {
  key: string;
  label: string;
  shortLabel: string;
  color: string;
  count: number; // TODO: replace with real API value
}

export interface OEM {
  key: string;
  label: string;
  logoFile: string; // filename in /public/ — already committed
}

// ── Categories ────────────────────────────────────────────────────────────────
export const CATEGORIES: Category[] = [
  { key: "charging_ev",         label: "Charging & EV",             shortLabel: "Charging",     color: "#f43f5e", count:  63 },
  { key: "battery_energy",      label: "Battery & Energy",          shortLabel: "Battery",      color: "#fb923c", count:  48 },
  { key: "powertrain_engine",   label: "Powertrain & Engine",       shortLabel: "Powertrain",   color: "#facc15", count:  72 },
  { key: "fuel_combustion",     label: "Fuel & Combustion",         shortLabel: "Fuel",         color: "#4ade80", count:  35 },
  { key: "maintenance_diag",    label: "Maintenance & Diagnostics", shortLabel: "Maintenance",  color: "#22d3ee", count: 288 },
  { key: "safety_incidents",    label: "Safety & Incidents",        shortLabel: "Safety",       color: "#818cf8", count:  54 },
  { key: "trip_driving",        label: "Trip & Driving Behavior",   shortLabel: "Trip & Drive", color: "#a855f7", count:  67 },
  { key: "location_navigation", label: "Location & Navigation",     shortLabel: "Navigation",   color: "#ec4899", count:  44 },
  { key: "body_comfort",        label: "Body, Access & Comfort",    shortLabel: "Body",         color: "#2dd4bf", count:  58 },
  { key: "connectivity_remote", label: "Connectivity & Remote",     shortLabel: "Connectivity", color: "#7c3aed", count:  39 },
];

// ── OEMs ──────────────────────────────────────────────────────────────────────
export const OEMS: OEM[] = [
  { key: "ford",       label: "Ford",             logoFile: "Ford.png"          },
  { key: "bmw",        label: "BMW",              logoFile: "BMW.png"           },
  { key: "mercedes",   label: "Mercedes-Benz",    logoFile: "Mercedes-Benz.png" },
  { key: "stellantis", label: "Stellantis",       logoFile: "Stellantis.png"    },
  { key: "porsche",    label: "Porsche",          logoFile: "Porsche.png"       },
  { key: "renault",    label: "Renault",          logoFile: "Renault.png"       },
  { key: "tesla",      label: "Tesla",            logoFile: "Tesla.png"         },
  { key: "kia",        label: "Kia",              logoFile: "Kia.png"           },
  { key: "vw_group",   label: "Volkswagen Group", logoFile: "VW.png"            },
  { key: "volvo",      label: "Volvo",            logoFile: "Volvo.png"         },
  { key: "toyota",     label: "Toyota",           logoFile: "Toyota.png"        },
];

// ── Data matrix ───────────────────────────────────────────────────────────────
// DATA_MATRIX[oemKey][categoryKey] = coverage % (0–100)
// maintenance_diag values match the real CARUSO app screenshot.
// TODO: Replace all values with real API response (same Record<string,Record<string,number>> shape).
export const DATA_MATRIX: Record<string, Record<string, number>> = {
  ford:       { charging_ev: 31.7, battery_energy: 18.6, powertrain_engine: 42.3, fuel_combustion: 68.2, maintenance_diag: 39.9, safety_incidents: 19.1, trip_driving: 12.3, location_navigation: 28.4, body_comfort: 21.5, connectivity_remote: 33.2 },
  bmw:        { charging_ev: 17.5, battery_energy: 24.1, powertrain_engine: 58.3, fuel_combustion: 22.8, maintenance_diag: 27.8, safety_incidents: 28.5, trip_driving: 31.6, location_navigation: 43.2, body_comfort: 38.7, connectivity_remote: 29.4 },
  mercedes:   { charging_ev: 14.2, battery_energy: 19.8, powertrain_engine: 51.6, fuel_combustion: 31.4, maintenance_diag: 23.3, safety_incidents: 35.7, trip_driving: 26.3, location_navigation: 39.1, body_comfort: 44.2, connectivity_remote: 18.6 },
  stellantis: { charging_ev:  8.1, battery_energy:  6.4, powertrain_engine: 29.7, fuel_combustion: 44.6, maintenance_diag: 17.7, safety_incidents: 11.3, trip_driving:  9.8, location_navigation: 12.7, body_comfort: 17.3, connectivity_remote:  8.9 },
  porsche:    { charging_ev:  1.6, battery_energy: 12.3, powertrain_engine: 37.4, fuel_combustion: 18.9, maintenance_diag: 14.6, safety_incidents: 14.2, trip_driving: 19.1, location_navigation: 21.5, body_comfort: 29.3, connectivity_remote: 11.7 },
  renault:    { charging_ev:  9.5, battery_energy:  4.8, powertrain_engine: 18.2, fuel_combustion: 27.3, maintenance_diag: 14.2, safety_incidents:  7.8, trip_driving:  6.2, location_navigation:  9.3, body_comfort:  8.1, connectivity_remote: 14.2 },
  tesla:      { charging_ev: 34.9, battery_energy: 42.3, powertrain_engine: 22.8, fuel_combustion:  2.1, maintenance_diag: 14.2, safety_incidents:  4.2, trip_driving: 18.4, location_navigation: 52.3, body_comfort: 15.6, connectivity_remote: 47.8 },
  kia:        { charging_ev:  7.9, battery_energy:  8.2, powertrain_engine: 24.1, fuel_combustion: 35.7, maintenance_diag:  9.7, safety_incidents:  9.6, trip_driving: 11.2, location_navigation: 14.8, body_comfort: 12.4, connectivity_remote:  7.3 },
  vw_group:   { charging_ev: 12.3, battery_energy: 15.7, powertrain_engine: 44.8, fuel_combustion: 38.2, maintenance_diag:  4.9, safety_incidents: 11.2, trip_driving:  1.7, location_navigation: 19.4, body_comfort: 23.8, connectivity_remote: 16.5 },
  volvo:      { charging_ev:  5.4, battery_energy:  2.0, powertrain_engine: 16.9, fuel_combustion: 11.8, maintenance_diag:  4.2, safety_incidents: 22.4, trip_driving: 14.7, location_navigation:  8.6, body_comfort: 31.2, connectivity_remote:  5.8 },
  toyota:     { charging_ev:  6.2, battery_energy:  9.4, powertrain_engine: 33.6, fuel_combustion: 52.4, maintenance_diag:  0.3, safety_incidents: 14.7, trip_driving:  8.8, location_navigation: 11.2, body_comfort: 19.6, connectivity_remote: 12.9 },
};
