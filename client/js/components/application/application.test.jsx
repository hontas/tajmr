import React from 'react';
import { Provider } from 'react-redux';
import { render, screen } from '@testing-library/react';

import Application from './application.jsx';
import createStore from '../../redux/createStore';
import { initialized } from '../../redux/app';
import { userLoggedIn } from '../../redux/user';
import { intervalsFetched } from '../../redux/intervals';

vi.mock('../../utils/firebaseApi', () => ({
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
    <Provider store={store}>
      <Application />
    </Provider>,
  );
  return store;
};

describe('Application', () => {
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

    expect(
      await screen.findByTestId('user-menu-toggle', {}, { timeout: 8000 }),
    ).toBeInTheDocument();
    expect(screen.queryByTestId('login-form')).not.toBeInTheDocument();
  });
});
