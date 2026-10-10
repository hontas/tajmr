import { render, screen } from '@testing-library/react';

import notify from '#/utils/notification.ts';
import DigitalClock from './digitalClock.tsx';

vi.mock(import('#/utils/notification.ts'));

const hour = 1000 * 60 * 60;
const minute = 1000 * 60;

describe('DigitalClock', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 9, 7, 12, 0));
    vi.clearAllMocks();
  });

  afterEach(() => vi.useRealTimers());

  const renderClock = (props: Partial<Parameters<typeof DigitalClock>[0]> = {}) =>
    render(
      <DigitalClock from={Date.now() - 2 * hour} elapsed={0} notificationsEnabled {...props} />,
    );

  test('shows the elapsed time', () => {
    renderClock({ from: Date.now() - (hour + 5 * minute) });

    expect(screen.getByText('01:05')).toBeInTheDocument();
  });

  test('notifies on a full hour when notifications are on', () => {
    renderClock();

    expect(notify).toHaveBeenCalledWith('Nu har du jobbat i 2 timmar.');
  });

  test('stays quiet when notifications are off', () => {
    renderClock({ notificationsEnabled: false });

    expect(notify).not.toHaveBeenCalled();
  });

  test('stays quiet between full hours and when nothing is running', () => {
    renderClock({ from: Date.now() - (2 * hour + 5 * minute) });
    renderClock({ from: 0, elapsed: 2 * hour });

    expect(notify).not.toHaveBeenCalled();
  });
});
