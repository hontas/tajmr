import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import Login from './login.jsx';
import firebaseApi from '#/utils/firebaseApi.js';

vi.mock('#/utils/firebaseApi.js', () => ({
  __esModule: true,
  default: {
    login: vi.fn(),
    sendPasswordResetEmail: vi.fn(),
  },
}));

const typeCredentials = (email, password) => {
  fireEvent.change(document.querySelector('input[type=email]'), { target: { value: email } });
  fireEvent.change(document.querySelector('input[type=password]'), { target: { value: password } });
};

describe('Login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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
      expect(firebaseApi.sendPasswordResetEmail).toHaveBeenCalledWith('me@example.com'),
    );
    expect(firebaseApi.login).not.toHaveBeenCalled();
  });

  test('shows the error message when login fails', async () => {
    firebaseApi.login.mockRejectedValue(new Error('The password is invalid'));
    render(<Login />);
    typeCredentials('me@example.com', 'bad');

    fireEvent.click(screen.getByRole('button', { name: 'Log in' }));

    expect(await screen.findByText(/The password is invalid/)).toBeInTheDocument();
  });

  test('clears a previous error when trying again', async () => {
    firebaseApi.login.mockRejectedValueOnce(new Error('The password is invalid'));
    render(<Login />);
    typeCredentials('me@example.com', 'bad');
    fireEvent.click(screen.getByRole('button', { name: 'Log in' }));
    await screen.findByText(/The password is invalid/);

    firebaseApi.login.mockReturnValue(new Promise(() => {}));
    fireEvent.click(screen.getByRole('button', { name: 'Log in' }));

    await waitFor(() =>
      expect(screen.queryByText(/The password is invalid/)).not.toBeInTheDocument(),
    );
  });

  test('shows a loading state while logging in', async () => {
    firebaseApi.login.mockReturnValue(new Promise(() => {}));
    render(<Login />);
    typeCredentials('me@example.com', 'secret');

    fireEvent.click(screen.getByRole('button', { name: 'Log in' }));

    await waitFor(() => expect(screen.getByRole('button', { name: 'Log in' })).toBeInTheDocument());
    expect(screen.getByRole('button', { name: 'Log in' }).children.length).toBeGreaterThan(0);
  });

  test('stops the loading state again after a failed login', async () => {
    firebaseApi.login.mockRejectedValue(new Error('nope'));
    render(<Login />);
    typeCredentials('me@example.com', 'bad');

    fireEvent.click(screen.getByRole('button', { name: 'Log in' }));

    await screen.findByText(/nope/);
    expect(screen.getByRole('button', { name: 'Log in' }).children).toHaveLength(0);
  });

  test('confirms when the password reset email was sent', async () => {
    render(<Login />);
    typeCredentials('me@example.com', '');

    fireEvent.click(screen.getByRole('button', { name: 'Forgot password' }));

    expect(await screen.findByText(/Password reset email sent/)).toBeInTheDocument();
  });

  test('shows the error message when the password reset fails', async () => {
    firebaseApi.sendPasswordResetEmail.mockRejectedValue(new Error('There is no user record'));
    render(<Login />);
    typeCredentials('nobody@example.com', '');

    fireEvent.click(screen.getByRole('button', { name: 'Forgot password' }));

    expect(await screen.findByText(/There is no user record/)).toBeInTheDocument();
  });
});
