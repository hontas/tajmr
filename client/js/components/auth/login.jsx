import React from 'react';
import firebaseApi from '../../utils/firebaseApi';
import Button from '../button/button.jsx';

class Login extends React.Component {
  state = {
    isLoading: false,
    message: ''
  };

  render() {
    const { isLoading, message } = this.state;
    return (
      <div className="login">
        <form className="auth-form" onSubmit={this.handleSubmit}>
          {message &&
            <p className="login__error">
              <span role="img">⚠</span>
              {message}
            </p>
          }
          <label>
            <input type="email" autoComplete="username" ref={(node) => { this.username = node; }} />
          </label>
          <label>
            <input type="password" autoComplete="current-password" ref={(node) => { this.passwd = node; }} />
          </label>
          <Button type="submit" onClick={this.handleSubmit} isLoading={isLoading} theme="primary">
            Logga in
          </Button>
          <Button theme="link" onClick={this.resetPassword}>Forgot password</Button>
        </form>
      </div>
    );
  }

  handleSubmit = (evt) => {
    evt.preventDefault();
    this.setState({ isLoading: true });
    firebaseApi.login(this.username.value, this.passwd.value)
      .then(this.onLoaded, this.onLoaded);
  }

  resetPassword = (evt) => {
    evt.preventDefault();
    this.setState({ isLoading: true });
    firebaseApi.sendPasswordResetEmail(this.username.value)
      .then(this.onLoaded, this.onLoaded);
  }

  onLoaded = ({ message = '' } = {}) => {
    this.setState({ isLoading: false, message });
  };
}

export default Login;
