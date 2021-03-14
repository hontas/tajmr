import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

import { getWeek } from '../utils/time';

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: 'tajmr.firebaseapp.com',
  databaseURL: 'https://tajmr.firebaseio.com',
  projectId: 'firebase-tajmr',
  storageBucket: 'firebase-tajmr.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_SENDER_ID,
};
firebase.initializeApp(config);

const database = firebase.database();
const auth = firebase.auth();

const subscribers = [];
const api = {
  auth,

  subscribe(fn) {
    subscribers.push(fn);
  },

  emit(action) {
    subscribers.forEach((fn) => fn(action));
  },

  login(email, password) {
    return Promise.resolve(auth.signInWithEmailAndPassword(email, password));
  },

  sendPasswordResetEmail(email) {
    return Promise.resolve(auth.sendPasswordResetEmail(email));
  },

  logout() {
    return Promise.resolve(auth.signOut());
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
      createdAt: Date.now(),
    });
  },

  updateInterval({ id, ...interval }) {
    return database
      .ref(`intervals/${id}`)
      .set({ ...interval, updatedAt: Date.now() })
      .then(() => ({ ...interval, id }));
  },

  removeInterval(id) {
    return database.ref(`intervals/${id}`).remove();
  },

  fetchIntervalsInWeek(timestamp = Date.now()) {
    const { startTime, endTime } = getWeek(timestamp);
    return api.intervals
      .orderByChild('startTime')
      .startAt(startTime)
      .endAt(endTime)
      .once('value')
      .then((snapshot) => snapshot.val())
      .then(filterByUser);
  },

  fetchIntervalsForUser() {
    return api.intervals
      .orderByChild('startTime')
      .once('value')
      .then((snapshot) => snapshot.val())
      .then(filterByUser);
  },

  getCurrentUserId() {
    return auth.currentUser && auth.currentUser.uid;
  },

  getUserSettings(user) {
    return database.ref(`users/${user.uid}`).once('value');
  },

  updateUserPassword(oldPass, newPass) {
    const credential = firebase.auth.EmailAuthProvider.credential(auth.currentUser.email, oldPass);
    return auth.currentUser
      .reauthenticateWithCredential(credential)
      .then(() => auth.currentUser.updatePassword(newPass));
  },

  saveUserData(userId, data) {
    return database.ref(`users/${userId}`).set(data);
  },

  init({ intervalAdded, intervalRemoved, intervalUpdated }) {
    api.intervals
      .orderByChild('startTime')
      .startAt(Date.now())
      .on('child_added', (snapshot) => {
        const interval = snapshot.val();
        const userId = auth.currentUser?.uid;

        if (userId && interval.user === userId) {
          // eslint-disable-next-line no-console
          console.log('child_added', interval, userId);
          const id = snapshot.key;
          api.emit(intervalAdded({ ...interval, id }));
        }
      });

    api.intervals.on('child_changed', (snapshot) => {
      const interval = snapshot.val();
      const userId = auth.currentUser?.uid;

      if (userId && interval.user === userId) {
        // eslint-disable-next-line no-console
        console.log('child_changed', interval);
        const id = snapshot.key;
        api.emit(intervalUpdated({ ...interval, id }));
      }
    });

    api.intervals.on('child_removed', (snapshot) => {
      const interval = snapshot.val();
      const id = snapshot.key;
      const userId = auth.currentUser?.uid;

      if (userId && interval.user === userId) {
        // eslint-disable-next-line no-console
        console.log('child_removed', id);
        api.emit(intervalRemoved(id));
      }
    });
  },
};

function filterByUser(intervals) {
  const userId = auth.currentUser && auth.currentUser.uid;
  return Object.keys(intervals).reduce((res, id) => {
    if (intervals[id].user === userId) {
      return { [id]: intervals[id], ...res };
    }
    return res;
  }, {});
}

export default api;
