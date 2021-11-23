export type Dataset = {
  [key: string]: string | undefined;
};

export type TrackingContext = {
  id: string;
  event: Event;
  location: Location;
  element: HTMLElement;
};

export type Tracker = (eventType: string, dataset: Dataset, context: TrackingContext) => void;

export type AutoTracingMap = Partial<Record<keyof HTMLElementEventMap, string[]>>;
export type AutoTracingOption = boolean | string[] | AutoTracingMap;

export type TrackingOptions = {
  prefix?: string;
  root?: Node;
  autoTracing?: AutoTracingOption;
};

export type Stop = () => void;

export const defaultOptions: Required<TrackingOptions> = {
  prefix: 'tracking',
  root: document,
  autoTracing: false,
};

export const defaultAutoTracing: AutoTracingMap = {
  click: ['button', 'a'],
};
