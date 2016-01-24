import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import store from './store';
import { getJSON } from './utils/webApi';
import { findAll } from './utils/intervalsApi';
import { intervalsFetched } from './actions';
import { userLoggedIn, userLoggedOut } from './actions/userActions';
import Application from './components/application/application.jsx';

ReactDOM.render(
  <Provider store={ store }>
    <Application />
  </Provider>,
  document.getElementById('root')
);


getJSON('/api/user')
  .then((user) => store.dispatch(userLoggedIn(user)))
  .catch((err) => {
    store.dispatch(userLoggedOut());
    throw err;
  })
  .then(findAll)
  .then((res) => store.dispatch(intervalsFetched(res)))
  .catch((err) => console.log(err));
