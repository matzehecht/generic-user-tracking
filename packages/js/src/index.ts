import { Stop, Tracker, TrackingOptions } from './types';
import { getMatchAttribute, reduceDataset } from './utils';

const listenerRegistry: { element?: HTMLElement; listener: EventListener; type: string }[] = [];

const addListeners = (node: Node, tracker: Tracker, prefix: string) => {
  // Only track HTMLElements
  if (!(node instanceof HTMLElement || node instanceof Document)) return;

  const matchAttribute = getMatchAttribute(prefix);

  const nodeList = node.querySelectorAll<HTMLElement>(matchAttribute);
  const elements = Array.from(nodeList);

  if (node instanceof HTMLElement && node.matches(matchAttribute)) {
    elements.unshift(node);
  }

  elements.forEach((element) => {
    const eventType = element.dataset[`${prefix}Event`];

    if (!eventType) {
      const error = new Error('gut-js: HTML attribute given but empty');
      console.error(error, element);
      throw error;
    }

    const listener: EventListener = (event) => {
      if (!(event.currentTarget instanceof HTMLElement)) return;

      const currentTarget = event.currentTarget;

      const dataset = reduceDataset(prefix, currentTarget.dataset);

      const context = {
        element: event.currentTarget,
        event,
        location: window.location,
      };

      tracker(event.type, dataset, context);
    };

    element.addEventListener(eventType, listener);

    listenerRegistry.push({
      element,
      type: eventType,
      listener,
    });
  });
};

const getObserver = (tracker: Tracker, prefix: string): MutationObserver => {
  return new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => addListeners(node, tracker, prefix));
    });
  });
};

const defaultOptions: Required<TrackingOptions> = {
  prefix: 'tracking',
  root: document,
};

export const startTracking = (tracker: Tracker, trackingOptions?: TrackingOptions): Stop => {
  const options: Required<TrackingOptions> = {
    ...defaultOptions,
    ...trackingOptions,
  };

  addListeners(options.root, tracker, options.prefix);

  const mutationObserver = getObserver(tracker, options.prefix);

  mutationObserver.observe(options.root, { childList: true, subtree: true });

  const stop: Stop = () => {
    mutationObserver.disconnect();
    listenerRegistry.forEach(({ element, type, listener }) => {
      element?.removeEventListener(type, listener);
    });
  };

  return stop;
};

export { Dataset, Stop, Tracker, TrackingContext, TrackingOptions } from './types';
