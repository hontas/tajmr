import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import store from './store';
import { getJSON } from './utils/webApi';
import { userLoggedIn, userLoggedOut } from './actions/userActions';
import Application from './components/application/application.jsx';

ReactDOM.render(
  <Provider store={ store }>
    <Application />
  </Provider>,
  document.getElementById('root')
);

getJSON('/user')
  .then((user) => store.dispatch(userLoggedIn(user)))
  .catch(() => store.dispatch(userLoggedOut()));
