import { useState, useRef, useEffect, useCallback } from 'react';

/**
 * Custom hook to safely handle temporary UI feedback states (e.g. "Copied!", "Jumped!").
 * Automatically cancels active timers on unmount or rapid re-triggering.
 */
export function useTimedFeedback<T = boolean>(initialValue: T, durationMs = 1800) {
  const [state, setState] = useState<T>(initialValue);
  const timerRef = useRef<number | null>(null);

  const trigger = useCallback(
    (value: T) => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
      setState(value);
      timerRef.current = window.setTimeout(() => {
        setState(initialValue);
        timerRef.current = null;
      }, durationMs);
    },
    [initialValue, durationMs]
  );

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  return [state, trigger] as const;
}
