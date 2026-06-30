import { useInView } from "framer-motion";
import type { UseInViewOptions } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { cn } from "../../lib/utils";

interface LazyWhenVisibleProps {
  children: ReactNode;
  className?: string;
  /** Preload slightly before entering the viewport */
  rootMargin?: NonNullable<UseInViewOptions["margin"]>;
}

/**
 * Mounts children only while the container intersects the viewport.
 * Unmounting stops timers, intervals, and Framer Motion loops in heavy previews.
 */
export function LazyWhenVisible({
  children,
  className,
  rootMargin = "160px 0px",
}: LazyWhenVisibleProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: rootMargin, amount: 0.02 });

  return (
    <div ref={ref} className={cn("h-full w-full", className)}>
      {inView ? children : null}
    </div>
  );
}
