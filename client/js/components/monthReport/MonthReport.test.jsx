import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import MonthReport from './MonthReport.jsx';

const hour = 60 * 60 * 1000;
const at = (month, day, h = 9) => new Date(2021, month, day, h).getTime();
const interval = (month, day, hours, extra = {}) => ({
  id: `${month}-${day}-${extra.note}`,
  startTime: at(month, day),
  endTime: at(month, day) + hours * hour,
  ...extra,
});

const intervals = [
  interval(3, 6, 2, { note: 'Alpha' }),
  interval(3, 7, 3, { note: 'alpha' }),
  interval(3, 8, 1.5, { note: 'Beta' }),
  interval(3, 9, 1, { note: 'Lunch', notWork: true }),
  interval(3, 12, 1),
  interval(4, 3, 4, { note: 'May work' }),
];

describe('MonthReport', () => {
  beforeEach(() => {
    jest.useFakeTimers('modern');
    jest.setSystemTime(new Date(2021, 3, 15, 12));
  });

  afterEach(() => jest.useRealTimers());

  const renderReport = () => render(<MonthReport intervals={intervals} />);
  const row = (title) => screen.getByText(title, { selector: 'p' }).closest('li');

  test('shows the current month and year', () => {
    renderReport();
    expect(screen.getByText(/april 2021/)).toBeInTheDocument();
  });

  test('groups the month intervals by lower-cased note, with "-" for no note', () => {
    renderReport();

    expect(row('alpha')).toHaveTextContent('5.0h');
    expect(row('beta')).toHaveTextContent('1.5h');
    expect(row('-')).toHaveTextContent('1.0h');
    expect(row('notwork:lunch')).toHaveTextContent('1.0h');
    expect(screen.queryByText('may work')).not.toBeInTheDocument();
  });

  test('total includes every visible category', () => {
    renderReport();
    expect(row('TOTAL:')).toHaveTextContent('8.5h');
  });

  test('toggling a category filter removes it from the list and total', () => {
    renderReport();
    const filters = screen.getAllByRole('button', { name: 'notwork:lunch' });

    fireEvent.click(filters[0]);

    expect(screen.queryByText('notwork:lunch', { selector: 'p' })).not.toBeInTheDocument();
    expect(row('TOTAL:')).toHaveTextContent('7.5h');

    fireEvent.click(screen.getByRole('button', { name: 'notwork:lunch' }));
    expect(row('TOTAL:')).toHaveTextContent('8.5h');
  });

  test('navigates to next and previous month', () => {
    renderReport();

    fireEvent.click(screen.getByRole('button', { name: '▶︎' }));
    expect(screen.getByText(/maj 2021/)).toBeInTheDocument();
    expect(row('may work')).toHaveTextContent('4.0h');

    fireEvent.click(screen.getByRole('button', { name: '◀︎' }));
    fireEvent.click(screen.getByRole('button', { name: '◀︎' }));
    expect(screen.getByText(/mars 2021/)).toBeInTheDocument();
    expect(row('TOTAL:')).toHaveTextContent('0.0h');
  });
});
