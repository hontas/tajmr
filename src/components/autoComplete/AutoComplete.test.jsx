import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';

import AutoComplete from './AutoComplete.jsx';

const notes = ['Kodar', 'Kafferast', 'Möten'];

const setup = (props = {}) => {
  const onChange = vi.fn();
  render(<AutoComplete dataTestId="note" onChange={onChange} notes={notes} {...props} />);
  return { onChange, input: screen.getByTestId('note') };
};

describe('AutoComplete', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('starts with the given value', () => {
    const { input } = setup({ value: 'planering' });
    expect(input).toHaveValue('planering');
  });

  test('follows a new value from outside', () => {
    const { rerender } = render(<AutoComplete dataTestId="note" onChange={vi.fn()} value="a" />);
    rerender(<AutoComplete dataTestId="note" onChange={vi.fn()} value="b" />);

    expect(screen.getByTestId('note')).toHaveValue('b');
  });

  test('does not overwrite what is being typed when a new value arrives', () => {
    const { rerender } = render(<AutoComplete dataTestId="note" onChange={vi.fn()} value="a" />);
    const input = screen.getByTestId('note');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'abc' } });
    rerender(<AutoComplete dataTestId="note" onChange={vi.fn()} value="b" />);

    expect(input).toHaveValue('abc');
  });

  test('suggests the notes that start with what is typed', () => {
    const { input } = setup();
    fireEvent.change(input, { target: { value: 'k' } });

    expect(screen.getAllByRole('button').map((button) => button.textContent)).toEqual([
      'Kodar',
      'Kafferast',
    ]);
  });

  test('suggests nothing for an empty query', () => {
    const { input } = setup();
    fireEvent.change(input, { target: { value: 'k' } });
    fireEvent.change(input, { target: { value: '' } });

    expect(screen.queryAllByRole('button')).toHaveLength(0);
  });

  test('picking a suggestion reports it and closes the list', () => {
    const { input, onChange } = setup();
    fireEvent.change(input, { target: { value: 'ka' } });
    fireEvent.click(screen.getByRole('button', { name: 'Kafferast' }));

    expect(onChange).toHaveBeenCalledWith({ target: { value: 'Kafferast' } });
    expect(input).toHaveValue('Kafferast');
    expect(screen.queryAllByRole('button')).toHaveLength(0);
  });

  test('Escape closes the list', () => {
    const { input } = setup();
    fireEvent.change(input, { target: { value: 'k' } });
    fireEvent.keyDown(input, { key: 'Escape' });

    expect(screen.queryAllByRole('button')).toHaveLength(0);
  });

  test('ArrowDown moves focus through the suggestions and ArrowUp back', () => {
    const { input } = setup();
    fireEvent.change(input, { target: { value: 'k' } });
    const [first, second] = screen.getAllByRole('button');

    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(first).toHaveFocus();
    fireEvent.keyDown(first, { key: 'ArrowDown' });
    expect(second).toHaveFocus();
    fireEvent.keyDown(second, { key: 'ArrowUp' });
    expect(first).toHaveFocus();
  });

  test('Enter on a suggestion picks it', () => {
    const { input, onChange } = setup();
    fireEvent.change(input, { target: { value: 'm' } });
    fireEvent.keyDown(screen.getByRole('button', { name: 'Möten' }), { key: 'Enter' });

    expect(onChange).toHaveBeenCalledWith({ target: { value: 'Möten' } });
  });

  test('leaving the field with a new text reports it in lower case', () => {
    const { input, onChange } = setup({ value: 'kodar' });
    fireEvent.change(input, { target: { value: 'Nytt' } });
    fireEvent.blur(input);
    act(() => {
      vi.advanceTimersByTime(5);
    });

    expect(onChange).toHaveBeenCalledWith({ target: { value: 'nytt' } });
  });

  test('leaving the field unchanged reports nothing', () => {
    const { input, onChange } = setup({ value: 'kodar' });
    fireEvent.blur(input);
    act(() => {
      vi.advanceTimersByTime(5);
    });

    expect(onChange).not.toHaveBeenCalled();
  });
});
