import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

import AddOneInterval from './addOneInterval.jsx';

const setup = (props = {}) => {
  const onAdd = vi.fn(() => Promise.resolve());
  const onCancel = vi.fn();
  render(<AddOneInterval fullDay={8} onAdd={onAdd} onCancel={onCancel} {...props} />);
  return { onAdd, onCancel };
};

describe('AddOneInterval', () => {
  test('prefills a full day starting at 09:00', () => {
    setup({ fullDay: 8 });

    expect(screen.getByTestId('interval-from-input')).toHaveValue('09:00');
    expect(screen.getByTestId('interval-end-input')).toHaveValue('17:00');
  });

  test('supports fractional full days', () => {
    setup({ fullDay: 7.5 });

    expect(screen.getByTestId('interval-end-input')).toHaveValue('16:30');
  });

  test('save calls onAdd with the prefilled interval', async () => {
    const { onAdd } = setup();

    fireEvent.click(screen.getByTestId('add-one-interval-save-btn'));

    await waitFor(() => expect(onAdd).toHaveBeenCalledTimes(1));
    const added = onAdd.mock.calls[0][0];
    expect(added).toMatchObject({ note: '' });
    expect(typeof added.startTime).toBe('number');
    // start and end are built from two separate `new Date()` calls, so allow for a few ms of drift
    expect(Math.abs(added.endTime - added.startTime - 8 * 60 * 60 * 1000)).toBeLessThan(1000);
  });

  test('cancel calls onCancel', () => {
    const { onCancel } = setup();

    fireEvent.click(screen.getByTestId('add-one-interval-cancel-btn'));

    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  test('shows an error when onAdd rejects', async () => {
    // The app's thunks reject with strings; the Error component only renders strings.
    setup({ onAdd: vi.fn(() => Promise.reject('Saving failed')) }); // eslint-disable-line prefer-promise-reject-errors

    fireEvent.click(screen.getByTestId('add-one-interval-save-btn'));

    expect(await screen.findByText(/Saving failed/)).toBeInTheDocument();
  });
});
