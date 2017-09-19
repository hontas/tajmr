import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

import store from '../store';
import { intervalAdded, intervalUpdated, fetchIntervalsForUser } from '../actions/intervals';
import { userLoggedIn, userLoggedOut, updateSettings } from '../actions/userActions';

// Initialize Firebase
const config = {
  apiKey: 'AIzaSyDXVqvULyVze_vLoV6QFTsqwirITCj3Ai8',
  authDomain: 'tajmr.firebaseapp.com',
  databaseURL: 'https://tajmr.firebaseio.com',
  projectId: 'firebase-tajmr',
  storageBucket: 'firebase-tajmr.appspot.com',
  messagingSenderId: '784102119013'
};
firebase.initializeApp(config);

const database = firebase.database();
const auth = firebase.auth();

auth.onAuthStateChanged((user) => {
  if (user) {
    store.dispatch(userLoggedIn(user));
    database.ref(`users/${user.uid}`)
      .once('value')
      .then((settings) => store.dispatch(updateSettings(settings.val())));

    store.dispatch(fetchIntervalsForUser(user.uid));
  } else {
    store.dispatch(userLoggedOut());
  }
});

const api = {
  login(email, password) {
    return auth.signInWithEmailAndPassword(email, password)
      .catch((err) => console.error(err));
  },

  logout() {
    return auth.signOut()
      .catch((err) => console.error(err));
  },

  ref: firebase,

  intervals: database.ref().child('intervals'),

  createInterval(data) {
    const id = database.ref().child('intervals').push().key;
    const user = api.getCurrentUserId();
    return api.updateInterval({
      ...data,
      id,
      user,
      createdAt: Date.now()
    });
  },

  updateInterval({ id, ...interval }) {
    return database.ref(`intervals/${id}`)
      .set({ ...interval, updatedAt: Date.now() });
  },

  removeInterval(id) {
    return database.ref(`intervals/${id}`).remove();
  },

  fetchIntervalsForUser({ limit = 10 } = {}) {
    return api.intervals
      .orderByChild('user')
      .equalTo(auth.currentUser && auth.currentUser.uid)
      .limitToLast(limit)
      .once('value')
      .then((snapshot) => (snapshot.val()));
  },

  getCurrentUserId() {
    return auth.currentUser && auth.currentUser.uid;
  },

  saveUserData(userId, data) {
    return database.ref(`users/${userId}`).set(data);
  },

  init() {
    api.intervals
      .orderByChild('startTime')
      .startAt(Date.now())
      .on('child_added', (snapshot) => {
        const interval = snapshot.val();
        const userId = auth.currentUser && auth.currentUser.uid;
        console.log('child_added!!!!', interval);

        if (interval.user !== userId) return;

        const id = snapshot.key;
        store.dispatch(intervalAdded({ ...interval, id }));
      });

    api.intervals.on('child_changed', (snapshot) => {
      const interval = snapshot.val();
      const id = snapshot.key;
      console.log('child_changed', interval, id);
      store.dispatch(intervalUpdated({ ...interval, id }));
    });
  }
};

export default api;
