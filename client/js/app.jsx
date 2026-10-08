import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';

import '../styles/critical.css';
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
  reset as intervalReset,
} from './redux/intervals';
import Application from './components/application/application.jsx';
import './register-sw';

if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [new Integrations.BrowserTracing()],
    release: process.env.RELEASE,
    tracesSampleRate: 0.2,
  });
}

export const store = createStore(); // eslint-disable-line
firebaseApi.subscribe((action) => store.dispatch(action));
let stopListening = () => {};
firebaseApi.auth.onAuthStateChanged((user) => {
  stopListening();
  stopListening = () => {};
  store.dispatch(appActions.initialized());
  if (user) {
    store.dispatch(userActions.userLoggedIn(user));
    store.dispatch(fetchIntervalsForUser());
    stopListening = firebaseApi.listen({ intervalAdded, intervalRemoved, intervalUpdated });
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

ReactDOM.render(<App />, document.getElementById('root'));
