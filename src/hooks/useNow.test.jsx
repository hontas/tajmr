import React from 'react';
import { render, screen, act } from '@testing-library/react';
import useNow from './useNow';

const Now = () => <output>{useNow(1000)}</output>;

describe('useNow', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2021, 3, 7, 18));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns the current time and refreshes it every interval', () => {
    render(<Now />);
    const start = Date.now();
    expect(screen.getByRole('status')).toHaveTextContent(String(start));

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByRole('status')).toHaveTextContent(String(start + 1000));
  });

  it('stops refreshing after unmount', () => {
    const { unmount } = render(<Now />);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});
