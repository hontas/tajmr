import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

import { getWeek } from './time';

// Initialize Firebase
const config = {
  apiKey: 'AIzaSyDXVqvULyVze_vLoV6QFTsqwirITCj3Ai8',
  authDomain: 'tajmr.firebaseapp.com',
  databaseURL: 'https://tajmr.firebaseio.com',
  projectId: 'firebase-tajmr',
  storageBucket: 'firebase-tajmr.appspot.com',
  messagingSenderId: '784102119013',
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

  // Intervals live under the signed-in user: userIntervals/<uid>/<id>. The database rules only let
  // a user touch their own path, so nothing here filters by user.
  async createInterval(data) {
    const id = intervalsRef().push().key;
    return api.updateInterval({ ...data, id, createdAt: Date.now() });
  },

  async updateInterval({ id, ...interval }) {
    await intervalRef(id).set({ ...interval, updatedAt: Date.now() });
    return { ...interval, id };
  },

  async removeInterval(id) {
    return intervalRef(id).remove();
  },

  async fetchIntervalsInWeek(timestamp = Date.now()) {
    const { startTime, endTime } = getWeek(timestamp);
    const snapshot = await intervalsRef()
      .orderByChild('startTime')
      .startAt(startTime)
      .endAt(endTime)
      .once('value');
    return snapshot.val() || {}; // null when there are no intervals
  },

  async fetchIntervalsForUser() {
    const snapshot = await intervalsRef().orderByChild('startTime').once('value');
    return snapshot.val() || {}; // null when there are no intervals
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

  // Reports changes made on other devices as redux actions. Returns a function that stops listening.
  listen({ intervalAdded, intervalRemoved, intervalUpdated }) {
    const uid = api.getCurrentUserId();
    if (!uid) return () => {};

    const ref = database.ref(`userIntervals/${uid}`);
    const upcoming = ref.orderByChild('startTime').startAt(Date.now());
    const toInterval = (snapshot) => ({ ...snapshot.val(), id: snapshot.key });

    const onAdded = upcoming.on('child_added', (snapshot) =>
      api.emit(intervalAdded(toInterval(snapshot))),
    );
    const onChanged = ref.on('child_changed', (snapshot) =>
      api.emit(intervalUpdated(toInterval(snapshot))),
    );
    const onRemoved = ref.on('child_removed', (snapshot) =>
      api.emit(intervalRemoved(snapshot.key)),
    );

    return () => {
      upcoming.off('child_added', onAdded);
      ref.off('child_changed', onChanged);
      ref.off('child_removed', onRemoved);
    };
  },
};

function requireUserId() {
  const uid = api.getCurrentUserId();
  if (!uid) throw new Error('Not signed in');
  return uid;
}

function intervalsRef() {
  return database.ref(`userIntervals/${requireUserId()}`);
}

function intervalRef(id) {
  return database.ref(`userIntervals/${requireUserId()}/${id}`);
}

export default api;
