import { useEffect } from "react";
import { useLatestRef } from "./useLatestRef";

/** Runs setInterval only while enabled; always clears on disable/unmount. */
export function useIntervalWhen(
  callback: () => void,
  delayMs: number,
  enabled: boolean,
) {
  const callbackRef = useLatestRef(callback);

  useEffect(() => {
    if (!enabled) return;
    const id = setInterval(() => callbackRef.current(), delayMs);
    return () => clearInterval(id);
  }, [callbackRef, delayMs, enabled]);
}
