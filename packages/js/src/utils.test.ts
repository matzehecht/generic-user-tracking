import { firstCharacterLowerCase, reduceDataset, stripDatasetKey } from './utils';

describe('js/utils', () => {
  describe('firstCharacterLowerCase', () => {
    test('empty', () => {
      const candidate = '';
      const res = firstCharacterLowerCase(candidate);
      expect(res).toEqual(candidate);
    });
    test('lowercase', () => {
      const candidate = 'test';
      const res = firstCharacterLowerCase(candidate);
      expect(res).toEqual(candidate);
    });
    test('uppercase', () => {
      const candidate = 'Test';
      const res = firstCharacterLowerCase(candidate);
      expect(res).toEqual('test');
    });
  });
  describe('stripDatasetKey', () => {
    const prefix = 'tracking';
    test('lowercase', () => {
      const key = 'trackingEvent';
      const res = stripDatasetKey(key, prefix);
      expect(res).toEqual('event');
    });
    test('multiple words', () => {
      const key = 'trackingSourceComponent';
      const res = stripDatasetKey(key, prefix);
      expect(res).toEqual('sourceComponent');
    });
  });
  describe('reduceDataset', () => {
    const prefix = 'tracking';
    test('empty dataset', () => {
      const dataset = {};
      const res = reduceDataset(prefix, dataset);
      expect(res).toEqual({});
    });
    test('contains all prefixed properties', () => {
      const dataset = {
        trackingEvent: 'test',
        trackingSourceComponent: 'another',
      };
      const res = reduceDataset(prefix, dataset);
      expect(res).toEqual({
        event: 'test',
        sourceComponent: 'another',
      });
    });
    test('contains no properties without prefix', () => {
      const dataset = {
        id: 'test',
        key: 'another',
      };
      const res = reduceDataset(prefix, dataset);
      expect(res).toEqual({});
    });
    test('mixed example', () => {
      const dataset = {
        id: 'test',
        key: 'another',
        trackingEvent: 'test',
        trackingSourceComponent: 'another',
      };
      const res = reduceDataset(prefix, dataset);
      expect(res).toEqual({
        event: 'test',
        sourceComponent: 'another',
      });
    });
  });
});
