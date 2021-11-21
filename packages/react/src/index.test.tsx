import ReactDOM from 'react-dom';
import { useTracking, Tracker } from '.';

describe('js/index', () => {
  describe('useTracking', () => {
    let container: HTMLDivElement | null;
    beforeEach(() => {
      container = document.createElement('div');
      document.body.appendChild(container);
    });
    afterEach(() => {
      if (container) document.body.removeChild(container);
      container = null;
    });
    test('append listener to existing component', async () => {
      const spy = jest.fn();
      function TestComponent({ tracker }: { tracker: Tracker }) {
        useTracking(tracker);

        return (
          <button data-tracking-event="click" data-tracking-source-component="anything">
            Test
          </button>
        );
      }

      ReactDOM.render(<TestComponent tracker={spy} />, container);

      const button = container?.querySelector('button');
      expect(button).toBeInstanceOf(HTMLButtonElement);
      expect(spy).toHaveBeenCalledTimes(0);

      button?.click();
      await new Promise((r) => setTimeout(r, 10));

      expect(spy).toHaveBeenCalledWith('click', { event: 'click', sourceComponent: 'anything' }, expect.anything());
      expect(spy).toHaveBeenCalledTimes(1);
    });
    test('react to changing parameters', async () => {
      function TestComponent({ tracker, prefix }: { tracker: Tracker; prefix: string }) {
        useTracking(tracker, { prefix });

        return (
          <button data-tracking-event="click" data-tracking-source-component="anything">
            Test
          </button>
        );
      }

      const spy = jest.fn();
      ReactDOM.render(<TestComponent tracker={spy} prefix={'tracking'} />, container);
      await new Promise((r) => setTimeout(r, 10));

      const firstButton = container?.querySelector('button');
      firstButton?.click();
      expect(spy).toHaveBeenCalledWith('click', { event: 'click', sourceComponent: 'anything' }, expect.anything());
      expect(spy).toHaveBeenCalledTimes(1);

      ReactDOM.render(<TestComponent tracker={spy} prefix={'tracking2'} />, container);
      await new Promise((r) => setTimeout(r, 10));

      const secondButton = container?.querySelector('button');
      secondButton?.click();
      expect(spy).toHaveBeenCalledTimes(1);
    });
    test('append listener after init', async () => {
      function TestComponent({ tracker, prefix, displayChild }: { tracker: Tracker; prefix: string; displayChild: boolean }) {
        useTracking(tracker, { prefix });

        return (
          <div>
            {displayChild && (
              <button data-tracking-event="click" data-tracking-source-component="anything">
                Test
              </button>
            )}
          </div>
        );
      }

      const spy = jest.fn();
      ReactDOM.render(<TestComponent tracker={spy} prefix={'tracking'} displayChild={false} />, container);
      await new Promise((r) => setTimeout(r, 10));

      const firstButton = container?.querySelector('button');
      firstButton?.click();
      expect(spy).toHaveBeenCalledTimes(0);

      ReactDOM.render(<TestComponent tracker={spy} prefix={'tracking'} displayChild={true} />, container);
      await new Promise((r) => setTimeout(r, 10));

      const secondButton = container?.querySelector('button');
      secondButton?.click();
      expect(spy).toHaveBeenCalledWith('click', { event: 'click', sourceComponent: 'anything' }, expect.anything());
      expect(spy).toHaveBeenCalledTimes(1);
    });
    test('do not listen to element after unmount', async () => {
      function TestComponent /* NOSONAR */({ tracker, prefix, displayChild }: { tracker: Tracker; prefix: string; displayChild: boolean }) {
        useTracking(tracker, { prefix });

        return (
          <div>
            {displayChild && (
              <button data-tracking-event="click" data-tracking-source-component="anything">
                Test
              </button>
            )}
          </div>
        );
      }

      const spy = jest.fn();
      ReactDOM.render(<TestComponent tracker={spy} prefix={'tracking'} displayChild={true} />, container);
      await new Promise((r) => setTimeout(r, 10));

      const firstButton = container?.querySelector('button');
      firstButton?.click();
      expect(spy).toHaveBeenCalledWith('click', { event: 'click', sourceComponent: 'anything' }, expect.anything());
      expect(spy).toHaveBeenCalledTimes(1);

      ReactDOM.render(<TestComponent tracker={spy} prefix={'tracking'} displayChild={false} />, container);
      await new Promise((r) => setTimeout(r, 10));

      const secondButton = container?.querySelector('button');
      secondButton?.click();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
