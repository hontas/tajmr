import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import IntervalListItem from './intervalListItem.jsx';
import { getTimeString } from '../../utils/time';

const interval = {
  id: 'i1',
  startTime: new Date(2021, 3, 7, 9, 0).getTime(),
  endTime: new Date(2021, 3, 7, 17, 30).getTime(),
  note: 'Writing tests',
  notWork: false,
};

const setup = (props = {}) => {
  const onUpdate = vi.fn();
  const onDelete = vi.fn();
  render(
    <IntervalListItem interval={interval} onUpdate={onUpdate} onDelete={onDelete} {...props} />,
  );
  return { onUpdate, onDelete };
};

describe('IntervalListItem', () => {
  test('shows start and end time, note and notWork state', () => {
    setup();

    expect(screen.getByTestId('interval-from-input')).toHaveValue(
      getTimeString(interval.startTime),
    );
    expect(screen.getByTestId('interval-end-input')).toHaveValue(getTimeString(interval.endTime));
    expect(screen.getByTestId('interval-not-work-checkbox')).not.toBeChecked();
  });

  test('shows an active (disabled) end input for an interval without endTime', () => {
    setup({ interval: { ...interval, endTime: undefined } });

    expect(screen.getByTestId('interval-end-input')).toHaveValue('active');
    expect(screen.getByTestId('interval-end-input')).toBeDisabled();
  });

  test('toggling notWork calls onUpdate with the updated interval', () => {
    const { onUpdate } = setup();

    fireEvent.click(screen.getByTestId('interval-not-work-checkbox'));

    expect(onUpdate).toHaveBeenCalledWith({ ...interval, notWork: true });
  });

  test('editing the start time and blurring calls onUpdate with the new timestamp', () => {
    const { onUpdate } = setup();
    const input = screen.getByTestId('interval-from-input');

    fireEvent.change(input, { target: { value: '08:15' } });
    fireEvent.blur(input);

    expect(onUpdate).toHaveBeenCalledTimes(1);
    expect(onUpdate.mock.calls[0][0].startTime).toBe(new Date(2021, 3, 7, 8, 15).getTime());
  });

  test('an invalid time is not pushed', () => {
    const { onUpdate } = setup();
    const input = screen.getByTestId('interval-from-input');
    const logSpy = vi.spyOn(console, 'log');

    fireEvent.change(input, { target: { value: '25:99' } });
    fireEvent.blur(input);

    expect(onUpdate).not.toHaveBeenCalled();
    expect(logSpy).not.toHaveBeenCalled();
    logSpy.mockRestore();
  });

  test('delete button calls onDelete with the id', () => {
    const { onDelete } = setup();

    fireEvent.click(screen.getByTestId('remove-interval'));

    expect(onDelete).toHaveBeenCalledWith('i1');
  });

  test('no delete button without onDelete', () => {
    setup({ onDelete: undefined });

    expect(screen.queryByTestId('remove-interval')).not.toBeInTheDocument();
  });
});
