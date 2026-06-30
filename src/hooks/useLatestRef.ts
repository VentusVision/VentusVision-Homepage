import { useRef } from "react";

/** Keeps a ref in sync with the latest value without an extra useEffect. */
export function useLatestRef<T>(value: T) {
  const ref = useRef(value);
  ref.current = value;
  return ref;
}
