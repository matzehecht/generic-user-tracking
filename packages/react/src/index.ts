import { useEffect } from 'react';
import { startTracking, Tracker, TrackingOptions } from 'gut-js';

export const useTracking = (tracker: Tracker, trackingOptions?: TrackingOptions) => {
  useEffect(() => startTracking(tracker, trackingOptions), [tracker, trackingOptions]);
};
