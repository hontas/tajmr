import { initializeApp } from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from 'firebase/auth';
import {
  getDatabase,
  ref,
  push,
  set,
  remove,
  get,
  query,
  orderByChild,
  startAt,
  endAt,
  onChildAdded,
  onChildChanged,
  onChildRemoved,
} from 'firebase/database';

import { getWeek } from './time';

const config = {
  apiKey: 'AIzaSyDXVqvULyVze_vLoV6QFTsqwirITCj3Ai8',
  authDomain: 'tajmr.firebaseapp.com',
  databaseURL: 'https://tajmr.firebaseio.com',
  projectId: 'firebase-tajmr',
  storageBucket: 'firebase-tajmr.appspot.com',
  messagingSenderId: '784102119013',
};
const app = initializeApp(config);
const database = getDatabase(app);
const auth = getAuth(app);

const subscribers = [];
const api = {
  onAuthStateChanged(callback) {
    return onAuthStateChanged(auth, callback);
  },

  subscribe(fn) {
    subscribers.push(fn);
  },

  emit(action) {
    subscribers.forEach((fn) => fn(action));
  },

  login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  },

  sendPasswordResetEmail(email) {
    return sendPasswordResetEmail(auth, email);
  },

  logout() {
    return signOut(auth);
  },

  // the database rules restrict each user to their own path,
  // so nothing here filters by user
  async createInterval(data) {
    const id = push(intervalsRef()).key;
    return api.updateInterval({ ...data, id, createdAt: Date.now() });
  },

  async updateInterval({ id, ...interval }) {
    await set(intervalRef(id), { ...interval, updatedAt: Date.now() });
    return { ...interval, id };
  },

  async removeInterval(id) {
    return remove(intervalRef(id));
  },

  async fetchIntervalsInWeek(timestamp = Date.now()) {
    const { startTime, endTime } = getWeek(timestamp);
    const snapshot = await get(
      query(intervalsRef(), orderByChild('startTime'), startAt(startTime), endAt(endTime)),
    );
    return snapshot.val() || {}; // null when there are no intervals
  },

  async fetchIntervalsForUser() {
    const snapshot = await get(query(intervalsRef(), orderByChild('startTime')));
    return snapshot.val() || {}; // null when there are no intervals
  },

  getCurrentUserId() {
    return auth.currentUser && auth.currentUser.uid;
  },

  getUserSettings(user) {
    return get(ref(database, `users/${user.uid}`));
  },

  async updateUserPassword(oldPass, newPass) {
    const { currentUser } = auth;
    const credential = EmailAuthProvider.credential(currentUser.email, oldPass);
    await reauthenticateWithCredential(currentUser, credential);
    return updatePassword(currentUser, newPass);
  },

  saveUserData(userId, data) {
    return set(ref(database, `users/${userId}`), data);
  },

  listen({ intervalAdded, intervalRemoved, intervalUpdated }) {
    const uid = api.getCurrentUserId();
    if (!uid) return () => {};

    const intervals = ref(database, `userIntervals/${uid}`);
    const upcoming = query(intervals, orderByChild('startTime'), startAt(Date.now()));
    const toInterval = (snapshot) => ({ ...snapshot.val(), id: snapshot.key });

    const stopListening = [
      onChildAdded(upcoming, (snapshot) => api.emit(intervalAdded(toInterval(snapshot)))),
      onChildChanged(intervals, (snapshot) => api.emit(intervalUpdated(toInterval(snapshot)))),
      onChildRemoved(intervals, (snapshot) => api.emit(intervalRemoved(snapshot.key))),
    ];

    return () => stopListening.forEach((stop) => stop());
  },
};

function requireUserId() {
  const uid = api.getCurrentUserId();
  if (!uid) throw new Error('Not signed in');
  return uid;
}

function intervalsRef() {
  return ref(database, `userIntervals/${requireUserId()}`);
}

function intervalRef(id) {
  return ref(database, `userIntervals/${requireUserId()}/${id}`);
}

export default api;
