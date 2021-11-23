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
    test('append listener with document as root', () => {
      const element = document.createElement('div');
      element.setAttribute('data-tracking-event', 'click');
      element.setAttribute('data-tracking-source-component', 'anything');
      document.body.appendChild(element);
      const spy = jest.fn();
      startTracking(spy, { root: document });
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
      const element = document.createElement('div');
      element.setAttribute('data-tracking-event', 'click');
      element.setAttribute('data-tracking-source-component', 'anything');
      const spy = jest.fn();

      startTracking(spy, { root: document });

      document.body.appendChild(element);
      // Wait for observer
      await new Promise((r) => setTimeout(r, 1000));
      element.click();
      expect(spy).toHaveBeenCalledTimes(1);
    });
    test('do not listen to element not children', () => {
      const child = document.createElement('div');
      document.body.appendChild(child);
      const childChild = document.createElement('div');
      childChild.setAttribute('data-tracking-event', 'click');
      child.appendChild(childChild);
      const child2 = document.createElement('div');
      document.body.appendChild(child2);
      const child2Child = document.createElement('div');
      child2Child.setAttribute('data-tracking-event', 'click');
      child2.appendChild(child2Child);
      const spy = jest.fn();

      startTracking(spy, { root: child });
      childChild.click();
      child2Child.click();
      expect(spy).toHaveBeenCalledTimes(1);
    });
    test('do not listen to element after stop', async () => {
      const child = document.createElement('div');
      child.setAttribute('data-tracking-event', 'click');
      const spy = jest.fn();
      const stop = startTracking(spy, { root: document });
      document.body.appendChild(child);
      // Wait for observer
      await new Promise((r) => setTimeout(r, 1000));
      child.click();
      expect(spy).toHaveBeenCalledTimes(1);

      stop();
      await new Promise((r) => setTimeout(r, 1000));

      child.click();
      expect(spy).toHaveBeenCalledTimes(1);
    });
    test('do not auto trace by default', async () => {
      const child1 = document.createElement('button');
      const child2 = document.createElement('a');
      document.body.appendChild(child1);
      document.body.appendChild(child2);
      const spy = jest.fn();
      startTracking(spy, { root: document });
      // Wait for observer
      await new Promise((r) => setTimeout(r, 1000));
      child1.click();
      child2.click();
      expect(spy).toHaveBeenCalledTimes(0);
    });
    test('default auto trace set', async () => {
      const child1 = document.createElement('button');
      const child2 = document.createElement('a');
      const child3 = document.createElement('div');
      document.body.appendChild(child1);
      document.body.appendChild(child2);
      document.body.appendChild(child3);
      const spy = jest.fn();
      startTracking(spy, { root: document, autoTracing: true });
      // Wait for observer
      await new Promise((r) => setTimeout(r, 1000));
      child1.click();
      child2.click();
      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy).toHaveBeenCalledWith('click', {}, expect.anything());
    });
    test('auto trace string array', async () => {
      const child1 = document.createElement('button');
      const child2 = document.createElement('a');
      document.body.appendChild(child1);
      document.body.appendChild(child2);
      const spy = jest.fn();
      startTracking(spy, { root: document, autoTracing: ['button'] });
      // Wait for observer
      await new Promise((r) => setTimeout(r, 1000));
      child1.click();
      child2.click();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('click', {}, expect.anything());
    });
    test('auto trace map', async () => {
      const child1 = document.createElement('button');
      const child2 = document.createElement('a');
      const child3 = document.createElement('div');
      document.body.appendChild(child1);
      document.body.appendChild(child2);
      document.body.appendChild(child3);
      const spy = jest.fn();
      startTracking(spy, { root: document, autoTracing: { click: ['button'], mouseenter: ['a'] } });
      // Wait for observer
      await new Promise((r) => setTimeout(r, 1000));
      child1.click();
      child2.click();
      child3.click();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('click', {}, expect.anything());
      child1.dispatchEvent(new Event('mouseenter'));
      child2.dispatchEvent(new Event('mouseenter'));
      child3.dispatchEvent(new Event('mouseenter'));
      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy).toHaveBeenCalledWith('mouseenter', {}, expect.anything());
      child1.dispatchEvent(new Event('mouseleave'));
      child2.dispatchEvent(new Event('mouseleave'));
      child3.dispatchEvent(new Event('mouseleave'));
      expect(spy).toHaveBeenCalledTimes(2);
    });
  });
});
