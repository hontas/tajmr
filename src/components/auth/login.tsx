import { useState, useTransition, type SyntheticEvent } from 'react';
import firebaseApi from '#/utils/firebaseApi.ts';
import Button from '#/components/button/button.tsx';

import styles from './login.module.css';

type Feedback = { kind: 'error' | 'notice'; text: string };

const readField = (form: HTMLFormElement | null, name: string) => {
  const value = form ? new FormData(form).get(name) : null;
  return typeof value === 'string' ? value : '';
};

const Login = () => {
  const [isLoggingIn, startLogin] = useTransition();
  const [isResetting, startReset] = useTransition();
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const showError = (error: unknown) =>
    setFeedback({ kind: 'error', text: error instanceof Error ? error.message : String(error) });

  const handleSubmit = (evt: SyntheticEvent<HTMLFormElement>) => {
    evt.preventDefault();
    const email = readField(evt.currentTarget, 'email');
    const password = readField(evt.currentTarget, 'password');
    setFeedback(null);
    startLogin(async () => {
      try {
        await firebaseApi.login(email, password);
      } catch (error) {
        showError(error);
      }
    });
  };

  const forgotPassword = (evt: SyntheticEvent<HTMLButtonElement>) => {
    const email = readField(evt.currentTarget.form, 'email');
    setFeedback(null);
    startReset(async () => {
      try {
        await firebaseApi.sendPasswordResetEmail(email);
        setFeedback({ kind: 'notice', text: 'Password reset email sent' });
      } catch (error) {
        showError(error);
      }
    });
  };

  return (
    <div className={styles.login}>
      <form className={styles.authForm} onSubmit={handleSubmit} data-testid="login-form">
        {feedback?.kind === 'error' && (
          <p className={styles.error}>
            <span aria-hidden="true">⚠</span>
            {feedback.text}
          </p>
        )}
        {feedback?.kind === 'notice' && <p>{feedback.text}</p>}
        <label aria-label="email">
          <input type="email" name="email" autoComplete="email" />
        </label>
        <label aria-label="password">
          <input type="password" name="password" autoComplete="current-password" />
        </label>
        <Button block type="submit" isLoading={isLoggingIn} theme="primary">
          Log in
        </Button>
        <Button block onClick={forgotPassword} isLoading={isResetting} theme="link">
          Forgot password
        </Button>
      </form>
    </div>
  );
};

export default Login;
