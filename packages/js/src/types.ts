export type Dataset = {
  [key: string]: string | undefined;
};

export type TrackingContext = {
  event: Event;
  location: Location;
  element: HTMLElement;
};

export type Tracker = (eventType: string, dataset: Dataset, context: TrackingContext) => void;

export type TrackingOptions = {
  prefix?: string;
  root?: Node;
};

export type Stop = () => void;
