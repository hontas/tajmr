import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);

// provided by vite-plugin-pwa at build time, so it can't be resolved in tests
vi.mock('virtual:pwa-register', () => ({ registerSW: () => () => Promise.resolve() }));
