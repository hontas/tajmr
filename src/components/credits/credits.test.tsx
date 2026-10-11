import { render, screen } from '@testing-library/react';

import Credits from './credits.tsx';

describe('Credits', () => {
  test('credits the author and links to the code', () => {
    render(<Credits />);

    expect(screen.getByRole('link', { name: 'hontas' })).toHaveAttribute(
      'href',
      'https://github.com/hontas',
    );
    expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute(
      'href',
      'https://github.com/hontas/tajmr.git',
    );
  });
});
