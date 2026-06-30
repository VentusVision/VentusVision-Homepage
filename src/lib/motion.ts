import type { Transition } from "framer-motion";

export const EASE_PREMIUM = [0.16, 1, 0.3, 1] as const;
export const EASE_EXPLORER = [0.22, 1, 0.36, 1] as const;

export const floatLoop: { animate: { y: number[] }; transition: Transition } = {
  animate: { y: [0, -16, 0] },
  transition: { duration: 6, repeat: Infinity, ease: "easeInOut" },
};

export const springSnappy: Transition = { type: "spring", stiffness: 300, damping: 20 };
