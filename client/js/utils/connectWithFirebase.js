import * as userActions from '../redux/user';
import * as appActions from '../redux/app';
import * as userSettingsActions from '../redux/userSettings';
import {
  intervalAdded,
  intervalRemoved,
  intervalUpdated,
  fetchIntervalsForUser,
  reset as intervalReset,
} from '../redux/intervals';

import firebaseApi from '../api/firebase';

export default function connectWithFirebase(store) {
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
}
