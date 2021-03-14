/* eslint-disable react/jsx-filename-extension */
import 'core-js';
import 'regenerator-runtime/runtime';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import * as Sentry from '@sentry/browser';

import '../styles/critical.styl';
import '../styles';
import firebaseApi from './utils/firebaseApi';
import createStore from './redux/createStore';
import * as userActions from './redux/user';
import * as appActions from './redux/app';
import * as userSettingsActions from './redux/userSettings';
import {
  intervalAdded,
  intervalRemoved,
  intervalUpdated,
  fetchIntervalsForUser,
  reset as intervalReset
} from './redux/intervals';
import Application from './components/application/application.jsx';
import './register-sw';

Sentry.init({ dsn: 'https://a359f82382f84f2d85c9a876827f8e1a@sentry.io/1836574' });

export const store = createStore(); // eslint-disable-line
firebaseApi.subscribe((action) => store.dispatch(action));
firebaseApi.init({ intervalAdded, intervalRemoved, intervalUpdated });
firebaseApi.auth.onAuthStateChanged((user) => {
  store.dispatch(appActions.initialized());
  if (user) {
    store.dispatch(userActions.userLoggedIn(user));
    store.dispatch(fetchIntervalsForUser());
    firebaseApi
      .getUserSettings(user)
      .then((settings) => store.dispatch(userSettingsActions.updateSettings(settings.val())));
  } else {
    store.dispatch(userActions.userLoggedOut());
    store.dispatch(intervalReset());
  }
});

const App = () => (
  <Provider store={store}>
    <Application />
  </Provider>
);

if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line global-require
  // const axe = require('react-axe');
  // axe(React, ReactDOM, 1000);
  ReactDOM.render(<App />, document.getElementById('root'));
} else {
  ReactDOM.render(<App />, document.getElementById('root'));
}
