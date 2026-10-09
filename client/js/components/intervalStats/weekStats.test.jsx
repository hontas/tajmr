import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import WeekStats from './weekStats.jsx';
import { oneWeek } from '../../utils/time';

const hour = 60 * 60 * 1000;
// Wednesday 7 April 2021
const wednesday = new Date(2021, 3, 7, 9).getTime();
const userSettings = {
  displayNotifications: false,
  displayPreviousIntervals: false,
  hoursInWeek: 40,
};

const setup = (props = {}) => {
  const fetchIntervalsInWeek = vi.fn();
  render(
    <WeekStats
      intervals={[]}
      timestamp={wednesday}
      userSettings={userSettings}
      fetchIntervalsInWeek={fetchIntervalsInWeek}
      {...props}
    />,
  );
  return { fetchIntervalsInWeek };
};

describe('WeekStats', () => {
  beforeEach(() => {
    vi.useFakeTimers('modern');
    vi.setSystemTime(new Date(2021, 3, 7, 18));
  });

  afterEach(() => vi.useRealTimers());

  test('shows the work week (Mon-Fri) when there are no intervals', () => {
    setup();
    expect(screen.getAllByTestId('week-stats-item')).toHaveLength(5);
  });

  test('shows the week number', () => {
    setup({ intervals: [{ id: 'a', startTime: wednesday, endTime: wednesday + hour }] });
    expect(screen.getByText(/v\.14/)).toBeInTheDocument();
  });

  test('includes weekend days only when they have intervals', () => {
    const saturday = new Date(2021, 3, 10, 10).getTime();
    setup({ intervals: [{ id: 's', startTime: saturday, endTime: saturday + hour }] });
    expect(screen.getAllByTestId('week-stats-item')).toHaveLength(6);
  });

  test('renders the duration of a day with intervals', () => {
    setup({
      intervals: [
        { id: 'a', startTime: wednesday, endTime: wednesday + 2 * hour },
        { id: 'b', startTime: wednesday + 3 * hour, endTime: wednesday + 4 * hour },
      ],
    });
    expect(screen.getAllByText('03:00').length).toBeGreaterThan(0);
  });

  test('previous / next week fetch the neighbouring week', () => {
    const { fetchIntervalsInWeek } = setup();

    fireEvent.click(screen.getByTestId('prev-week-btn'));
    expect(fetchIntervalsInWeek).toHaveBeenLastCalledWith(wednesday - oneWeek);

    fireEvent.click(screen.getByTestId('next-week-btn'));
    expect(fetchIntervalsInWeek).toHaveBeenLastCalledWith(wednesday + oneWeek);
  });
});
