import { useEffect, useState, type RefObject } from "react";

/** Observes element height via ResizeObserver with cleanup on unmount. */
export function useElementHeight(ref: RefObject<HTMLElement | null>): number {
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () => setHeight(el.offsetHeight);
    const ro = new ResizeObserver(update);
    ro.observe(el);
    update();

    return () => ro.disconnect();
  }, [ref]);

  return height;
}
