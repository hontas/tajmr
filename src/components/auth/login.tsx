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
        setFeedback({ kind: 'notice', text: 'Återställningsmejl skickat' });
      } catch (error) {
        showError(error);
      }
    });
  };

  return (
    <div className={styles.login}>
      <form className={styles.authForm} onSubmit={handleSubmit} data-testid="login-form">
        <h2 className={styles.title}>Logga in</h2>
        {feedback?.kind === 'error' && (
          <p className={styles.error}>
            <span aria-hidden="true">⚠</span>
            {feedback.text}
          </p>
        )}
        {feedback?.kind === 'notice' && <p>{feedback.text}</p>}
        <label className={styles.field}>
          E-post
          <input
            className={styles.input}
            type="email"
            name="email"
            autoComplete="email"
            inputMode="email"
            autoCapitalize="none"
          />
        </label>
        <label className={styles.field}>
          Lösenord
          <input
            className={styles.input}
            type="password"
            name="password"
            autoComplete="current-password"
          />
        </label>
        <Button
          block
          className={styles.submit}
          type="submit"
          isLoading={isLoggingIn}
          theme="primary"
        >
          Logga in
        </Button>
        <Button
          block
          className={styles.forgot}
          onClick={forgotPassword}
          isLoading={isResetting}
          theme="link"
        >
          Glömt lösenordet?
        </Button>
      </form>
    </div>
  );
};

export default Login;
