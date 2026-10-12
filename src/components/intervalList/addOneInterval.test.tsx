import { type ComponentProps } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import type { NewInterval } from '#/utils/interValidator.ts';
import AddOneInterval from './addOneInterval.tsx';

const setup = (props: Partial<ComponentProps<typeof AddOneInterval>> = {}) => {
  const onAdd = vi.fn<(interval: NewInterval) => Promise<unknown>>(() => Promise.resolve());
  const onCancel = vi.fn<() => void>();
  render(<AddOneInterval fullDay={8} onAdd={onAdd} onCancel={onCancel} {...props} />);
  return { onAdd, onCancel };
};

describe('AddOneInterval', () => {
  test('prefills a full day starting at 09:00', () => {
    setup({ fullDay: 8 });

    expect(screen.getByLabelText('Starttid')).toHaveValue('09:00');
    expect(screen.getByLabelText('Sluttid')).toHaveValue('17:00');
  });

  test('supports fractional full days', () => {
    setup({ fullDay: 7.5 });

    expect(screen.getByLabelText('Sluttid')).toHaveValue('16:30');
  });

  test('save calls onAdd with the prefilled interval', async () => {
    const { onAdd } = setup();

    fireEvent.click(screen.getByRole('button', { name: 'Spara' }));

    await waitFor(() => expect(onAdd).toHaveBeenCalledTimes(1));
    const added = onAdd.mock.calls[0]?.[0];
    if (!added) throw new Error('onAdd was not called');
    expect(added).toMatchObject({ note: '' });
    expect(typeof added.startTime).toBe('number');
    // start and end come from two `new Date()` calls, so allow a few ms of drift
    expect(Math.abs((added.endTime ?? 0) - added.startTime - 8 * 60 * 60 * 1000)).toBeLessThan(
      1000,
    );
  });

  test('cancel calls onCancel', () => {
    const { onCancel } = setup();

    fireEvent.click(screen.getByRole('button', { name: 'Avbryt' }));

    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  test('shows an error when onAdd rejects', async () => {
    // The app's thunks reject with strings; the Error component only renders strings.
    setup({
      onAdd: vi.fn<(interval: NewInterval) => Promise<unknown>>(() =>
        Promise.reject('Saving failed'),
      ),
    });

    fireEvent.click(screen.getByRole('button', { name: 'Spara' }));

    expect(await screen.findByText(/Saving failed/)).toBeInTheDocument();
  });
});
