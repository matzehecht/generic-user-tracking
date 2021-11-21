import { useEffect } from 'react';
import { startTracking, Tracker, TrackingOptions } from 'gut-js';

export const skipTracking = Symbol('skip');
export type SkipTracking = typeof skipTracking;

export function useTracking(tracker: Tracker, optionsOrSkip?: TrackingOptions | SkipTracking): void {
  useEffect(() => {
    if (optionsOrSkip !== skipTracking) {
      return startTracking(tracker, optionsOrSkip);
    }
  }, [tracker, optionsOrSkip]);
}

export { Dataset, Stop, Tracker, TrackingContext, TrackingOptions } from 'gut-js';
