import React from 'react';
import firebaseApi from '../../utils/firebaseApi';

const Login = () => (
  <form className="auth-form" onSubmit={handleSubmit}>
    <input name="username" type="email" />
    <input name="password" type="password" />
    <button className="pure-button" type="submit">Logga in</button>
  </form>
);

function handleSubmit(evt) {
  evt.preventDefault();
  firebaseApi.login(evt.target.username.value, evt.target.password.value);
}

export default Login;