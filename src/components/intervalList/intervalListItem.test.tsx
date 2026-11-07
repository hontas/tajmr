import { type ComponentProps } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import IntervalListItem, { type EditableInterval } from './intervalListItem.tsx';
import { getTimeString } from '#/utils/time.ts';

const endTime = new Date(2021, 3, 7, 17, 30).getTime();

const interval: EditableInterval = {
  id: 'i1',
  startTime: new Date(2021, 3, 7, 9, 0).getTime(),
  endTime,
  note: 'Writing tests',
  notWork: false,
};

const setup = (props: Partial<ComponentProps<typeof IntervalListItem>> = {}) => {
  const onUpdate = vi.fn<(updated: EditableInterval) => void>();
  const onDelete = vi.fn<(id: string | undefined) => void>();
  render(
    <IntervalListItem interval={interval} onUpdate={onUpdate} onDelete={onDelete} {...props} />,
  );
  return { onUpdate, onDelete };
};

describe('IntervalListItem', () => {
  test('shows start and end time, note and notWork state', () => {
    setup();

    expect(screen.getByLabelText('Starttid')).toHaveValue(getTimeString(interval.startTime));
    expect(screen.getByLabelText('Sluttid')).toHaveValue(getTimeString(endTime));
    expect(screen.getByRole('checkbox', { name: 'Ej arbete' })).not.toBeChecked();
  });

  test('shows an empty, disabled end input for an interval without endTime', () => {
    setup({ interval: { ...interval, endTime: undefined } });

    expect(screen.getByLabelText('Sluttid')).toHaveValue('');
    expect(screen.getByLabelText('Sluttid')).toBeDisabled();
  });

  test('toggling notWork calls onUpdate with the updated interval', () => {
    const { onUpdate } = setup();

    fireEvent.click(screen.getByRole('checkbox', { name: 'Ej arbete' }));

    expect(onUpdate).toHaveBeenCalledWith({ ...interval, notWork: true });
  });

  test('editing the start time and blurring calls onUpdate with the new timestamp', () => {
    const { onUpdate } = setup();
    const input = screen.getByLabelText('Starttid');

    fireEvent.change(input, { target: { value: '08:15' } });
    fireEvent.blur(input);

    expect(onUpdate).toHaveBeenCalledTimes(1);
    expect(onUpdate.mock.calls[0]?.[0].startTime).toBe(new Date(2021, 3, 7, 8, 15).getTime());
  });

  test('shows the times of a new interval and drops an unsaved edit', () => {
    const onUpdate = vi.fn<(updated: EditableInterval) => void>();
    const { rerender } = render(<IntervalListItem interval={interval} onUpdate={onUpdate} />);
    fireEvent.change(screen.getByLabelText('Starttid'), { target: { value: '08:15' } });

    rerender(
      <IntervalListItem
        interval={{
          ...interval,
          startTime: new Date(2021, 3, 7, 10, 0).getTime(),
          endTime: undefined,
        }}
        onUpdate={onUpdate}
      />,
    );

    expect(screen.getByLabelText('Starttid')).toHaveValue(
      getTimeString(new Date(2021, 3, 7, 10, 0).getTime()),
    );
    expect(screen.getByLabelText('Sluttid')).toHaveValue('');
  });

  test('picking another day moves the start and keeps the time of day', () => {
    const { onUpdate } = setup();

    fireEvent.change(screen.getByLabelText('Startdatum'), { target: { value: '2022-01-31' } });

    expect(onUpdate.mock.calls[0]?.[0].startTime).toBe(new Date(2022, 0, 31, 9, 0).getTime());
  });

  test('an invalid time is not pushed', () => {
    const { onUpdate } = setup();
    const input = screen.getByLabelText('Starttid');
    const logSpy = vi.spyOn(console, 'log');

    fireEvent.change(input, { target: { value: '25:99' } });
    fireEvent.blur(input);

    expect(onUpdate).not.toHaveBeenCalled();
    expect(logSpy).not.toHaveBeenCalled();
    logSpy.mockRestore();
  });

  test('delete button calls onDelete with the id', () => {
    const { onDelete } = setup();

    fireEvent.click(screen.getByRole('button', { name: 'Ta bort intervallet' }));

    expect(onDelete).toHaveBeenCalledWith('i1');
  });

  test('no delete button without onDelete', () => {
    setup({ onDelete: undefined });

    expect(screen.queryByRole('button', { name: 'Ta bort intervallet' })).not.toBeInTheDocument();
  });
});
