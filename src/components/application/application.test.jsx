import React from 'react';
import { StoreProvider } from '#/store/useStore.jsx';
import { render, screen } from '@testing-library/react';

import Application from './application.jsx';
import createStore from '#/store/createStore.js';
import { initialized } from '#/store/app.js';
import { userLoggedIn } from '#/store/user.js';
import { intervalsFetched } from '#/store/intervals.js';

vi.mock('#/utils/firebaseApi.js', () => ({
  __esModule: true,
  default: {
    login: vi.fn(),
    logout: vi.fn(),
    sendPasswordResetEmail: vi.fn(),
    saveUserData: vi.fn(),
    updateUserPassword: vi.fn(),
    fetchIntervalsInWeek: vi.fn(() => Promise.resolve({})),
  },
}));

const setup = (...actions) => {
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
      import('#/components/navbar/navbar.jsx'),
      import('#/components/footer/footer.jsx'),
      import('#/components/containers/currentIntervals.jsx'),
      import('#/components/containers/previousIntervals.jsx'),
      import('#/components/auth/login.jsx'),
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
      userLoggedIn({ uid: 'u1', email: 'me@example.com' }),
      intervalsFetched({}),
    );

    expect(await screen.findByTestId('user-menu-toggle')).toBeInTheDocument();
    expect(screen.queryByTestId('login-form')).not.toBeInTheDocument();
  });
});
