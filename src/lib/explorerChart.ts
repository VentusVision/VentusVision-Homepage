import { CATEGORIES, DATA_MATRIX, OEMS } from "../data/explorerData";

export const EXPLORER_Y_TICKS = [0, 20, 40, 60, 80, 100] as const;

export type PreviewExplorerMode = "oem-by-cat" | "cat-by-oem";

export interface PreviewExplorerBar {
  key: string;
  label: string;
  pct: number;
  color: string;
  logoFile?: string;
}

export function explorerItemKeysForMode(mode: string): string[] {
  return mode === "oem-by-cat"
    ? CATEGORIES.map((c) => c.key)
    : OEMS.map((o) => o.key);
}

export function buildPreviewExplorerBars(
  mode: PreviewExplorerMode,
  selectedCat: string,
  selectedOem: string,
  oemBarColor: string,
): PreviewExplorerBar[] {
  const bars =
    mode === "oem-by-cat"
      ? OEMS.map((o) => ({
          key: o.key,
          label: o.label,
          pct: DATA_MATRIX[o.key]?.[selectedCat] ?? 0,
          color: oemBarColor,
          logoFile: o.logoFile,
        }))
      : CATEGORIES.map((c) => ({
          key: c.key,
          label: c.label,
          pct: DATA_MATRIX[selectedOem]?.[c.key] ?? 0,
          color: c.color,
        }));

  return bars.sort((a, b) => b.pct - a.pct);
}

export function randomPreviewExplorerMode(): PreviewExplorerMode {
  return Math.random() < 0.5 ? "oem-by-cat" : "cat-by-oem";
}
