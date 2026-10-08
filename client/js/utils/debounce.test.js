import debounce from './debounce';

describe('debounce', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  test('calls fn once after the timeout with the last arguments', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);

    debounced('a');
    debounced('b');
    debounced('c');
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('c');
  });

  test('uses 400ms as default timeout', () => {
    const fn = vi.fn();
    debounce(fn)();

    vi.advanceTimersByTime(399);
    expect(fn).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
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
      thisArg,
    )();

    vi.advanceTimersByTime(10);
    expect(seen).toBe(thisArg);
  });
});
