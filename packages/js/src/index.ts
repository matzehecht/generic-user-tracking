import { Stop, Tracker, TrackingOptions } from './types';
import { getMatchAttribute, reduceDataset } from './utils';

const listenerRegistry: { element?: HTMLElement; listener: EventListener; type: string }[] = [];

const addListeners = (node: Node, tracker: Tracker, prefix: string) => {
  // Only track HTMLElements
  if (!(node instanceof HTMLElement)) return;

  const matchAttribute = getMatchAttribute(prefix);

  const nodeList = node.querySelectorAll<HTMLElement>(matchAttribute);
  const elements = Array.from(nodeList);

  if (node.matches(matchAttribute)) {
    elements.unshift(node);
  }

  elements.forEach((element) => {
    const eventType = element.dataset[`${prefix}Event`];

    if (!eventType) {
      const error = new Error('gu-tracking: HTML attribute given but empty');
      console.error(error, element);
      throw error;
    }

    const listener: EventListener = (event) => {
      const dataset = reduceDataset(prefix, element.dataset);

      const context = {
        element,
        event,
        location: window.location,
      };

      tracker(eventType, dataset, context);
    };

    listenerRegistry.push({
      element,
      type: eventType,
      listener,
    });

    element.addEventListener(eventType, listener);
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
