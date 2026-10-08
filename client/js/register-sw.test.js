import { registerSW } from 'virtual:pwa-register';

import registerServiceWorker from './register-sw';

jest.mock('virtual:pwa-register', () => ({ registerSW: jest.fn() }), { virtual: true });

describe('registerServiceWorker', () => {
  test('does not register outside production builds', async () => {
    const update = registerServiceWorker({ onNeedRefresh: jest.fn() });

    expect(registerSW).not.toHaveBeenCalled();
    await expect(update(true)).resolves.toBeUndefined();
  });
});
