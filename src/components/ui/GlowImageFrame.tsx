import { useState, type MouseEvent, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "../../lib/utils";
import { floatLoop, glowHover, springSnappy } from "../../lib/motion";

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
      style={flat ? undefined : { rotateX, rotateY, transformPerspective: 800 }}
      animate={float ? floatLoop.animate : undefined}
      transition={float ? floatLoop.transition : undefined}
      whileHover={flat ? glowHover : { scale: 1.015, boxShadow: "0 0 120px rgba(34,211,238,0.4)" }}
      className={cn(
        "relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-glow-lg backdrop-blur-xl",
        className,
      )}
    >
      <div className="flex shrink-0 items-center gap-1.5 border-b border-white/10 bg-white/[0.02] px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
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
          <span className="text-sm font-medium uppercase tracking-[0.3em] text-white/30">{label}</span>
        )}
        {children}
      </div>
    </motion.div>
  );
}
