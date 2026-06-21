import { useState, useEffect, useMemo, useCallback } from "react";
import type { DataItem } from "../data/catalog";

export type SortKey = "popularity" | "az" | "za" | "newest";

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "popularity",  label: "Popularity"       },
  { value: "az",          label: "Alphabetical A–Z"  },
  { value: "za",          label: "Alphabetical Z–A"  },
  { value: "newest",      label: "Newest first"      },
];

export function useCatalogFilter(items: DataItem[]) {
  const [query,       setQuery]       = useState("");
  const [debouncedQ,  setDebouncedQ]  = useState("");
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [sortBy,      setSortBy]      = useState<SortKey>("popularity");
  const [highlightOn, setHighlightOn] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(query.trim()), 200);
    return () => clearTimeout(t);
  }, [query]);

  const filtered = useMemo(() => {
    let result = [...items];

    if (selectedCat) result = result.filter(i => i.category === selectedCat);

    if (debouncedQ) {
      const words = debouncedQ.toLowerCase().split(/\s+/).filter(Boolean);
      result = result.filter(item => {
        const hay = `${item.title} ${item.description} ${item.category} ${item.suppliers.join(" ")}`.toLowerCase();
        return words.every(w => hay.includes(w));
      });
    }

    switch (sortBy) {
      case "az":     result.sort((a, b) => a.title.localeCompare(b.title)); break;
      case "za":     result.sort((a, b) => b.title.localeCompare(a.title)); break;
      case "newest": result.reverse(); break;
    }

    return result;
  }, [items, debouncedQ, selectedCat, sortBy]);

  const clearAll = useCallback(() => { setQuery(""); setSelectedCat(null); }, []);

  return {
    query, setQuery,
    debouncedQ,
    selectedCat, setSelectedCat,
    sortBy, setSortBy,
    highlightOn, setHighlightOn,
    filtered,
    clearAll,
  };
}
