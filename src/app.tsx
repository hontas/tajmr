import React from 'react';
import { createRoot } from 'react-dom/client';
import * as Sentry from '@sentry/react';

import firebaseApi from './utils/firebaseApi.ts';
import createStore from './store/createStore.ts';
import * as userActions from './store/user.ts';
import * as appActions from './store/app.ts';
import * as userSettingsActions from './store/userSettings.ts';
import {
  intervalAdded,
  intervalRemoved,
  intervalUpdated,
  fetchIntervalsForUser,
  reset as intervalReset,
} from './store/intervals.ts';
import Application from './components/application/application.tsx';
import { StoreProvider } from './store/useStore.tsx';

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
firebaseApi.onAuthStateChanged((user) => {
  stopListening();
  stopListening = () => {};
  store.dispatch(appActions.initialized());
  if (user) {
    store.dispatch(userActions.userLoggedIn(user));
    store.dispatch(fetchIntervalsForUser());
    stopListening = firebaseApi.listen({
      intervalAdded,
      intervalRemoved,
      intervalUpdated,
      settingsChanged: userSettingsActions.updateSettings,
    });
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

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('#root is missing');

createRoot(rootElement).render(<App />);
