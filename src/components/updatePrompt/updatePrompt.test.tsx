import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';

import UpdatePrompt from './updatePrompt.tsx';
import registerServiceWorker from '#/register-sw.ts';

vi.mock('#/register-sw.ts', () => ({
  __esModule: true,
  default: vi.fn<typeof registerServiceWorker>(),
}));

describe('UpdatePrompt', () => {
  let update = vi.fn<() => Promise<void>>();
  let onNeedRefresh = () => {};

  beforeEach(() => {
    update = vi.fn<() => Promise<void>>(() => Promise.resolve());
    vi.mocked(registerServiceWorker).mockImplementation((options) => {
      ({ onNeedRefresh } = options);
      return update;
    });
  });

  test('shows nothing until a new version is waiting', () => {
    render(<UpdatePrompt />);

    expect(registerServiceWorker).toHaveBeenCalledTimes(1);
    expect(screen.queryByTestId('update-prompt')).not.toBeInTheDocument();
  });

  test('announces the update and only installs it when the user asks', () => {
    render(<UpdatePrompt />);
    act(() => onNeedRefresh());

    expect(screen.getByRole('status')).toHaveTextContent('En ny version av appen finns');
    expect(update).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'Uppdatera' }));
    expect(update).toHaveBeenCalledWith(true);
  });

  test('can be dismissed without updating', () => {
    render(<UpdatePrompt />);
    act(() => onNeedRefresh());

    fireEvent.click(screen.getByRole('button', { name: 'Senare' }));

    expect(screen.queryByTestId('update-prompt')).not.toBeInTheDocument();
    expect(update).not.toHaveBeenCalled();
  });
});
