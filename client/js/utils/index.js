export const debounce = (fn, timeout = 400, thisArg) => {
  let timeoutId;
  return (...args) => {
    const context = thisArg || this;
    if (timeoutId) {
      timeoutId = clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      fn.apply(context, args);
    }, timeout);
  };
};
