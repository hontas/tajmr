import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

import Login from './login.jsx';
import firebaseApi from '../../utils/firebaseApi';

jest.mock('../../utils/firebaseApi', () => ({
  __esModule: true,
  default: {
    login: jest.fn(),
    sendPasswordResetEmail: jest.fn(),
  },
}));

const typeCredentials = (email, password) => {
  fireEvent.change(document.querySelector('input[type=email]'), { target: { value: email } });
  fireEvent.change(document.querySelector('input[type=password]'), { target: { value: password } });
};

describe('Login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    firebaseApi.login.mockResolvedValue({});
    firebaseApi.sendPasswordResetEmail.mockResolvedValue();
  });

  test('logs in with the entered credentials when clicking "Log in"', async () => {
    render(<Login />);
    typeCredentials('me@example.com', 'secret');

    fireEvent.click(screen.getByRole('button', { name: 'Log in' }));

    await waitFor(() => expect(firebaseApi.login).toHaveBeenCalledTimes(1));
    expect(firebaseApi.login).toHaveBeenCalledWith('me@example.com', 'secret');
  });

  test('logs in when the form is submitted', async () => {
    render(<Login />);
    typeCredentials('me@example.com', 'secret');

    fireEvent.submit(screen.getByTestId('login-form'));

    await waitFor(() => expect(firebaseApi.login).toHaveBeenCalledWith('me@example.com', 'secret'));
  });

  test('sends a password reset email to the entered address', async () => {
    render(<Login />);
    typeCredentials('me@example.com', '');

    fireEvent.click(screen.getByRole('button', { name: 'Forgot password' }));

    await waitFor(() =>
      expect(firebaseApi.sendPasswordResetEmail).toHaveBeenCalledWith('me@example.com')
    );
    expect(firebaseApi.login).not.toHaveBeenCalled();
  });

  // BUG: both resolve and reject handlers are `resetMessage`, so a failed login shows no
  // error to the user. Pinned so a fix is a conscious change.
  test('BUG: a failed login does not show an error message', async () => {
    firebaseApi.login.mockRejectedValue(new Error('wrong password'));
    render(<Login />);
    typeCredentials('me@example.com', 'bad');

    fireEvent.click(screen.getByRole('button', { name: 'Log in' }));

    await waitFor(() => expect(firebaseApi.login).toHaveBeenCalled());
    expect(screen.queryByText(/wrong password/)).not.toBeInTheDocument();
  });
});
