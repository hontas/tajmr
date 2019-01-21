import React from 'react';
import firebaseApi from '../../utils/firebaseApi';
import Button from '../button/button.jsx';

class Login extends React.Component {
  state = {
    isLoggingIn: false,
    isResetting: false,
    message: ''
  };

  render() {
    const { isLoggingIn, isResetting, message } = this.state;
    return (
      <div className="login">
        <form className="auth-form" onSubmit={this.handleSubmit}>
          {message && (
            <p className="login__error">
              <span role="img">⚠</span>
              {message}
            </p>
          )}
          <label htmlFor="username">
            <input
              type="email"
              autoComplete="username"
              ref={(node) => {
                this.username = node;
              }}
              id="username"
            />
          </label>
          <label htmlFor="secretword">
            <input
              type="password"
              autoComplete="current-password"
              ref={(node) => {
                this.passwd = node;
              }}
              id="secretword"
            />
          </label>
          <Button type="submit" onClick={this.handleSubmit} isLoading={isLoggingIn} theme="primary">
            Log in
          </Button>
          <Button onClick={this.resetPassword} isLoading={isResetting} theme="link">
            Forgot password
          </Button>
        </form>
      </div>
    );
  }

  handleSubmit = (evt) => {
    evt.preventDefault();
    this.setState({ isLoggingIn: true });
    firebaseApi
      .login(this.username.value, this.passwd.value)
      .then(this.onLoaded, this.onLoaded)
      .finally(() => this.setState({ isLoggingIn: false }));
  };

  resetPassword = (evt) => {
    evt.preventDefault();
    this.setState({ isResetting: true });
    firebaseApi
      .sendPasswordResetEmail(this.username.value)
      .then(this.onLoaded, this.onLoaded)
      .finally(() => this.setState({ isResetting: false }));
  };

  onLoaded = ({ message = '' } = {}) => {
    this.setState({ message });
  };
}

export default Login;
