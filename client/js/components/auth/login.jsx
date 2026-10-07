import React, { useState, useRef } from 'react';
import firebaseApi from '../../utils/firebaseApi';
import Button from '../button/button.jsx';

import styles from './login.module.css';

const Login = () => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [message, setMessage] = useState('');
  const [notice, setNotice] = useState('');
  const emailInput = useRef(null);
  const passwordInput = useRef(null);

  const resetMessages = () => {
    setMessage('');
    setNotice('');
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    resetMessages();
    setIsLoggingIn(true);
    // on success the app swaps this component out, so only the failure path resets the state
    firebaseApi.login(emailInput.current.value, passwordInput.current.value).catch((error) => {
      setMessage(error.message);
      setIsLoggingIn(false);
    });
  };

  const forgotPassword = (evt) => {
    evt.preventDefault();
    resetMessages();
    setIsResetting(true);
    firebaseApi
      .sendPasswordResetEmail(emailInput.current.value)
      .then(() => setNotice('Password reset email sent'))
      .catch((error) => setMessage(error.message))
      .finally(() => setIsResetting(false));
  };

  return (
    <div className={styles.login}>
      <form className={styles.authForm} onSubmit={handleSubmit} data-testid="login-form">
        {message && (
          <p className={styles.error}>
            <span role="img">⚠</span>
            {message}
          </p>
        )}
        {notice && <p>{notice}</p>}
        <label aria-label="email">
          <input type="email" autoComplete="email" ref={emailInput} />
        </label>
        <label aria-label="password">
          <input type="password" autoComplete="password" ref={passwordInput} />
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
