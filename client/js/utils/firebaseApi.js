import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

import store from '../store';
import { getJSON } from './webApi';
import { intervalUpdated, removeInterval, fetchIntervals } from '../actions/intervals';
import { userLoggedIn, userLoggedOut, updateSettings } from '../actions/userActions';

// const firebaseUrl = 'https://tajmr.firebaseio.com';
// const firebase = new Firebase(firebaseUrl);

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
  console.log('authstate changed', user);
  if (user) {
    console.log('logged in');
    //store.dispatch(userLoggedIn(user));
    database.ref('users/' + user.uid).once('value')
      .then((settings) => {
        store.dispatch(updateSettings(settings.val()));
      });
  } else {
    store.dispatch(userLoggedOut());
  }

  // using setImmediate due to async problem causing
  // intervalsApi to say that firebaseApi was undefined..
  setTimeout(() => store.dispatch(fetchIntervals()));
});

const api = {
  login(email, password) {
    return auth.signInWithEmailAndPassword(email, password)
      .then((user) => console.log('user', user));
  },

  logout() {
    return firebase.unauth();
  },

  ref: firebase,

  intervals: database.ref('intervals'),

  users: database.ref('users'),

  getAllIntervals() {
    return api.intervals
      .orderByChild('user')
      .equalTo(auth.currentUser && auth.currentUser.uid)
      .limitToLast(50)
      .once('value')
      .then((snapshot) => (snapshot.val()));
  },

  init() {
    const intervals = api.intervals
          .orderByChild('user');

    intervals.on('child_added', (snapshot) => {
      const interval = snapshot.val();
      const userId = auth.currentUser && auth.currentUser.uid;

      if (interval.user !== userId) return;

      const newInterval = Object.assign({id: snapshot.key }, snapshot.val());
      store.dispatch(intervalUpdated(newInterval));
    });

    intervals.on('child_changed', (snapshot) => {
      const updatedInterval = Object.assign({id: snapshot.key }, snapshot.val());
      store.dispatch(intervalUpdated(updatedInterval));
    });

    intervals.on('child_removed', (snapshot) => {
      store.dispatch(removeInterval(snapshot.key));
    });
  }
};

export default api;
