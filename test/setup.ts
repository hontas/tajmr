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

// jsdom paints [popover] as display:none and has no Popover API / :popover-open
const popoverStyle = document.createElement('style');
popoverStyle.textContent = '[popover][data-popover-open] { display: block !important; }';
document.head.append(popoverStyle);

const originalMatches = Element.prototype.matches;
Element.prototype.matches = function matches(this: Element, selectors: string) {
  if (selectors === ':popover-open') {
    return this.hasAttribute('data-popover-open');
  }
  return originalMatches.call(this, selectors);
} as typeof Element.prototype.matches;
HTMLElement.prototype.showPopover = function showPopover(this: HTMLElement) {
  this.setAttribute('data-popover-open', '');
};
HTMLElement.prototype.hidePopover = function hidePopover(this: HTMLElement) {
  this.removeAttribute('data-popover-open');
};
