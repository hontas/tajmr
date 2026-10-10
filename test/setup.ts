import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);

// provided by vite-plugin-pwa at build time, so it can't be resolved in tests
vi.mock('virtual:pwa-register', () => ({ registerSW: () => () => Promise.resolve() }));

// jsdom has no <dialog> behaviour
HTMLDialogElement.prototype.showModal = function showModal(this: HTMLDialogElement) {
  this.setAttribute('open', '');
};
HTMLDialogElement.prototype.close = function close(this: HTMLDialogElement) {
  this.removeAttribute('open');
  this.dispatchEvent(new Event('close'));
};
