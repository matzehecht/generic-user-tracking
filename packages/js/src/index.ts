import { AutoTracingMap, AutoTracingOption, defaultAutoTracing, defaultOptions, Stop, Tracker, TrackingOptions } from './types';
import { getMatchAttribute, reduceDataset } from './utils';

const listenerRegistry: { element?: HTMLElement; listener: EventListener; type: string }[] = [];

const getAutoTracingOption = (option: AutoTracingOption): AutoTracingMap | undefined => {
  if (option === false) {
    return;
  } else if (option === true) {
    return defaultAutoTracing;
  } else if (Array.isArray(option)) {
    return {
      click: option,
    };
  } else {
    return option;
  }
};

const addListeners = (node: Node, matchString: string, tracker: Tracker, options: Required<TrackingOptions>, fixedEventType?: string) => {
  if (!(node instanceof HTMLElement || node instanceof Document)) return;

  const nodeList = node.querySelectorAll<HTMLElement>(matchString);
  const elements = Array.from(nodeList);

  if (node instanceof HTMLElement && node.matches(matchString)) {
    elements.unshift(node);
  }

  elements.forEach((element) => {
    const eventType = fixedEventType || element.dataset[`${options.prefix}Event`];

    if (!eventType) {
      const error = new Error('gut-js: HTML attribute given but empty');
      console.error(error, element);
      throw error;
    }

    const listener: EventListener = (event) => {
      if (!(event.currentTarget instanceof HTMLElement)) return;

      const currentTarget = event.currentTarget;

      const dataset = reduceDataset(options.prefix, currentTarget.dataset);

      const context = {
        id: currentTarget.id,
        element: currentTarget,
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

const searchNodes = (node: Node, tracker: Tracker, options: Required<TrackingOptions>) => {
  const matchAttribute = getMatchAttribute(options.prefix);
  addListeners(node, matchAttribute, tracker, options);

  const autoTracingOption = getAutoTracingOption(options.autoTracing);
  if (autoTracingOption) {
    Object.keys(autoTracingOption).forEach((eventType) => {
      const tagNames = autoTracingOption[eventType as keyof HTMLElementEventMap] as string[];

      tagNames.forEach((tagName) => addListeners(node, tagName, tracker, options, eventType));
    });
  }
};

const getObserver = (tracker: Tracker, options: Required<TrackingOptions>): MutationObserver => {
  return new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => searchNodes(node, tracker, options));
    });
  });
};

export const startTracking = (tracker: Tracker, trackingOptions?: TrackingOptions): Stop => {
  const options: Required<TrackingOptions> = {
    ...defaultOptions,
    ...trackingOptions,
  };

  // Add Listeners to all existing nodes that should be tracked
  searchNodes(options.root, tracker, options);

  // Add observer for adding listeners to future nodes
  const mutationObserver = getObserver(tracker, options);

  mutationObserver.observe(options.root, { childList: true, subtree: true });

  // Provide stop function for removing listeners and disconnecting observer
  const stop: Stop = () => {
    mutationObserver.disconnect();
    listenerRegistry.forEach(({ element, type, listener }) => {
      element?.removeEventListener(type, listener);
    });
  };

  return stop;
};

export { Dataset, Stop, Tracker, TrackingContext, TrackingOptions } from './types';
