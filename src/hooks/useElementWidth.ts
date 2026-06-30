import { useEffect, useState, type RefObject } from "react";

/** Observes element width via ResizeObserver with cleanup on unmount. */
export function useElementWidth(ref: RefObject<HTMLElement | null>): number {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () => setWidth(el.offsetWidth);
    if (typeof ResizeObserver === "undefined") {
      update();
      return;
    }
    const ro = new ResizeObserver(update);
    ro.observe(el);
    update();

    return () => ro.disconnect();
  }, [ref]);

  return width;
}
