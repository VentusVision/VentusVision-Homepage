import type { Transition, Variants } from "framer-motion";

export const EASE_PREMIUM = [0.16, 1, 0.3, 1] as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 48 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE_PREMIUM },
  },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

export const staggerWords: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06 },
  },
};

export const wordReveal: Variants = {
  hidden: { y: "110%" },
  visible: {
    y: 0,
    transition: { duration: 0.8, ease: EASE_PREMIUM },
  },
};

export const floatLoop: { animate: { y: number[] }; transition: Transition } = {
  animate: { y: [0, -16, 0] },
  transition: { duration: 6, repeat: Infinity, ease: "easeInOut" },
};

export const glowHover = {
  scale: 1.03,
  borderColor: "rgba(34,211,238,0.5)",
  boxShadow: "0 0 50px rgba(34,211,238,0.25)",
};

export const springSnappy: Transition = { type: "spring", stiffness: 300, damping: 20 };
