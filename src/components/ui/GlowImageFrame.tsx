import { useState, type MouseEvent, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "../../lib/utils";
import { floatLoop, springSnappy } from "../../lib/motion";

interface GlowImageFrameProps {
  src?: string;
  alt: string;
  label: string;
  float?: boolean;
  flat?: boolean;
  className?: string;
  children?: ReactNode;
}

export function GlowImageFrame({ src, alt, label, float = false, flat = false, className, children }: GlowImageFrameProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = Boolean(src) && !imageFailed;

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const rotateX = useSpring(useTransform(pointerY, [-0.5, 0.5], [8, -8]), springSnappy);
  const rotateY = useSpring(useTransform(pointerX, [-0.5, 0.5], [-8, 8]), springSnappy);

  function handleMouseMove(event: MouseEvent<HTMLDivElement>) {
    if (flat) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - bounds.left) / bounds.width - 0.5);
    pointerY.set((event.clientY - bounds.top) / bounds.height - 0.5);
  }

  function handleMouseLeave() {
    pointerX.set(0);
    pointerY.set(0);
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={flat
        ? { boxShadow: "0 0 0 1px rgba(37,99,235,0.18), 0 8px 32px rgba(37,99,235,0.12), 0 32px 80px rgba(37,99,235,0.08), 0 48px 100px rgba(15,23,42,0.08)" }
        : { rotateX, rotateY, transformPerspective: 800, boxShadow: "0 0 0 1px rgba(37,99,235,0.18), 0 8px 32px rgba(37,99,235,0.12), 0 32px 80px rgba(37,99,235,0.08), 0 48px 100px rgba(15,23,42,0.08)" }
      }
      animate={float ? floatLoop.animate : undefined}
      transition={float ? floatLoop.transition : undefined}
      whileHover={
        flat
          ? { y: -3, boxShadow: "0 16px 48px rgba(15,23,42,0.12), 0 0 0 1px rgba(37,99,235,0.12)" }
          : { scale: 1.015, boxShadow: "0 0 120px rgba(37,99,235,0.25)" }
      }
      className={cn(
        "relative flex flex-col overflow-hidden rounded-3xl border border-brand/25 bg-surface",
        className,
      )}
    >
      {/* macOS-style title bar */}
      <div className="flex shrink-0 items-center gap-1.5 border-b border-brand/10 bg-base px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
      </div>

      <div className="relative flex flex-1 items-center justify-center overflow-hidden">
        {src && (
          <img
            src={src}
            alt={alt}
            onError={() => setImageFailed(true)}
            className={cn("h-full w-full object-cover", !showImage && "hidden")}
          />
        )}
        {!showImage && !children && (
          <span className="text-sm font-medium uppercase tracking-[0.3em] text-fg-subtle">{label}</span>
        )}
        {children}
      </div>
    </motion.div>
  );
}
