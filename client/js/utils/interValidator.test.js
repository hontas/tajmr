import { validateInterval, validateNewInterval } from './interValidator';

describe('interValidator', () => {
  let logSpy;

  beforeEach(() => {
    logSpy = jest.spyOn(console, 'log');
  });

  afterEach(() => {
    // interval contents must never end up in the console
    expect(logSpy).not.toHaveBeenCalled();
    logSpy.mockRestore();
  });

  describe('validateNewInterval', () => {
    test('returns undefined for a valid interval', () => {
      expect(validateNewInterval({ startTime: 1000 })).toBeUndefined();
      expect(
        validateNewInterval({ startTime: 1000, endTime: 2000, note: 'x', notWork: true })
      ).toBeUndefined();
    });

    test('requires startTime', () => {
      expect(validateNewInterval({ note: 'x' })).toBe('Missing required properties "startTime"');
    });

    test('rejects non-object data', () => {
      expect(validateNewInterval('nope')).toBe('Data must be of type object');
    });

    test('rejects wrongly typed truthy properties', () => {
      expect(validateNewInterval({ startTime: '1000' })).toMatch(/"startTime" should be "number"/);
    });

    test('rejects extraneous keys', () => {
      expect(validateNewInterval({ startTime: 1000, foo: 1 })).toBe(
        'Not supported extraneous keys [foo]'
      );
    });
  });

  describe('validateInterval', () => {
    const valid = { createdAt: 1, startTime: 2, user: 'u1' };

    test('returns undefined for a valid interval', () => {
      expect(validateInterval(valid)).toBeUndefined();
      expect(validateInterval({ ...valid, id: 'abc', updatedAt: 3, endTime: 4 })).toBeUndefined();
    });

    test('requires createdAt, startTime and user', () => {
      expect(validateInterval({})).toBe(
        'Missing required properties "createdAt, startTime, user"'
      );
    });

    test('rejects extraneous keys', () => {
      expect(validateInterval({ ...valid, extra: true })).toBe(
        'Not supported extraneous keys [extra]'
      );
    });
  });

  // BUG (see issue #11): falsy values are never type-checked, and the message prints the
  // value where it should print the type. These tests pin the current behaviour.
  describe('known bugs', () => {
    test('BUG: falsy values of the wrong type pass validation', () => {
      expect(validateNewInterval({ startTime: 1000, note: 0 })).toBeUndefined();
      expect(validateNewInterval({ startTime: 1000, endTime: '' })).toBeUndefined();
    });

    test('BUG: type error message prints the value instead of the type', () => {
      expect(validateNewInterval({ startTime: '1000' })).toBe(
        '"startTime" should be "number" but is 1000'
      );
    });
  });
});
