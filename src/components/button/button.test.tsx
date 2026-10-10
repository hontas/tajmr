import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import Button from './button.tsx';

describe('Button', () => {
  test('renders text and children and calls onClick', () => {
    const onClick = vi.fn<() => void>();
    render(
      <Button text="Save" onClick={onClick}>
        <span>icon</span>
      </Button>,
    );

    const button = screen.getByRole('button', { name: /Save/ });
    expect(screen.getByText('icon')).toBeInTheDocument();
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test('defaults to type="button" and supports type="submit"', () => {
    const { rerender } = render(<Button text="a" onClick={() => {}} />);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');

    rerender(<Button text="a" type="submit" onClick={() => {}} />);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });

  test('does not call onClick when disabled', () => {
    const onClick = vi.fn<() => void>();
    render(<Button text="a" disabled onClick={onClick} />);

    fireEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  test('passes through extra props such as data-testid', () => {
    render(<Button text="a" data-testid="my-btn" onClick={() => {}} />);
    expect(screen.getByTestId('my-btn')).toBeInTheDocument();
  });
});
