import { StoreProvider } from '#/store/useStore.tsx';
import { render, screen, fireEvent } from '@testing-library/react';

import Navbar from './navbar.tsx';
import type { Action } from '#/store/types.ts';
import createStore from '#/store/createStore.ts';
import { initialized } from '#/store/app.ts';
import { userLoggedIn } from '#/store/user.ts';
import { intervalsFetched, requestIntervalUpdate } from '#/store/intervals.ts';

vi.mock(import('#/utils/firebaseApi.ts'));

const setup = (...actions: Action[]) => {
  const store = createStore();
  actions.forEach((action) => store.dispatch(action));
  render(
    <StoreProvider store={store}>
      <Navbar />
    </StoreProvider>,
  );
  return store;
};

describe('Navbar', () => {
  describe('version', () => {
    const env = { ...process.env };
    afterEach(() => {
      process.env = { ...env };
    });

    test('shows the release and the build time in the viewer timezone', () => {
      process.env.RELEASE = 'tajmr@2026.10.08';
      process.env.BUILD_TIME = '2026-10-08T13:29:00.000Z';
      const built = new Date(process.env.BUILD_TIME);
      const hhmm = `${String(built.getHours()).padStart(2, '0')}:${String(
        built.getMinutes(),
      ).padStart(2, '0')}`;

      setup();

      expect(
        screen.getByText(`tajmr@2026.10.08 - ${built.getDate()} okt. 2026 ${hhmm}`),
      ).toBeInTheDocument();
    });
  });

  test('shows the brand', () => {
    setup();
    expect(screen.getByText('TajmR')).toBeInTheDocument();
  });

  test('has no user menu when logged out', () => {
    setup(initialized());
    expect(screen.queryByTestId('user-menu-toggle')).not.toBeInTheDocument();
  });

  test('shows the user menu toggle when logged in', () => {
    setup(initialized(), userLoggedIn({ uid: 'u1', email: 'me@example.com', photoURL: null }));
    expect(screen.getByTestId('user-menu-toggle')).toBeInTheDocument();
    expect(screen.getByTestId('user-menu')).toBeInTheDocument();
  });

  test('toggling the user menu locks and restores body scrolling', () => {
    setup(initialized(), userLoggedIn({ uid: 'u1', email: 'me@example.com', photoURL: null }));

    fireEvent.click(screen.getByTestId('user-menu-toggle'));
    expect(document.body.style.overflow).toBe('hidden');

    fireEvent.click(screen.getByTestId('user-menu-toggle'));
    expect(document.body.style.overflow).toBe('');
  });

  test('shows a fetching indicator while intervals load', () => {
    setup(initialized());
    expect(screen.getByTestId('loading-intervals-container')).toBeInTheDocument();
  });

  test('shows a saving indicator while saving', () => {
    setup(initialized(), intervalsFetched({}), requestIntervalUpdate());
    expect(screen.getByTestId('saving-intervals-container')).toBeInTheDocument();
  });

  test('shows no indicator before the app is initialised', () => {
    setup();
    expect(screen.queryByTestId('loading-intervals-container')).not.toBeInTheDocument();
  });
});
