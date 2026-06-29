import { useCallback, useEffect, useRef, useState } from "react";

/** Adjust demo pacing here — all values in milliseconds */
export const DEMO_TIMING = {
  /** Wait after becoming visible before the first automated step */
  initialDelay: 1_400,
  /** Pause after opening the dropdown before highlighting an item */
  afterDropdownOpen: 380,
  /** How long the dropdown item stays highlighted before "click" */
  highlightBeforeSelect: 420,
  /** Wait for bar morph / grow animation after a selection */
  chartSettle: 950,
  /** Pause between consecutive selections within the same view */
  betweenSelections: 700,
  /** Pause before toggling the axis switch */
  beforeSwitchAxes: 900,
  /** Wait after axis switch for the transition to finish */
  afterSwitchAxes: 1_100,
  /** Random picks per view before switching axes */
  selectionsPerView: 3,
  /** Resume auto-demo after the last user interaction */
  resumeAfterInteraction: 10_000,
} as const;

export interface UseDataExplorerAutoDemoOptions {
  inView: boolean;
  mode: string;
  selectedKey: string;
  getItemKeys: (mode: string) => string[];
  setDropdownOpen: (open: boolean) => void;
  onSelect: (key: string) => void;
  onSwitchAxes: () => void;
}

export interface AutoDemoControls {
  demoHighlightKey: string | null;
  onUserInteraction: () => void;
  isDemoPaused: boolean;
}

function pickRandomKey(keys: string[], exclude: string): string {
  const pool = keys.filter((k) => k !== exclude);
  if (pool.length === 0) return keys[0] ?? exclude;
  return pool[Math.floor(Math.random() * pool.length)]!;
}

export function useDataExplorerAutoDemo({
  inView,
  mode,
  selectedKey,
  getItemKeys,
  setDropdownOpen,
  onSelect,
  onSwitchAxes,
}: UseDataExplorerAutoDemoOptions): AutoDemoControls {
  const [demoHighlightKey, setDemoHighlightKey] = useState<string | null>(null);
  const [isDemoPaused, setIsDemoPaused] = useState(false);
  const [resumeTick, setResumeTick] = useState(0);

  const pausedRef = useRef(false);
  const mountedRef = useRef(true);
  const inViewRef = useRef(inView);
  const selectedKeyRef = useRef(selectedKey);
  const modeRef = useRef(mode);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sequenceIdRef = useRef(0);

  useEffect(() => { inViewRef.current = inView; }, [inView]);
  useEffect(() => { selectedKeyRef.current = selectedKey; }, [selectedKey]);
  useEffect(() => { modeRef.current = mode; }, [mode]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  const wait = useCallback(
    (ms: number) =>
      new Promise<void>((resolve) => {
        const id = setTimeout(resolve, ms);
        timersRef.current.push(id);
      }),
    [],
  );

  const shouldAbort = useCallback(
    () => !mountedRef.current || pausedRef.current || !inViewRef.current,
    [],
  );

  const resetDemoVisuals = useCallback(() => {
    setDropdownOpen(false);
    setDemoHighlightKey(null);
  }, [setDropdownOpen]);

  const pauseDemo = useCallback(() => {
    pausedRef.current = true;
    sequenceIdRef.current += 1;
    setIsDemoPaused(true);
    clearTimers();
    resetDemoVisuals();

    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      if (!mountedRef.current || !inViewRef.current) return;
      pausedRef.current = false;
      setIsDemoPaused(false);
      setResumeTick((t) => t + 1);
    }, DEMO_TIMING.resumeAfterInteraction);
  }, [clearTimers, resetDemoVisuals]);

  const onUserInteraction = useCallback(() => {
    pauseDemo();
  }, [pauseDemo]);

  const runSelectionRound = useCallback(
    async (sequenceId: number) => {
      setDropdownOpen(true);
      await wait(DEMO_TIMING.afterDropdownOpen);
      if (shouldAbort() || sequenceIdRef.current !== sequenceId) return;

      const key = pickRandomKey(
        getItemKeys(modeRef.current),
        selectedKeyRef.current,
      );
      setDemoHighlightKey(key);
      await wait(DEMO_TIMING.highlightBeforeSelect);
      if (shouldAbort() || sequenceIdRef.current !== sequenceId) return;

      setDemoHighlightKey(null);
      onSelect(key);
      await wait(DEMO_TIMING.chartSettle);
    },
    [getItemKeys, onSelect, setDropdownOpen, shouldAbort, wait],
  );

  const runSequence = useCallback(async () => {
    const sequenceId = ++sequenceIdRef.current;
    clearTimers();
    resetDemoVisuals();

    await wait(DEMO_TIMING.initialDelay);
    if (shouldAbort() || sequenceIdRef.current !== sequenceId) return;

    for (;;) {
      for (let i = 0; i < DEMO_TIMING.selectionsPerView; i++) {
        if (shouldAbort() || sequenceIdRef.current !== sequenceId) return;
        await runSelectionRound(sequenceId);
        if (shouldAbort() || sequenceIdRef.current !== sequenceId) return;
        if (i < DEMO_TIMING.selectionsPerView - 1) {
          await wait(DEMO_TIMING.betweenSelections);
        }
      }

      if (shouldAbort() || sequenceIdRef.current !== sequenceId) return;
      await wait(DEMO_TIMING.beforeSwitchAxes);
      if (shouldAbort() || sequenceIdRef.current !== sequenceId) return;

      onSwitchAxes();
      await wait(DEMO_TIMING.afterSwitchAxes);
    }
  }, [
    clearTimers,
    onSwitchAxes,
    resetDemoVisuals,
    runSelectionRound,
    shouldAbort,
    wait,
  ]);

  useEffect(() => {
    mountedRef.current = true;

    if (!inView) {
      sequenceIdRef.current += 1;
      clearTimers();
      resetDemoVisuals();
      return;
    }

    if (pausedRef.current) return;

    void runSequence();

    return () => {
      sequenceIdRef.current += 1;
      clearTimers();
      resetDemoVisuals();
    };
  }, [inView, resumeTick, runSequence, clearTimers, resetDemoVisuals]);

  useEffect(
    () => () => {
      mountedRef.current = false;
      sequenceIdRef.current += 1;
      clearTimers();
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    },
    [clearTimers],
  );

  return { demoHighlightKey, onUserInteraction, isDemoPaused };
}
