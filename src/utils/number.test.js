import { maxOneDecimal } from './number';

describe('maxOneDecimal', () => {
  test('rounds to one decimal', () => {
    expect(maxOneDecimal(1.26)).toBe(1.3);
    expect(maxOneDecimal(1.24)).toBe(1.2);
  });

  test('keeps whole numbers and zero', () => {
    expect(maxOneDecimal(3)).toBe(3);
    expect(maxOneDecimal(0)).toBe(0);
  });

  test('handles negative values', () => {
    expect(maxOneDecimal(-1.26)).toBe(-1.3);
  });
});
