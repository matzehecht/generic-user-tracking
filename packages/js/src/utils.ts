import { Dataset } from './types';

export const firstCharacterLowerCase = (candidate: string) => `${candidate.charAt(0).toLowerCase()}${candidate.slice(1)}`;

export const stripDatasetKey = (key: string, prefix: string) => firstCharacterLowerCase(key.replace(prefix, ''));

export const getMatchAttribute = (prefix: string) => `[data-${prefix}-event]`;

// filter dataset for properties not containing prefix and stripping prefix
export const reduceDataset = (prefix: string, dataset: DOMStringMap) =>
  Object.keys(dataset).reduce(
    (prev, key) => (key.startsWith(prefix) ? { ...prev, [stripDatasetKey(key, prefix)]: dataset[key] } : prev),
    {} as Dataset
  );
