import { useEffect, useRef, useState } from "react";

const POOL = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function rand() {
  return POOL[Math.floor(Math.random() * POOL.length)];
}

export interface ScrambleChar {
  display: string;
  resolved: boolean;
}

export function useVinScramble(text: string, onComplete?: () => void) {
  const [chars, setChars] = useState<ScrambleChar[]>(() =>
    text.split("").map((ch) => ({
      display: /[A-Za-z0-9]/.test(ch) ? rand() : ch,
      resolved: !/[A-Za-z0-9]/.test(ch),
    })),
  );

  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    const intervals: ReturnType<typeof setInterval>[] = [];

    const alphaIndices = text
      .split("")
      .map((ch, i) => (/[A-Za-z0-9]/.test(ch) ? i : -1))
      .filter((i) => i !== -1);

    const lastIdx = alphaIndices[alphaIndices.length - 1];

    alphaIndices.forEach((charIdx, order) => {
      const target = text[charIdx].toUpperCase();
      const flipCount = 5 + Math.floor(order * 0.35);

      const t = setTimeout(
        () => {
          let flips = 0;
          const iv = setInterval(() => {
            if (flips >= flipCount) {
              setChars((prev) => {
                const next = [...prev];
                next[charIdx] = { display: target, resolved: true };
                return next;
              });
              clearInterval(iv);
              if (charIdx === lastIdx) {
                setTimeout(() => onCompleteRef.current?.(), 220);
              }
            } else {
              setChars((prev) => {
                const next = [...prev];
                next[charIdx] = { display: rand(), resolved: false };
                return next;
              });
              flips++;
            }
          }, 50);
          intervals.push(iv);
        },
        order * 46,
      );

      timers.push(t);
    });

    return () => {
      timers.forEach(clearTimeout);
      intervals.forEach(clearInterval);
    };
  }, [text]);

  return chars;
}
