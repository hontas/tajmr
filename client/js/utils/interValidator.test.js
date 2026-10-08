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
    const valid = { createdAt: 1, startTime: 2 };

    test('returns undefined for a valid interval', () => {
      expect(validateInterval(valid)).toBeUndefined();
      expect(validateInterval({ ...valid, id: 'abc', updatedAt: 3, endTime: 4 })).toBeUndefined();
    });

    test('requires createdAt and startTime', () => {
      expect(validateInterval({})).toBe('Missing required properties "createdAt, startTime"');
    });

    test('does not accept the old user field (intervals live under the user now)', () => {
      expect(validateInterval({ ...valid, user: 'u1' })).toBe(
        'Not supported extraneous keys [user]'
      );
    });

    test('rejects extraneous keys', () => {
      expect(validateInterval({ ...valid, extra: true })).toBe(
        'Not supported extraneous keys [extra]'
      );
    });
  });

  describe('type checks', () => {
    test('falsy values of the wrong type are rejected', () => {
      expect(validateNewInterval({ startTime: 1000, note: 0 })).toMatch(
        /"note" should be "string"/
      );
      expect(validateNewInterval({ startTime: 1000, endTime: '' })).toMatch(
        /"endTime" should be "number"/
      );
      expect(validateNewInterval({ startTime: 1000, notWork: 0 })).toMatch(
        /"notWork" should be "boolean"/
      );
    });

    test('falsy values of the right type are accepted', () => {
      expect(validateNewInterval({ startTime: 1000, note: '', notWork: false })).toBeUndefined();
    });

    test('the message names the expected and actual type, never the value', () => {
      expect(validateNewInterval({ startTime: '1000' })).toBe(
        '"startTime" should be "number" but is string'
      );
    });

    test('all type errors are reported', () => {
      expect(validateNewInterval({ startTime: '1', note: 5 })).toBe(
        '"startTime" should be "number" but is string\n"note" should be "string" but is number'
      );
    });
  });
});
