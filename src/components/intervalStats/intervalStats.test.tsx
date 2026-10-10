import { StoreProvider } from '#/store/useStore.tsx';
import { render, screen } from '@testing-library/react';

import IntervalStats from './intervalStats.tsx';
import createStore from '#/store/createStore.ts';
import { intervalsFetched } from '#/store/intervals.ts';
import type { Interval } from '#/utils/interValidator.ts';

const hour = 60 * 60 * 1000;
const day = (d: number, h = 9) => new Date(2021, 3, d, h).getTime();

const renderWith = (intervals: Record<string, Interval>) => {
  const store = createStore();
  store.dispatch(intervalsFetched(intervals));
  return render(
    <StoreProvider store={store}>
      <IntervalStats />
    </StoreProvider>,
  );
};

describe('IntervalStats', () => {
  test('renders nothing for no intervals', () => {
    const { container } = renderWith({});
    expect(container.querySelector('.interval-stats')).toBeEmptyDOMElement();
  });

  test('sums the time per day', () => {
    renderWith({
      a: { startTime: day(7, 9), endTime: day(7, 9) + 2 * hour, createdAt: 0 },
      b: { startTime: day(7, 13), endTime: day(7, 13) + hour, createdAt: 0 },
      c: { startTime: day(6, 9), endTime: day(6, 9) + hour, createdAt: 0 },
    });

    expect(screen.getByText('03:00')).toBeInTheDocument();
    expect(screen.getByText('01:00')).toBeInTheDocument();
  });

  test('only considers the first five intervals', () => {
    const intervals: Record<string, Interval> = {};
    for (let i = 1; i <= 7; i += 1) {
      intervals[`i${i}`] = { startTime: day(i), endTime: day(i) + hour, createdAt: 0 };
    }
    const { container } = renderWith(intervals);

    expect(container.querySelectorAll('h4')).toHaveLength(5);
  });
});
