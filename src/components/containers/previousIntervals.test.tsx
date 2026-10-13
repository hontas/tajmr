import { StoreProvider } from '#/store/useStore.tsx';
import { render, screen, act, within } from '@testing-library/react';

import createStore from '#/store/createStore.ts';
import type { Store } from '#/store/types.ts';
import PreviousIntervals from './previousIntervals.tsx';
import { intervalsFetched } from '#/store/intervals.ts';
import { updateSettings } from '#/store/userSettings.ts';
import { intervals } from '#test/test-data.json';

describe('PreviousIntervals', () => {
  let store: Store;

  beforeEach(() => {
    store = createStore();
    const { userSettings } = store.getState();
    const updatedUserSettings = {
      ...userSettings,
      displayPreviousIntervals: true,
    };
    store.dispatch(updateSettings(updatedUserSettings));
    store.dispatch(intervalsFetched(intervals));
  });

  test('should render', () => {
    const { container } = render(
      <StoreProvider store={store}>
        <PreviousIntervals />
      </StoreProvider>,
    );

    expect(container).not.toBeEmptyDOMElement();
  });

  test('has a named list of the intervals', () => {
    render(
      <StoreProvider store={store}>
        <PreviousIntervals />
      </StoreProvider>,
    );

    expect(screen.getByRole('list', { name: 'Tidigare intervall' })).toBeInTheDocument();
  });

  describe('when the app stays open past midnight', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2021, 3, 7, 23, 50));
    });

    afterEach(() => vi.useRealTimers());

    test("yesterday's intervals move to the previous ones", () => {
      store.dispatch(
        intervalsFetched({
          a: {
            startTime: new Date(2021, 3, 7, 22).getTime(),
            endTime: new Date(2021, 3, 7, 23).getTime(),
            createdAt: new Date(2021, 3, 7, 22).getTime(),
          },
        }),
      );
      render(
        <StoreProvider store={store}>
          <PreviousIntervals />
        </StoreProvider>,
      );
      const list = screen.getByRole('list', { name: 'Tidigare intervall' });
      expect(within(list).queryAllByRole('listitem')).toHaveLength(0);

      act(() => {
        vi.advanceTimersByTime(20 * 60 * 1000);
      });

      expect(within(list).getAllByRole('listitem')).toHaveLength(1);
    });
  });
});
