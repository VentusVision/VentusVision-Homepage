# CARUSO Data Marketplace — VentusVision Homepage

> A B2B vehicle-data marketplace prototype built as a fully interactive marketing homepage — featuring live catalog search, real-time analytics, an isometric journey map, and a request workflow.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white&style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white&style=flat-square)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white&style=flat-square)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38BDF8?logo=tailwindcss&logoColor=white&style=flat-square)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-0055FF?logo=framer&logoColor=white&style=flat-square)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

---

## About

This project is the homepage frontend for the **CARUSO Data Marketplace** — a B2B platform for automotive vehicle data. It was developed as part of the **Software Engineering Project (SEP)** at [Hochschule Mannheim](https://www.hs-mannheim.de/) by Team Ventus Vision, a group of five computer science students.

[CARUSO](https://carusoiot.com/) is a real-world automotive data marketplace that connects OEMs and data consumers. This prototype simulates the customer-facing marketing homepage with fully functional, interactive UI modules that demonstrate the platform's capabilities.

The project is **not a backend service** — it is a pure frontend demo that showcases the marketplace's data catalog, analytics, and request features through an animated, component-driven interface.

---

## Features

- **Data Catalog** — Browse 120 vehicle data items across 10 categories (Charging & EV, Battery & Energy, Powertrain & Engine, etc.) with live full-text search, fuzzy matching with inline highlighting, category filter pills, sort by popularity / A–Z / Z–A / status, and an animated auto-demo mode
- **Data Explorer** — Real-time bar chart analytics with animated data transitions, simulating live vehicle telemetry insights
- **Journey Map** — 3D isometric city scene with animated route pulses, demonstrating location and navigation data use cases
- **Item Detail View** — Detailed OEM orbital visualization showing which vehicle manufacturers supply a given data item, along with API metadata and contract type
- **Shopping Cart / Request System** — Add data items to a request bag, place orders, and view order history with animated state transitions
- **Live Ticker** — Scrolling feed of recently added data signals to convey platform activity
- **Tech Stack Section** — Animated packet-stream visualization of the full architecture from OEM JSON sources through the CARUSO Hub to the dev toolchain
- **Team Section** — Pentagon constellation layout with animated network graph for the five-person student team
- **Responsive Navbar** — Fixed header with IntersectionObserver-based active-section tracking and mobile menu
- **Framer Motion animations** — Premium spring/ease animations throughout, including staggered reveals and scroll-triggered effects

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| UI Framework | React | ^19.2.6 |
| Build Tool | Vite | ^8.0.12 |
| Language | TypeScript | ~6.0.2 |
| Styling | Tailwind CSS | ^3.4.19 |
| Animation | Framer Motion | ^12.40.0 |
| Icons | Lucide React | ^1.20.0 |
| Class utilities | clsx + tailwind-merge | ^2.1.1 / ^3.6.0 |
| Linting | ESLint + typescript-eslint | ^10.3.0 / ^8.59.2 |

---

## Getting Started

### Prerequisites

- **Node.js** `>=20.x` (developed with v24.16.0)
- **npm** `>=10.x`

### Installation

```bash
git clone https://github.com/ObaiAlbek/VentusVision-Homepage.git
cd VentusVision-Homepage
npm install
```

### Development Server

```bash
npm run dev
```

Opens at `http://localhost:5173` by default (or the next available port).

### Production Build

```bash
npm run build
```

Output goes to `dist/`. The build runs TypeScript compilation (`tsc -b`) before Vite bundles the assets.

### Preview Production Build Locally

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

---

## Project Structure

```
src/
├── components/
│   ├── sections/          # Full-page sections (Hero, FeatureBentoGrid, TechStackSection, TeamSection, …)
│   └── ui/                # Reusable UI components (Navbar, HeroTripleDash, MapPreview, DataExplorerPreview, …)
├── data/
│   └── catalog.ts         # 120 DataItem entries across 10 categories + CATALOG_CATEGORIES type
├── hooks/                 # Custom React hooks
├── lib/
│   ├── motion.ts          # Shared Framer Motion easing curves and spring configs
│   └── utils.ts           # cn() utility (clsx + tailwind-merge)
├── styles/                # Global CSS and Tailwind base styles
├── types/                 # Shared TypeScript type definitions
├── App.tsx                # Root layout: section order and global wrappers
└── main.tsx               # React entry point
public/
├── CarusoBall.png         # CARUSO logo used in Tech Stack hub
└── ventusvision.png       # Team logo used in Navbar and Team constellation
```

---

## Deployment

The project is deployed to **GitHub Pages** under the repository path:

```
https://ObaiAlbek.github.io/VentusVision-Homepage/
```

The `base` path is configured in `vite.config.ts`:

```ts
export default defineConfig({
  base: '/VentusVision-Homepage/',
  plugins: [react()],
})
```

> **Important:** All `public/` asset references in the code use `import.meta.env.BASE_URL` as a prefix so that images resolve correctly both in development (`/`) and on GitHub Pages (`/VentusVision-Homepage/`).

To deploy a new version, build and push the `dist/` folder to the `gh-pages` branch, or use a GitHub Actions workflow. Example with `gh-pages`:

```bash
npm run build
npx gh-pages -d dist
```

---

## Team — Ventus Vision

Five computer science students at **Hochschule Mannheim**, Software Engineering Project (SEP) 2025/26.

| Name | Role |
|---|---|
| Dennis | Sprint Planner · Developer |
| Tim | Scrum Organizer · Developer |
| Janick | Developer |
| Obai | Developer |
| Vincent | Developer |

---

## Acknowledgements

- [CARUSO](https://carusoiot.com/) — the real automotive data marketplace this prototype is modeled after
- [Hochschule Mannheim](https://www.hs-mannheim.de/) — institution hosting the SEP course
- [Framer Motion](https://www.framer.com/motion/) — animation library
- [Lucide React](https://lucide.dev/) — icon set
- [Tailwind CSS](https://tailwindcss.com/) — utility-first styling

---

## License

This project was created for academic purposes as part of a university course. All rights reserved by Team Ventus Vision unless otherwise noted.
