import { registerSW } from 'virtual:pwa-register';

import registerServiceWorker from './register-sw';

vi.mock('virtual:pwa-register', () => ({ registerSW: vi.fn() }), { virtual: true });

describe('registerServiceWorker', () => {
  test('does not register outside production builds', async () => {
    const update = registerServiceWorker({ onNeedRefresh: vi.fn() });

    expect(registerSW).not.toHaveBeenCalled();
    await expect(update(true)).resolves.toBeUndefined();
  });
});
