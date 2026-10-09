import React from 'react';
import { Provider } from 'react-redux';
import { render, screen } from '@testing-library/react';

import IntervalStats from './intervalStats.jsx';
import createStore from '../../redux/createStore';
import { intervalsFetched } from '../../redux/intervals';

const hour = 60 * 60 * 1000;
const day = (d, h = 9) => new Date(2021, 3, d, h).getTime();

const renderWith = (intervals) => {
  const store = createStore();
  store.dispatch(intervalsFetched(intervals));
  return render(
    <Provider store={store}>
      <IntervalStats />
    </Provider>,
  );
};

describe('IntervalStats', () => {
  test('renders nothing for no intervals', () => {
    const { container } = renderWith({});
    expect(container.querySelector('.interval-stats')).toBeEmptyDOMElement();
  });

  test('sums the time per day', () => {
    renderWith({
      a: { startTime: day(7, 9), endTime: day(7, 9) + 2 * hour },
      b: { startTime: day(7, 13), endTime: day(7, 13) + hour },
      c: { startTime: day(6, 9), endTime: day(6, 9) + hour },
    });

    expect(screen.getByText('03:00')).toBeInTheDocument();
    expect(screen.getByText('01:00')).toBeInTheDocument();
  });

  test('only considers the first five intervals', () => {
    const intervals = {};
    for (let i = 1; i <= 7; i += 1) {
      intervals[`i${i}`] = { startTime: day(i), endTime: day(i) + hour };
    }
    const { container } = renderWith(intervals);

    expect(container.querySelectorAll('h4')).toHaveLength(5);
  });
});
