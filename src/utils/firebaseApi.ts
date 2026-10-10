import { initializeApp } from 'firebase/app';
import {
  type User,
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
  onValue,
  type DataSnapshot,
} from 'firebase/database';

import * as v from 'valibot';

import type { Action } from '#/store/types.ts';
import { getWeek } from './time.ts';
import {
  isInterval,
  userSettingsSchema,
  type Interval,
  type NewInterval,
  type UserSettingsData,
} from './interValidator.ts';

interface ListenActions {
  intervalAdded: (interval: Interval) => Action;
  intervalUpdated: (interval: Interval) => Action;
  intervalRemoved: (id: string) => Action;
  settingsChanged: (settings: UserSettingsData | null) => Action;
}

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

type Subscriber = (action: Action) => void;
const subscribers: Subscriber[] = [];
const api = {
  onAuthStateChanged(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
  },

  subscribe(fn: Subscriber) {
    subscribers.push(fn);
  },

  emit(action: Action) {
    subscribers.forEach((fn) => fn(action));
  },

  login(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password);
  },

  sendPasswordResetEmail(email: string) {
    return sendPasswordResetEmail(auth, email);
  },

  logout() {
    return signOut(auth);
  },

  // the database rules restrict each user to their own path,
  // so nothing here filters by user
  async createInterval(data: NewInterval): Promise<Interval> {
    const id = push(intervalsRef()).key;
    if (!id) throw new Error('Could not create an interval id');
    return api.updateInterval({ ...data, id, createdAt: Date.now() });
  },

  async updateInterval({ id, ...interval }: Interval & { id: string }): Promise<Interval> {
    await set(intervalRef(id), { ...interval, updatedAt: Date.now() });
    return { ...interval, id };
  },

  async removeInterval(id: string) {
    return remove(intervalRef(id));
  },

  async fetchIntervalsInWeek(timestamp: number = Date.now()): Promise<Record<string, unknown>> {
    const { startTime, endTime } = getWeek(timestamp);
    const snapshot = await get(
      query(intervalsRef(), orderByChild('startTime'), startAt(startTime), endAt(endTime)),
    );
    return snapshot.val() || {}; // null when there are no intervals
  },

  async fetchIntervalsForUser(): Promise<Record<string, unknown>> {
    const snapshot = await get(query(intervalsRef(), orderByChild('startTime')));
    return snapshot.val() || {}; // null when there are no intervals
  },

  getCurrentUserId() {
    return auth.currentUser && auth.currentUser.uid;
  },

  async updateUserPassword(oldPass: string, newPass: string) {
    const { currentUser } = auth;
    if (!currentUser?.email) throw new Error('Not signed in');
    const credential = EmailAuthProvider.credential(currentUser.email, oldPass);
    await reauthenticateWithCredential(currentUser, credential);
    return updatePassword(currentUser, newPass);
  },

  saveUserData(userId: string, data: UserSettingsData) {
    return set(ref(database, `users/${userId}`), data);
  },

  listen({ intervalAdded, intervalRemoved, intervalUpdated, settingsChanged }: ListenActions) {
    const uid = api.getCurrentUserId();
    if (!uid) return () => {};

    const intervals = ref(database, `userIntervals/${uid}`);
    const upcoming = query(intervals, orderByChild('startTime'), startAt(Date.now()));
    const emitInterval =
      (createAction: (interval: Interval) => Action) => (snapshot: DataSnapshot) => {
        const interval = { ...snapshot.val(), id: snapshot.key };
        if (isInterval(interval)) api.emit(createAction(interval));
      };

    const stopListening = [
      onChildAdded(upcoming, emitInterval(intervalAdded)),
      onChildChanged(intervals, emitInterval(intervalUpdated)),
      onChildRemoved(intervals, (snapshot) => {
        if (snapshot.key) api.emit(intervalRemoved(snapshot.key));
      }),
      onValue(ref(database, `users/${uid}`), (snapshot) => {
        const settings = snapshot.val();
        if (settings === null) {
          api.emit(settingsChanged(null));
          return;
        }
        const result = v.safeParse(userSettingsSchema, settings);
        if (result.success) api.emit(settingsChanged(result.output));
      }),
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

function intervalRef(id: string) {
  return ref(database, `userIntervals/${requireUserId()}/${id}`);
}

export default api;
