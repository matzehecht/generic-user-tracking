import * as React from 'react';
import '@testing-library/jest-dom';
import { useTracking, Tracker } from '.';
import { render, screen } from '@testing-library/react';

describe('js/index', () => {
  describe('useTracking', () => {
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

      render(<TestComponent tracker={spy} />);

      const button = await screen.findByRole('button');
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
      const { rerender } = render(<TestComponent tracker={spy} prefix={'tracking'} />);
      await new Promise((r) => setTimeout(r, 10));

      const firstButton = await screen.findByRole('button');
      firstButton?.click();
      expect(spy).toHaveBeenCalledWith('click', { event: 'click', sourceComponent: 'anything' }, expect.anything());
      expect(spy).toHaveBeenCalledTimes(1);

      rerender(<TestComponent tracker={spy} prefix={'tracking2'} />);
      await new Promise((r) => setTimeout(r, 10));

      const secondButton = await screen.findByRole('button');
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
      const { rerender } = render(<TestComponent tracker={spy} prefix={'tracking'} displayChild={false} />);
      await new Promise((r) => setTimeout(r, 10));

      const firstButton = screen.queryByRole('button');
      firstButton?.click();
      expect(spy).toHaveBeenCalledTimes(0);

      rerender(<TestComponent tracker={spy} prefix={'tracking'} displayChild={true} />);
      await new Promise((r) => setTimeout(r, 10));

      const secondButton = await screen.findByRole('button');
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
      const { rerender } = render(<TestComponent tracker={spy} prefix={'tracking'} displayChild={true} />);
      await new Promise((r) => setTimeout(r, 10));

      const button = await screen.findByRole('button');
      button?.click();
      expect(spy).toHaveBeenCalledWith('click', { event: 'click', sourceComponent: 'anything' }, expect.anything());
      expect(spy).toHaveBeenCalledTimes(1);

      rerender(<TestComponent tracker={spy} prefix={'tracking'} displayChild={false} />);
      await new Promise((r) => setTimeout(r, 10));

      button?.click();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
