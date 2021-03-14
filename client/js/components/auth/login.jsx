import React, { useState, useRef } from 'react';
import firebaseApi from '../../api/firebase';
import Button from '../button/button.jsx';
import './login.css';

const Login = () => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [message, setMessage] = useState('');
  const emailInput = useRef(null);
  const passwordInput = useRef(null);

  const resetMessage = () => setMessage('');

  const handleSubmit = (evt) => {
    evt.preventDefault();
    setIsLoggingIn(false);
    firebaseApi
      .login(emailInput.current.value, passwordInput.current.value)
      .then(resetMessage, resetMessage)
      .finally(() => setIsLoggingIn(false));
  };

  const forgotPassword = (evt) => {
    evt.preventDefault();
    setIsResetting(true);
    firebaseApi
      .sendPasswordResetEmail(emailInput.current.value)
      .then(resetMessage, resetMessage)
      .finally(() => setIsResetting(false));
  };

  return (
    <div className="login">
      <form className="login__auth-form" onSubmit={handleSubmit} data-testid="login-form">
        {message && (
          <p className="login__error">
            <span role="img">⚠</span>
            {message}
          </p>
        )}
        <label aria-label="email">
          <input className="login__input" type="email" autoComplete="email" ref={emailInput} />
        </label>
        <label aria-label="password">
          <input
            className="login__input"
            type="password"
            autoComplete="password"
            ref={passwordInput}
          />
        </label>
        <Button type="submit" onClick={handleSubmit} isLoading={isLoggingIn} theme="primary">
          Log in
        </Button>
        <Button onClick={forgotPassword} isLoading={isResetting} theme="link">
          Forgot password
        </Button>
      </form>
    </div>
  );
};

export default Login;
