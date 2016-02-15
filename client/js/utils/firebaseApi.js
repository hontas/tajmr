/* globals Firebase */

import store from '../store';
import { getJSON } from './webApi';
import { intervalUpdated, removeInterval, fetchIntervals } from '../actions/intervals';
import { userLoggedIn, userLoggedOut, updateSettings } from '../actions/userActions';

const firebaseUrl = 'https://tajmr.firebaseio.com';
const firebase = new Firebase(firebaseUrl);

firebase.onAuth((authData) => {
  if (authData) {
    store.dispatch(userLoggedIn(authData));
    getJSON(`${firebaseUrl}/users/${authData.uid}.json`)
      .then(settings => store.dispatch(updateSettings(settings)));
  } else {
    store.dispatch(userLoggedOut());
  }

  // using setImmediate due to async problem causing
  // intervalsApi to say that firebaseApi was undefined..
  setImmediate(() => store.dispatch(fetchIntervals()));
});

export default {
  login(email, password) {
    return new Promise((resolve, reject) => {
      firebase.authWithPassword({
        email, password
      }, (error, authData) => {
        if (error) return reject(error);
        resolve(authData);
      });
    });
  },

  logout() {
    return firebase.unauth();
  },

  ref: firebase,

  intervals: firebase.child('intervals'),

  users: firebase.child('users'),

  init() {
    const auth = firebase.getAuth();
    const intervals = firebase.child('intervals')
          .orderByChild('user')
          .equalTo(auth && auth.uid);

    intervals.on('child_added', (snapshot) => {
      const newInterval = Object.assign({id: snapshot.key() }, snapshot.val());
      store.dispatch(intervalUpdated(newInterval));
    });

    intervals.on('child_changed', (snapshot) => {
      const updatedInterval = Object.assign({id: snapshot.key() }, snapshot.val());
      store.dispatch(intervalUpdated(updatedInterval));
    });

    intervals.on('child_removed', (snapshot) => {
      store.dispatch(removeInterval(snapshot.key()));
    });
  }
};
