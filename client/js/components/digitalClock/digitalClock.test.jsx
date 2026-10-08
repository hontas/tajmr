import React from 'react';
import { render } from '@testing-library/react';

import DigitalClock from './digitalClock.jsx';
import notify from '../../utils/notification';

jest.mock('../../utils/notification', () => ({ __esModule: true, default: jest.fn() }));

const hour = 60 * 60 * 1000;

describe('DigitalClock notifications', () => {
  beforeEach(() => {
    jest.useFakeTimers('modern');
    jest.setSystemTime(new Date('2024-01-01T12:00:00Z'));
    notify.mockClear();
  });

  afterEach(() => jest.useRealTimers());

  const startedHoursAgo = (h) => Date.now() - h * hour;

  test('notifies once on a full hour, even across re-renders', () => {
    const from = startedHoursAgo(2);
    const { rerender } = render(<DigitalClock from={from} elapsed={0} notificationsEnabled />);
    rerender(<DigitalClock from={from} elapsed={0} notificationsEnabled />);
    expect(notify).toHaveBeenCalledTimes(1);
    expect(notify).toHaveBeenCalledWith('Nu har du jobbat i 2 timmar.');
  });

  test('does not notify when the setting is off', () => {
    render(<DigitalClock from={startedHoursAgo(2)} elapsed={0} notificationsEnabled={false} />);
    expect(notify).not.toHaveBeenCalled();
  });

  test('does not notify between full hours or when the clock is stopped', () => {
    render(
      <DigitalClock from={startedHoursAgo(2) - 5 * 60 * 1000} elapsed={0} notificationsEnabled />
    );
    render(<DigitalClock from={0} elapsed={2 * hour} notificationsEnabled />);
    expect(notify).not.toHaveBeenCalled();
  });
});
