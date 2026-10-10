import { initializeApp } from 'firebase/app';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from 'firebase/auth';
import {
  ref,
  push,
  set,
  remove,
  get,
  onChildAdded,
  onChildChanged,
  onChildRemoved,
} from 'firebase/database';

import api from './firebaseApi';

const mock = vi.hoisted(() => ({
  auth: { currentUser: null },
  stops: [],
}));

vi.mock('firebase/app', () => ({ initializeApp: vi.fn(() => 'app') }));
vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => mock.auth),
  onAuthStateChanged: vi.fn(() => 'unsubscribe'),
  signInWithEmailAndPassword: vi.fn(() => Promise.resolve('signed-in')),
  sendPasswordResetEmail: vi.fn(() => Promise.resolve()),
  signOut: vi.fn(() => Promise.resolve()),
  EmailAuthProvider: { credential: vi.fn(() => 'credential') },
  reauthenticateWithCredential: vi.fn(() => Promise.resolve()),
  updatePassword: vi.fn(() => Promise.resolve()),
}));
vi.mock('firebase/database', () => {
  const mockListener = () =>
    vi.fn(() => {
      const stop = vi.fn();
      mock.stops.push(stop);
      return stop;
    });
  return {
    getDatabase: vi.fn(() => 'database'),
    ref: vi.fn((database, path) => ({ path })),
    push: vi.fn(() => ({ key: 'new-id' })),
    set: vi.fn(() => Promise.resolve()),
    remove: vi.fn(() => Promise.resolve()),
    get: vi.fn(),
    query: vi.fn((target, ...constraints) => ({ ...target, constraints })),
    orderByChild: vi.fn((child) => ({ orderByChild: child })),
    startAt: vi.fn((value) => ({ startAt: value })),
    endAt: vi.fn((value) => ({ endAt: value })),
    onChildAdded: mockListener(),
    onChildChanged: mockListener(),
    onChildRemoved: mockListener(),
  };
});

// the app is initialised when firebaseApi is imported; mock call history is cleared before each test
const initializeAppCalls = initializeApp.mock.calls.length;
const snapshot = (value, key) => ({ val: () => value, key });
const me = 'userIntervals/me';
const paths = () => new Set(ref.mock.calls.map(([, path]) => path));

describe('firebaseApi', () => {
  beforeEach(() => {
    vi.spyOn(Date, 'now').mockReturnValue(9999);
    mock.auth.currentUser = { uid: 'me', email: 'me@example.com' };
    mock.stops.length = 0;
  });

  afterEach(() => vi.restoreAllMocks());

  test('initialises firebase once', () => {
    expect(initializeAppCalls).toBe(1);
  });

  describe('auth', () => {
    test('login, logout and password reset delegate to firebase auth', async () => {
      await expect(api.login('a@b.c', 'pw')).resolves.toBe('signed-in');
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(mock.auth, 'a@b.c', 'pw');

      await api.sendPasswordResetEmail('a@b.c');
      expect(sendPasswordResetEmail).toHaveBeenCalledWith(mock.auth, 'a@b.c');

      await api.logout();
      expect(signOut).toHaveBeenCalledWith(mock.auth);
    });

    test('onAuthStateChanged listens to the auth state and returns the stop function', () => {
      const callback = vi.fn();

      expect(api.onAuthStateChanged(callback)).toBe('unsubscribe');
      expect(onAuthStateChanged).toHaveBeenCalledWith(mock.auth, callback);
    });

    test('getCurrentUserId returns the uid', () => {
      expect(api.getCurrentUserId()).toBe('me');
    });
  });

  describe('subscribe / emit', () => {
    test('emit calls every subscriber with the action', () => {
      const a = vi.fn();
      const b = vi.fn();
      api.subscribe(a);
      api.subscribe(b);

      api.emit({ type: 'X' });

      expect(a).toHaveBeenCalledWith({ type: 'X' });
      expect(b).toHaveBeenCalledWith({ type: 'X' });
    });
  });

  describe('writes (always under the signed-in user)', () => {
    test('createInterval writes userIntervals/<uid>/<new id> with createdAt and updatedAt, no user field', async () => {
      const result = await api.createInterval({ startTime: 1, note: 'n' });

      expect(push).toHaveBeenCalledWith({ path: me });
      expect(set).toHaveBeenCalledWith(
        { path: `${me}/new-id` },
        { startTime: 1, note: 'n', createdAt: 9999, updatedAt: 9999 },
      );
      expect(result).toEqual({ startTime: 1, note: 'n', createdAt: 9999, id: 'new-id' });
    });

    test('updateInterval sets updatedAt and resolves without it', async () => {
      const result = await api.updateInterval({ id: 'i1', startTime: 5 });

      expect(set).toHaveBeenCalledWith({ path: `${me}/i1` }, { startTime: 5, updatedAt: 9999 });
      expect(result).toEqual({ id: 'i1', startTime: 5 });
    });

    test('removeInterval removes the interval of the user', async () => {
      await api.removeInterval('i1');
      expect(remove).toHaveBeenCalledWith({ path: `${me}/i1` });
    });

    test('saveUserData writes to users/{id}', async () => {
      await api.saveUserData('u1', { hoursInWeek: 30 });
      expect(set).toHaveBeenCalledWith({ path: 'users/u1' }, { hoursInWeek: 30 });
    });

    test('rejects (without touching the database) when nobody is signed in', async () => {
      mock.auth.currentUser = null;

      await expect(api.createInterval({ startTime: 1 })).rejects.toThrow('Not signed in');
      await expect(api.updateInterval({ id: 'i1', startTime: 1 })).rejects.toThrow('Not signed in');
      await expect(api.removeInterval('i1')).rejects.toThrow('Not signed in');
      await expect(api.fetchIntervalsForUser()).rejects.toThrow('Not signed in');
      expect(ref).not.toHaveBeenCalled();
    });
  });

  describe('fetching (only ever reads the signed-in users own path)', () => {
    const data = { a: { startTime: 1 }, b: { startTime: 2 } };

    test('fetchIntervalsForUser returns the users intervals ordered by startTime', async () => {
      get.mockResolvedValue(snapshot(data));

      await expect(api.fetchIntervalsForUser()).resolves.toEqual(data);
      expect(get).toHaveBeenCalledWith({
        path: me,
        constraints: [{ orderByChild: 'startTime' }],
      });
    });

    test('fetchIntervalsInWeek queries the week range', async () => {
      get.mockResolvedValue(snapshot(data));

      await expect(api.fetchIntervalsInWeek(new Date(2021, 3, 7, 12).getTime())).resolves.toEqual(
        data,
      );
      expect(get).toHaveBeenCalledWith({
        path: me,
        constraints: [
          { orderByChild: 'startTime' },
          { startAt: +new Date(2021, 3, 5) },
          { endAt: +new Date(2021, 3, 12) },
        ],
      });
    });

    test('a user without intervals gets an empty object', async () => {
      get.mockResolvedValue(snapshot(null));

      await expect(api.fetchIntervalsForUser()).resolves.toEqual({});
      await expect(api.fetchIntervalsInWeek(Date.UTC(2021, 3, 7))).resolves.toEqual({});
    });

    test('never reads the shared intervals node or another users path', async () => {
      get.mockResolvedValue(snapshot(data));

      await api.fetchIntervalsForUser();
      await api.fetchIntervalsInWeek();

      expect([...paths()]).toEqual([me]);
    });

    test('getUserSettings reads users/{uid}', async () => {
      const snap = snapshot({ hoursInWeek: 20 });
      get.mockResolvedValue(snap);

      await expect(api.getUserSettings({ uid: 'me' })).resolves.toBe(snap);
      expect(get).toHaveBeenCalledWith({ path: 'users/me' });
    });
  });

  describe('updateUserPassword', () => {
    test('reauthenticates before changing the password', async () => {
      const calls = [];
      reauthenticateWithCredential.mockImplementationOnce(() => {
        calls.push('reauth');
        return Promise.resolve();
      });
      updatePassword.mockImplementationOnce(() => {
        calls.push('update');
        return Promise.resolve();
      });

      await api.updateUserPassword('old', 'new');

      expect(EmailAuthProvider.credential).toHaveBeenCalledWith('me@example.com', 'old');
      expect(reauthenticateWithCredential).toHaveBeenCalledWith(
        mock.auth.currentUser,
        'credential',
      );
      expect(updatePassword).toHaveBeenCalledWith(mock.auth.currentUser, 'new');
      expect(calls).toEqual(['reauth', 'update']);
    });
  });

  describe('listen', () => {
    const actions = {
      intervalAdded: (i) => ({ type: 'added', i }),
      intervalUpdated: (i) => ({ type: 'updated', i }),
      intervalRemoved: (id) => ({ type: 'removed', id }),
    };

    test('emits actions for added, changed and removed intervals of the user', () => {
      const emitted = [];
      api.subscribe((action) => emitted.push(action));

      api.listen(actions);
      const [[, added]] = onChildAdded.mock.calls;
      const [[, changed]] = onChildChanged.mock.calls;
      const [[, removed]] = onChildRemoved.mock.calls;
      added(snapshot({ startTime: 1 }, 'a1'));
      changed(snapshot({ startTime: 2 }, 'c1'));
      removed(snapshot(null, 'r1'));

      expect(emitted).toEqual([
        { type: 'added', i: { startTime: 1, id: 'a1' } },
        { type: 'updated', i: { startTime: 2, id: 'c1' } },
        { type: 'removed', id: 'r1' },
      ]);
    });

    test('only listens on the users own path, and only for new intervals when added', () => {
      api.listen(actions);

      expect([...paths()]).toEqual([me]);
      expect(onChildAdded).toHaveBeenCalledWith(
        { path: me, constraints: [{ orderByChild: 'startTime' }, { startAt: 9999 }] },
        expect.any(Function),
      );
      expect(onChildChanged).toHaveBeenCalledWith({ path: me }, expect.any(Function));
      expect(onChildRemoved).toHaveBeenCalledWith({ path: me }, expect.any(Function));
    });

    test('returns a function that stops all three listeners', () => {
      const stop = api.listen(actions);
      expect(mock.stops).toHaveLength(3);

      stop();

      mock.stops.forEach((stopListener) => expect(stopListener).toHaveBeenCalledTimes(1));
    });

    test('does nothing when nobody is signed in', () => {
      mock.auth.currentUser = null;

      const stop = api.listen(actions);

      expect(ref).not.toHaveBeenCalled();
      expect(() => stop()).not.toThrow();
    });
  });
});
