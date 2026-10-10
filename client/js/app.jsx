import React from 'react';
import { createRoot } from 'react-dom/client';
import * as Sentry from '@sentry/react';

import firebaseApi from './utils/firebaseApi';
import createStore from './store/createStore';
import * as userActions from './store/user';
import * as appActions from './store/app';
import * as userSettingsActions from './store/userSettings';
import {
  intervalAdded,
  intervalRemoved,
  intervalUpdated,
  fetchIntervalsForUser,
  reset as intervalReset,
} from './store/intervals';
import Application from './components/application/application.jsx';
import { StoreProvider } from './store/useStore';

if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [Sentry.browserTracingIntegration()],
    release: process.env.RELEASE,
    tracesSampleRate: 0.2,
  });
}

export const store = createStore();
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
  <StoreProvider store={store}>
    <Application />
  </StoreProvider>
);

createRoot(document.getElementById('root')).render(<App />);
