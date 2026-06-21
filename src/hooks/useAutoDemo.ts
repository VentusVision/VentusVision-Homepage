import { useRef, useEffect } from "react";
import type { SortKey } from "./useCatalogFilter";

type DemoStep =
  | { kind: "type";  value: string }
  | { kind: "cat";   value: string | null }
  | { kind: "sort";  value: SortKey }
  | { kind: "pause"; ms: number }
  | { kind: "clear" };

const DEMO_SEQUENCE: DemoStep[] = [
  { kind: "pause",  ms: 800 },
  { kind: "type",   value: "battery health" },
  { kind: "pause",  ms: 2400 },
  { kind: "clear" },
  { kind: "pause",  ms: 400 },
  { kind: "cat",    value: "Location & Navigation" },
  { kind: "pause",  ms: 2600 },
  { kind: "sort",   value: "az" },
  { kind: "pause",  ms: 2200 },
  { kind: "sort",   value: "popularity" },
  { kind: "cat",    value: null },
  { kind: "pause",  ms: 400 },
  { kind: "type",   value: "charging" },
  { kind: "pause",  ms: 2000 },
  { kind: "clear" },
  { kind: "pause",  ms: 400 },
  { kind: "cat",    value: "Safety & Incidents" },
  { kind: "pause",  ms: 2500 },
  { kind: "sort",   value: "newest" },
  { kind: "pause",  ms: 2000 },
  { kind: "sort",   value: "popularity" },
  { kind: "cat",    value: null },
  { kind: "pause",  ms: 400 },
];

export function useAutoDemo(
  inView: boolean,
  setQuery: (q: string) => void,
  setSelectedCat: (c: string | null) => void,
  setSortBy: (s: SortKey) => void,
) {
  // Refs persist the sequence position across inView toggles so the demo
  // continues from where it left off rather than restarting.
  const stepRef  = useRef(0);
  const charRef  = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!inView) return;

    // Function declaration is hoisted, so self-referencing setTimeout is safe.
    function run() {
      const step = DEMO_SEQUENCE[stepRef.current % DEMO_SEQUENCE.length];

      if (step.kind === "clear") {
        setQuery("");
        charRef.current = 0;
        stepRef.current++;
        timerRef.current = setTimeout(run, 60);

      } else if (step.kind === "cat") {
        setSelectedCat(step.value);
        stepRef.current++;
        timerRef.current = setTimeout(run, 60);

      } else if (step.kind === "sort") {
        setSortBy(step.value);
        stepRef.current++;
        timerRef.current = setTimeout(run, 60);

      } else if (step.kind === "pause") {
        stepRef.current++;
        timerRef.current = setTimeout(run, step.ms);

      } else if (step.kind === "type") {
        const target = step.value;
        if (charRef.current <= target.length) {
          setQuery(target.slice(0, charRef.current));
          charRef.current++;
          timerRef.current = setTimeout(run, charRef.current === 0 ? 0 : 75);
        } else {
          charRef.current = 0;
          stepRef.current++;
          timerRef.current = setTimeout(run, 60);
        }
      }
    }

    timerRef.current = setTimeout(run, 600);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [inView, setQuery, setSelectedCat, setSortBy]);
}
