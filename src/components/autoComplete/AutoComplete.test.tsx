import { type ComponentProps } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import AutoComplete from './AutoComplete.tsx';

const notes = ['Kodar', 'Kafferast', 'Möten'];

const setup = (props: Partial<ComponentProps<typeof AutoComplete>> = {}) => {
  const onChange = vi.fn<(value: string) => void>();
  render(<AutoComplete data-testid="note" onChange={onChange} notes={notes} {...props} />);
  return { onChange, input: screen.getByTestId('note') };
};

const typeIn = (input: HTMLElement, value: string) => {
  input.focus();
  fireEvent.change(input, { target: { value } });
};

const leaveField = (input: HTMLElement) => {
  fireEvent.focusOut(input, { relatedTarget: document.body });
};

describe('AutoComplete', () => {
  test('starts with the given value', () => {
    const { input } = setup({ value: 'planering' });
    expect(input).toHaveValue('planering');
  });

  test('follows a new value from outside', () => {
    const { rerender } = render(
      <AutoComplete data-testid="note" onChange={vi.fn<() => void>()} value="a" />,
    );
    rerender(<AutoComplete data-testid="note" onChange={vi.fn<() => void>()} value="b" />);

    expect(screen.getByTestId('note')).toHaveValue('b');
  });

  test('does not overwrite what is being typed when a new value arrives', () => {
    const { rerender } = render(
      <AutoComplete data-testid="note" onChange={vi.fn<() => void>()} value="a" />,
    );
    const input = screen.getByTestId('note');
    input.focus();
    fireEvent.change(input, { target: { value: 'abc' } });
    rerender(<AutoComplete data-testid="note" onChange={vi.fn<() => void>()} value="b" />);

    expect(input).toHaveValue('abc');
  });

  test('suggests the notes that start with what is typed', () => {
    const { input } = setup();
    typeIn(input, 'k');

    expect(screen.getAllByRole('button').map((button) => button.textContent)).toEqual([
      'Kodar',
      'Kafferast',
    ]);
  });

  test('suggests nothing for an empty query', () => {
    const { input } = setup();
    typeIn(input, 'k');
    fireEvent.change(input, { target: { value: '' } });

    expect(screen.queryAllByRole('button')).toHaveLength(0);
  });

  test('picking a suggestion reports it and closes the list', () => {
    const { input, onChange } = setup();
    typeIn(input, 'ka');
    fireEvent.click(screen.getByRole('button', { name: 'Kafferast' }));

    expect(onChange).toHaveBeenCalledWith('Kafferast');
    expect(input).toHaveValue('Kafferast');
    expect(screen.queryAllByRole('button')).toHaveLength(0);
  });

  test('Escape closes the list but click shows it again', () => {
    const { input } = setup();
    typeIn(input, 'k');
    fireEvent.keyDown(input, { key: 'Escape' });

    expect(screen.queryAllByRole('button')).toHaveLength(0);

    fireEvent.click(input);
    expect(screen.getAllByRole('button')).toHaveLength(2);
  });

  test('ArrowDown moves focus through the suggestions and ArrowUp back', () => {
    const { input } = setup();
    typeIn(input, 'k');
    const [first, second] = screen.getAllByRole('button');

    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(first).toHaveFocus();
    fireEvent.keyDown(first, { key: 'ArrowDown' });
    expect(second).toHaveFocus();
    fireEvent.keyDown(second, { key: 'ArrowUp' });
    expect(first).toHaveFocus();
  });

  test('ArrowDown reopens the list after Escape', () => {
    const { input } = setup();
    typeIn(input, 'k');
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(screen.queryAllByRole('button')).toHaveLength(0);

    fireEvent.keyDown(input, { key: 'ArrowDown' });
    const [first] = screen.getAllByRole('button');
    expect(first).toHaveFocus();
  });

  test('clicking a suggestion picks it', () => {
    const { input, onChange } = setup();
    typeIn(input, 'm');
    fireEvent.click(screen.getByRole('button', { name: 'Möten' }));

    expect(onChange).toHaveBeenCalledWith('Möten');
  });

  test('leaving the field with a new text reports it in lower case', () => {
    const { input, onChange } = setup({ value: 'kodar' });
    typeIn(input, 'Nytt');
    leaveField(input);

    expect(onChange).toHaveBeenCalledWith('nytt');
  });

  test('leaving the field unchanged reports nothing', () => {
    const { input, onChange } = setup({ value: 'kodar' });
    input.focus();
    leaveField(input);

    expect(onChange).not.toHaveBeenCalled();
  });
});
