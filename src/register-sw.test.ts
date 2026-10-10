import { registerSW } from 'virtual:pwa-register';

import registerServiceWorker from './register-sw.ts';

vi.mock('virtual:pwa-register', () => ({ registerSW: vi.fn<() => void>() }));

describe('registerServiceWorker', () => {
  test('does not register outside production builds', async () => {
    const update = registerServiceWorker({ onNeedRefresh: vi.fn<() => void>() });

    expect(registerSW).not.toHaveBeenCalled();
    await expect(update()).resolves.toBeUndefined();
  });
});
