import { useRef, useState, type SyntheticEvent } from 'react';
import firebaseApi from '#/utils/firebaseApi.ts';
import Button from '#/components/button/button.tsx';

import styles from './login.module.css';

const Login = () => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [message, setMessage] = useState('');
  const [notice, setNotice] = useState('');
  const emailInput = useRef<HTMLInputElement>(null);
  const passwordInput = useRef<HTMLInputElement>(null);

  const resetMessages = () => {
    setMessage('');
    setNotice('');
  };

  const handleSubmit = (evt: SyntheticEvent) => {
    evt.preventDefault();
    resetMessages();
    setIsLoggingIn(true);
    // on success this component is replaced, so only failure resets the state
    firebaseApi
      .login(emailInput.current?.value ?? '', passwordInput.current?.value ?? '')
      .catch((error: Error) => {
        setMessage(error.message);
        setIsLoggingIn(false);
      });
  };

  const forgotPassword = (evt: SyntheticEvent) => {
    evt.preventDefault();
    resetMessages();
    setIsResetting(true);
    firebaseApi
      .sendPasswordResetEmail(emailInput.current?.value ?? '')
      .then(() => setNotice('Password reset email sent'))
      .catch((error: Error) => setMessage(error.message))
      .finally(() => setIsResetting(false));
  };

  return (
    <div className={styles.login}>
      <form className={styles.authForm} onSubmit={handleSubmit} data-testid="login-form">
        {message && (
          <p className={styles.error}>
            <span aria-hidden="true">⚠</span>
            {message}
          </p>
        )}
        {notice && <p>{notice}</p>}
        <label aria-label="email">
          <input type="email" autoComplete="email" ref={emailInput} />
        </label>
        <label aria-label="password">
          <input type="password" autoComplete="current-password" ref={passwordInput} />
        </label>
        <Button block type="submit" onClick={handleSubmit} isLoading={isLoggingIn} theme="primary">
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
