import { registerSW } from 'virtual:pwa-register';

import registerServiceWorker from './register-sw.ts';

type UpdateServiceWorker = (reloadPage?: boolean) => Promise<void>;

vi.mock('virtual:pwa-register', () => ({
  registerSW: vi.fn<() => UpdateServiceWorker>(),
}));

describe('registerServiceWorker', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  test('does not register outside production builds', async () => {
    const update = registerServiceWorker({ onNeedRefresh: vi.fn<() => void>() });

    expect(registerSW).not.toHaveBeenCalled();
    await expect(update()).resolves.toBeUndefined();
  });

  test('registers in production builds and reloads once the new worker takes control', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    const addEventListener =
      vi.fn<(type: string, listener: () => void, options?: unknown) => void>();
    vi.stubGlobal('navigator', { serviceWorker: { addEventListener } });
    const updateServiceWorker = vi.fn<UpdateServiceWorker>().mockResolvedValue();
    vi.mocked(registerSW).mockReturnValue(updateServiceWorker);

    const update = registerServiceWorker({ onNeedRefresh: vi.fn<() => void>() });

    expect(registerSW).toHaveBeenCalledTimes(1);
    await update();

    expect(updateServiceWorker).toHaveBeenCalledWith(true);
    expect(addEventListener).toHaveBeenCalledWith('controllerchange', expect.any(Function), {
      once: true,
    });
  });
});
