import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import DatePicker from './DatePicker.tsx';

const setup = (props: Partial<React.ComponentProps<typeof DatePicker>> = {}) => {
  const onChange = vi.fn<(date: Date) => void>();
  render(<DatePicker buttonTitle="Start date" date={null} onChange={onChange} {...props} />);
  return { onChange, input: screen.getByLabelText<HTMLInputElement>('Start date') };
};

describe('DatePicker', () => {
  test('shows the local date of the timestamp', () => {
    const { input } = setup({ date: new Date(2026, 9, 7, 23, 30).getTime() });
    expect(input).toHaveValue('2026-10-07');
  });

  test('is disabled without a date', () => {
    const { input } = setup();
    expect(input).toBeDisabled();
    expect(input).toHaveValue('');
  });

  test('reports the picked day as a local date', () => {
    const { input, onChange } = setup({ date: new Date(2026, 9, 7).getTime() });
    fireEvent.change(input, { target: { value: '2027-01-31' } });
    expect(onChange).toHaveBeenCalledWith(new Date(2027, 0, 31));
  });

  test('ignores a cleared input', () => {
    const { input, onChange } = setup({ date: new Date(2026, 9, 7).getTime() });
    fireEvent.change(input, { target: { value: '' } });
    expect(onChange).not.toHaveBeenCalled();
  });

  test('opens the native picker on click', () => {
    const { input } = setup({ date: new Date(2026, 9, 7).getTime() });
    input.showPicker = vi.fn<() => void>();
    fireEvent.click(input);
    expect(input.showPicker).toHaveBeenCalled();
  });
});
