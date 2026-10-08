import React from 'react';
import { Provider } from 'react-redux';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import Navbar from './navbar.jsx';
import { NotificationProvider } from '../../context/Notification.jsx';
import createStore from '../../redux/createStore';
import { initialized } from '../../redux/app';
import { userLoggedIn } from '../../redux/user';
import { intervalsFetched, requestIntervalUpdate } from '../../redux/intervals';

jest.mock('../../utils/firebaseApi', () => ({
  __esModule: true,
  default: { logout: jest.fn(), saveUserData: jest.fn(), updateUserPassword: jest.fn() },
}));

const setup = (...actions) => {
  const store = createStore();
  actions.forEach((action) => store.dispatch(action));
  render(
    <Provider store={store}>
      <NotificationProvider>
        <Navbar />
      </NotificationProvider>
    </Provider>
  );
  return store;
};

describe('Navbar', () => {
  test('shows the brand', () => {
    setup();
    expect(screen.getByText('TajmR')).toBeInTheDocument();
  });

  test('has no user menu when logged out', () => {
    setup(initialized());
    expect(screen.queryByTestId('user-menu-toggle')).not.toBeInTheDocument();
  });

  test('shows the user menu toggle when logged in', () => {
    setup(initialized(), userLoggedIn({ uid: 'u1', email: 'me@example.com' }));
    expect(screen.getByTestId('user-menu-toggle')).toBeInTheDocument();
    expect(screen.getByTestId('user-menu')).toBeInTheDocument();
  });

  test('toggling the user menu locks and restores body scrolling', () => {
    setup(initialized(), userLoggedIn({ uid: 'u1', email: 'me@example.com' }));

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
