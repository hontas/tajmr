import React from 'react';
import { StoreProvider } from '#/store/useStore.tsx';
import { render, screen } from '@testing-library/react';

import Application from './application.tsx';
import type { Action } from '#/store/types.ts';
import createStore from '#/store/createStore.ts';
import { initialized } from '#/store/app.ts';
import { userLoggedIn } from '#/store/user.ts';
import { intervalsFetched } from '#/store/intervals.ts';

vi.mock('#/utils/firebaseApi.ts', () => ({
  __esModule: true,
  default: {
    login: vi.fn<() => void>(),
    logout: vi.fn<() => void>(),
    sendPasswordResetEmail: vi.fn<() => void>(),
    saveUserData: vi.fn<() => void>(),
    updateUserPassword: vi.fn<() => void>(),
    fetchIntervalsInWeek: vi.fn<() => Promise<object>>(() => Promise.resolve({})),
  },
}));

const setup = (...actions: Action[]) => {
  const store = createStore();
  actions.forEach((action) => store.dispatch(action));
  render(
    <StoreProvider store={store}>
      <Application />
    </StoreProvider>,
  );
  return store;
};

describe('Application', () => {
  beforeAll(() =>
    Promise.all([
      import('#/components/navbar/navbar.tsx'),
      import('#/components/footer/footer.tsx'),
      import('#/components/containers/currentIntervals.tsx'),
      import('#/components/containers/previousIntervals.tsx'),
      import('#/components/auth/login.tsx'),
    ]),
  );

  test('shows the loader until the app is initialised', () => {
    setup();
    expect(screen.getByTestId('app-init')).toBeInTheDocument();
    expect(screen.queryByTestId('login-form')).not.toBeInTheDocument();
  });

  test('shows the login form for a logged-out user', async () => {
    setup(initialized());

    expect(await screen.findByTestId('login-form')).toBeInTheDocument();
    expect(await screen.findByText('TajmR')).toBeInTheDocument();
  });

  test('shows the work button for a logged-in user', async () => {
    setup(
      initialized(),
      userLoggedIn({ uid: 'u1', email: 'me@example.com', photoURL: null }),
      intervalsFetched({}),
    );

    expect(await screen.findByTestId('user-menu-toggle')).toBeInTheDocument();
    expect(screen.queryByTestId('login-form')).not.toBeInTheDocument();
  });
});
