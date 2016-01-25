import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import * as socket from './socket';
import store from './store';
import { getJSON } from './utils/webApi';
import { findAll } from './utils/intervalsApi';
import { intervalsFetched } from './actions';
import { userLoggedIn, userLoggedOut } from './actions/userActions';
import Application from './components/application/application.jsx';

socket.init(store.dispatch);

ReactDOM.render(
  <Provider store={ store }>
    <Application />
  </Provider>,
  document.getElementById('root')
);


getJSON('/api/user')
  .then((user) => {
    if (!user) {
      return store.dispatch(userLoggedOut());
    }

    store.dispatch(userLoggedIn(user));
      return findAll()
        .then((res) => {
          console.log(res);
          store.dispatch(intervalsFetched(res));
        })
        .catch((err) => console.log(err));
  });
