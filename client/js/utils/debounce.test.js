import debounce from './debounce';

describe('debounce', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  test('calls fn once after the timeout with the last arguments', () => {
    const fn = jest.fn();
    const debounced = debounce(fn, 100);

    debounced('a');
    debounced('b');
    debounced('c');
    expect(fn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('c');
  });

  test('uses 400ms as default timeout', () => {
    const fn = jest.fn();
    debounce(fn)();

    jest.advanceTimersByTime(399);
    expect(fn).not.toHaveBeenCalled();
    jest.advanceTimersByTime(1);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  test('binds fn to thisArg when given', () => {
    const thisArg = { name: 'ctx' };
    let seen;
    debounce(
      function fn() {
        seen = this;
      },
      10,
      thisArg
    )();

    jest.advanceTimersByTime(10);
    expect(seen).toBe(thisArg);
  });
});
