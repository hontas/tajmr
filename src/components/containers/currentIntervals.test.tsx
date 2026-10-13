import { StoreProvider } from '#/store/useStore.tsx';
import { render, screen, act, within } from '@testing-library/react';

import createStore from '#/store/createStore.ts';
import type { Store } from '#/store/types.ts';
import CurrentIntervals from './currentIntervals.tsx';
import {
  intervalsFetched,
  intervalUpdateFailed,
  requestIntervalUpdate,
} from '#/store/intervals.ts';
import { intervals } from '#test/test-data.json';

describe('CurrentIntervals', () => {
  let store: Store;

  beforeEach(() => {
    store = createStore();
    store.dispatch(intervalsFetched(intervals));
  });

  const setup = () =>
    render(
      <StoreProvider store={store}>
        <CurrentIntervals />
      </StoreProvider>,
    );

  test('should render', () => {
    const { container } = setup();

    expect(container).not.toBeEmptyDOMElement();
  });

  test('has a named list of the intervals and a work button', () => {
    setup();

    expect(screen.getByRole('list', { name: 'Dagens intervall' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Börja debitera|Ta en fika/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Efterregga' })).toBeInTheDocument();
  });

  test('shows why a save failed, and clears it on the next attempt', () => {
    setup();

    act(() => {
      store.dispatch(intervalUpdateFailed('Kunde inte spara'));
    });
    expect(screen.getByText(/Kunde inte spara/)).toBeInTheDocument();

    act(() => {
      store.dispatch(requestIntervalUpdate());
    });
    expect(screen.queryByText(/Kunde inte spara/)).not.toBeInTheDocument();
  });

  describe('when the app stays open past midnight', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2021, 3, 7, 23, 50));
    });

    afterEach(() => vi.useRealTimers());

    test("yesterday's intervals leave the list of today", () => {
      store.dispatch(
        intervalsFetched({
          a: {
            startTime: new Date(2021, 3, 7, 22).getTime(),
            endTime: new Date(2021, 3, 7, 23).getTime(),
            createdAt: new Date(2021, 3, 7, 22).getTime(),
          },
        }),
      );
      setup();
      const list = screen.getByRole('list', { name: 'Dagens intervall' });
      expect(within(list).getAllByRole('listitem')).toHaveLength(1);

      act(() => {
        vi.advanceTimersByTime(20 * 60 * 1000);
      });

      expect(within(list).queryAllByRole('listitem')).toHaveLength(0);
    });
  });
});
