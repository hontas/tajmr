import { act, render, screen, fireEvent, waitFor } from '@testing-library/react';

import type { UserCredential } from 'firebase/auth';

import Login from './login.tsx';
import firebaseApi from '#/utils/firebaseApi.ts';

vi.mock(import('#/utils/firebaseApi.ts'));

const getInput = (type: string) => {
  const input = document.querySelector(`input[type=${type}]`);
  if (!input) throw new Error(`no ${type} input`);
  return input;
};

const typeCredentials = (email: string, password: string) => {
  fireEvent.change(getInput('email'), { target: { value: email } });
  fireEvent.change(getInput('password'), { target: { value: password } });
};

describe('Login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(firebaseApi.login).mockResolvedValue({} as UserCredential);
    vi.mocked(firebaseApi.sendPasswordResetEmail).mockResolvedValue();
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
    vi.mocked(firebaseApi.login).mockRejectedValue(new Error('The password is invalid'));
    render(<Login />);
    typeCredentials('me@example.com', 'bad');

    fireEvent.click(screen.getByRole('button', { name: 'Log in' }));

    expect(await screen.findByText(/The password is invalid/)).toBeInTheDocument();
  });

  test('clears a previous error when trying again', async () => {
    vi.mocked(firebaseApi.login).mockRejectedValueOnce(new Error('The password is invalid'));
    render(<Login />);
    typeCredentials('me@example.com', 'bad');
    fireEvent.click(screen.getByRole('button', { name: 'Log in' }));
    await screen.findByText(/The password is invalid/);

    const login = Promise.withResolvers<UserCredential>();
    vi.mocked(firebaseApi.login).mockReturnValue(login.promise);
    fireEvent.click(screen.getByRole('button', { name: 'Log in' }));

    await waitFor(() =>
      expect(screen.queryByText(/The password is invalid/)).not.toBeInTheDocument(),
    );
    await act(async () => login.resolve({} as UserCredential));
  });

  test('shows a loading state while logging in', async () => {
    const login = Promise.withResolvers<UserCredential>();
    vi.mocked(firebaseApi.login).mockReturnValue(login.promise);
    render(<Login />);
    typeCredentials('me@example.com', 'secret');

    fireEvent.click(screen.getByRole('button', { name: 'Log in' }));

    await waitFor(() => expect(screen.getByRole('button', { name: 'Log in' })).toBeInTheDocument());
    expect(screen.getByRole('button', { name: 'Log in' }).children.length).toBeGreaterThan(0);
    await act(async () => login.resolve({} as UserCredential));
  });

  test('stops the loading state again after a failed login', async () => {
    vi.mocked(firebaseApi.login).mockRejectedValue(new Error('nope'));
    render(<Login />);
    typeCredentials('me@example.com', 'bad');

    fireEvent.click(screen.getByRole('button', { name: 'Log in' }));

    await screen.findByText(/nope/);
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Log in' }).children).toHaveLength(0),
    );
  });

  test('confirms when the password reset email was sent', async () => {
    render(<Login />);
    typeCredentials('me@example.com', '');

    fireEvent.click(screen.getByRole('button', { name: 'Forgot password' }));

    expect(await screen.findByText(/Password reset email sent/)).toBeInTheDocument();
  });

  test('shows the error message when the password reset fails', async () => {
    vi.mocked(firebaseApi.sendPasswordResetEmail).mockRejectedValue(
      new Error('There is no user record'),
    );
    render(<Login />);
    typeCredentials('nobody@example.com', '');

    fireEvent.click(screen.getByRole('button', { name: 'Forgot password' }));

    expect(await screen.findByText(/There is no user record/)).toBeInTheDocument();
  });
});
