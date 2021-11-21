import { startTracking } from '.';

describe('js/index', () => {
  describe('startTracking', () => {
    test('append listener to root element', () => {
      const element = document.createElement('div');
      element.setAttribute('data-tracking-event', 'click');
      element.setAttribute('data-tracking-source-component', 'anything');
      const spy = jest.fn();
      startTracking(spy, { root: element });
      element.click();
      expect(spy).toHaveBeenCalledWith('click', { event: 'click', sourceComponent: 'anything' }, expect.anything());
    });
    test('append listener to children elements', () => {
      const parentElement = document.createElement('div');
      const element = document.createElement('div');
      element.setAttribute('data-tracking-event', 'click');
      element.setAttribute('data-tracking-source-component', 'anything');
      parentElement.appendChild(element);
      const spy = jest.fn();
      startTracking(spy, { root: parentElement });
      element.click();
      parentElement.click();
      expect(spy).toHaveBeenCalledWith('click', { event: 'click', sourceComponent: 'anything' }, expect.anything());
      expect(spy).toHaveBeenCalledTimes(1);
    });
    test('append listener after init', async () => {
      const parentElement = document.createElement('div');
      const element = document.createElement('div');
      element.setAttribute('data-tracking-event', 'click');
      element.setAttribute('data-tracking-source-component', 'anything');
      const spy = jest.fn();

      startTracking(spy, { root: parentElement });

      parentElement.appendChild(element);
      // Wait for observer
      await new Promise((r) => setTimeout(r, 1000));
      element.click();
      expect(spy).toHaveBeenCalledTimes(1);
    });
    test('do not listen to element not children', () => {
      const element = document.createElement('div');
      const child = document.createElement('div');
      element.appendChild(child);
      const childChild = document.createElement('div');
      childChild.setAttribute('data-tracking-event', 'click');
      child.appendChild(childChild);
      const child2 = document.createElement('div');
      element.appendChild(child2);
      const child2Child = document.createElement('div');
      child2Child.setAttribute('data-tracking-event', 'click');
      element.appendChild(child2Child);
      const spy = jest.fn();

      startTracking(spy, { root: child });
      childChild.click();
      child2Child.click();
      expect(spy).toHaveBeenCalledTimes(1);
    });
    test('do not listen to element after stop', async () => {
      const element = document.createElement('div');
      const child = document.createElement('div');
      child.setAttribute('data-tracking-event', 'click');
      const spy = jest.fn();
      const stop = startTracking(spy, { root: child });
      element.appendChild(child);
      // Wait for observer
      await new Promise((r) => setTimeout(r, 1000));
      child.click();

      stop();

      child.click();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
