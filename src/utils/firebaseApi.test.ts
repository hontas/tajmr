import { initializeApp } from 'firebase/app';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  type User,
  type UserCredential,
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
  onValue,
  type DataSnapshot,
} from 'firebase/database';
import type { Mock } from 'vitest';

import type { Action } from '#/store/types.ts';
import api from './firebaseApi.ts';

const mock = vi.hoisted(() => ({
  auth: { currentUser: null as { uid: string; email: string } | null },
  stops: [] as Mock<() => void>[],
  pushKey: 'new-id' as string | null,
}));

vi.mock('firebase/app', () => ({ initializeApp: vi.fn<() => string>(() => 'app') }));
vi.mock('firebase/auth', () => ({
  getAuth: vi.fn<() => typeof mock.auth>(() => mock.auth),
  onAuthStateChanged: vi.fn<() => string>(() => 'unsubscribe'),
  signInWithEmailAndPassword: vi.fn<() => Promise<string>>(() => Promise.resolve('signed-in')),
  sendPasswordResetEmail: vi.fn<() => Promise<void>>(() => Promise.resolve()),
  signOut: vi.fn<() => Promise<void>>(() => Promise.resolve()),
  EmailAuthProvider: { credential: vi.fn<() => string>(() => 'credential') },
  reauthenticateWithCredential: vi.fn<() => Promise<void>>(() => Promise.resolve()),
  updatePassword: vi.fn<() => Promise<void>>(() => Promise.resolve()),
}));
vi.mock('firebase/database', () => {
  const mockListener = () =>
    vi.fn<() => Mock<() => void>>(() => {
      const stop = vi.fn<() => void>();
      mock.stops.push(stop);
      return stop;
    });
  return {
    getDatabase: vi.fn<() => string>(() => 'database'),
    ref: vi.fn<(database: unknown, path: string) => { path: string }>((_database, path) => ({
      path,
    })),
    push: vi.fn<() => { key: string | null }>(() => ({ key: mock.pushKey })),
    set: vi.fn<() => Promise<void>>(() => Promise.resolve()),
    remove: vi.fn<() => Promise<void>>(() => Promise.resolve()),
    get: vi.fn<() => Promise<unknown>>(),
    query: vi.fn<(target: object, ...constraints: object[]) => object>(
      (target, ...constraints) => ({
        ...target,
        constraints,
      }),
    ),
    orderByChild: vi.fn<(child: string) => object>((child) => ({ orderByChild: child })),
    startAt: vi.fn<(value: number) => object>((value) => ({ startAt: value })),
    endAt: vi.fn<(value: number) => object>((value) => ({ endAt: value })),
    onChildAdded: mockListener(),
    onChildChanged: mockListener(),
    onChildRemoved: mockListener(),
    onValue: mockListener(),
  };
});

// the app is initialised when firebaseApi is imported; mock call history is cleared before each test
const initializeAppCalls = vi.mocked(initializeApp).mock.calls.length;
const snapshot = (value: unknown, key?: string) =>
  ({ val: () => value, key }) as unknown as DataSnapshot;
const signedIn = 'signed-in' as unknown as UserCredential;
const me = 'userIntervals/me';
const paths = () => new Set(vi.mocked(ref).mock.calls.map(([, path]) => path));

describe('firebaseApi', () => {
  beforeEach(() => {
    vi.spyOn(Date, 'now').mockReturnValue(9999);
    mock.auth.currentUser = { uid: 'me', email: 'me@example.com' };
    mock.stops.length = 0;
    mock.pushKey = 'new-id';
  });

  afterEach(() => vi.restoreAllMocks());

  test('initialises firebase once', () => {
    expect(initializeAppCalls).toBe(1);
  });

  describe('auth', () => {
    test('login, logout and password reset delegate to firebase auth', async () => {
      await expect(api.login('a@b.c', 'pw')).resolves.toBe(signedIn);
      expect(vi.mocked(signInWithEmailAndPassword)).toHaveBeenCalledWith(mock.auth, 'a@b.c', 'pw');

      await api.sendPasswordResetEmail('a@b.c');
      expect(vi.mocked(sendPasswordResetEmail)).toHaveBeenCalledWith(mock.auth, 'a@b.c');

      await api.logout();
      expect(vi.mocked(signOut)).toHaveBeenCalledWith(mock.auth);
    });

    test('onAuthStateChanged listens to the auth state and returns the stop function', () => {
      const callback = vi.fn<(user: User | null) => void>();

      expect(api.onAuthStateChanged(callback)).toBe('unsubscribe');
      expect(vi.mocked(onAuthStateChanged)).toHaveBeenCalledWith(mock.auth, callback);
    });

    test('getCurrentUserId returns the uid', () => {
      expect(api.getCurrentUserId()).toBe('me');
    });
  });

  describe('subscribe / emit', () => {
    test('emit calls every subscriber with the action', () => {
      const a = vi.fn<(action: Action) => void>();
      const b = vi.fn<(action: Action) => void>();
      api.subscribe(a);
      api.subscribe(b);

      api.emit({ type: '@@INIT' });

      expect(a).toHaveBeenCalledWith({ type: '@@INIT' });
      expect(b).toHaveBeenCalledWith({ type: '@@INIT' });
    });
  });

  describe('writes (always under the signed-in user)', () => {
    test('createInterval fails when the database gives no id', async () => {
      mock.pushKey = null;

      await expect(api.createInterval({ startTime: 1 })).rejects.toThrow('Could not create');
      expect(vi.mocked(set)).not.toHaveBeenCalled();
    });

    test('createInterval writes userIntervals/<uid>/<new id> with createdAt and updatedAt, no user field', async () => {
      const result = await api.createInterval({ startTime: 1, note: 'n' });

      expect(vi.mocked(push)).toHaveBeenCalledWith({ path: me });
      expect(vi.mocked(set)).toHaveBeenCalledWith(
        { path: `${me}/new-id` },
        { startTime: 1, note: 'n', createdAt: 9999, updatedAt: 9999 },
      );
      expect(result).toEqual({ startTime: 1, note: 'n', createdAt: 9999, id: 'new-id' });
    });

    test('updateInterval sets updatedAt and resolves without it', async () => {
      const result = await api.updateInterval({ id: 'i1', startTime: 5, createdAt: 1 });

      expect(vi.mocked(set)).toHaveBeenCalledWith(
        { path: `${me}/i1` },
        { startTime: 5, createdAt: 1, updatedAt: 9999 },
      );
      expect(result).toEqual({ id: 'i1', startTime: 5, createdAt: 1 });
    });

    test('removeInterval removes the interval of the user', async () => {
      await api.removeInterval('i1');
      expect(vi.mocked(remove)).toHaveBeenCalledWith({ path: `${me}/i1` });
    });

    test('saveUserData writes to users/{id}', async () => {
      await api.saveUserData('u1', { hoursInWeek: 30 });
      expect(vi.mocked(set)).toHaveBeenCalledWith({ path: 'users/u1' }, { hoursInWeek: 30 });
    });

    test('rejects (without touching the database) when nobody is signed in', async () => {
      mock.auth.currentUser = null;

      await expect(api.createInterval({ startTime: 1 })).rejects.toThrow('Not signed in');
      await expect(api.updateInterval({ id: 'i1', startTime: 1, createdAt: 1 })).rejects.toThrow(
        'Not signed in',
      );
      await expect(api.removeInterval('i1')).rejects.toThrow('Not signed in');
      await expect(api.fetchIntervalsForUser()).rejects.toThrow('Not signed in');
      expect(vi.mocked(ref)).not.toHaveBeenCalled();
    });
  });

  describe('fetching (only ever reads the signed-in users own path)', () => {
    const data = { a: { startTime: 1 }, b: { startTime: 2 } };

    test('fetchIntervalsForUser returns the users intervals ordered by startTime', async () => {
      vi.mocked(get).mockResolvedValue(snapshot(data));

      await expect(api.fetchIntervalsForUser()).resolves.toEqual(data);
      expect(vi.mocked(get)).toHaveBeenCalledWith({
        path: me,
        constraints: [{ orderByChild: 'startTime' }],
      });
    });

    test('fetchIntervalsInWeek queries the week range', async () => {
      vi.mocked(get).mockResolvedValue(snapshot(data));

      await expect(api.fetchIntervalsInWeek(new Date(2021, 3, 7, 12).getTime())).resolves.toEqual(
        data,
      );
      expect(vi.mocked(get)).toHaveBeenCalledWith({
        path: me,
        constraints: [
          { orderByChild: 'startTime' },
          { startAt: +new Date(2021, 3, 5) },
          { endAt: +new Date(2021, 3, 12) },
        ],
      });
    });

    test('a user without intervals gets an empty object', async () => {
      vi.mocked(get).mockResolvedValue(snapshot(null));

      await expect(api.fetchIntervalsForUser()).resolves.toEqual({});
      await expect(api.fetchIntervalsInWeek(Date.UTC(2021, 3, 7))).resolves.toEqual({});
    });

    test('never reads the shared intervals node or another users path', async () => {
      vi.mocked(get).mockResolvedValue(snapshot(data));

      await api.fetchIntervalsForUser();
      await api.fetchIntervalsInWeek();

      expect([...paths()]).toEqual([me]);
    });
  });

  describe('updateUserPassword', () => {
    test('reauthenticates before changing the password', async () => {
      const calls: string[] = [];
      vi.mocked(reauthenticateWithCredential).mockImplementationOnce(() => {
        calls.push('reauth');
        return Promise.resolve(signedIn);
      });
      vi.mocked(updatePassword).mockImplementationOnce(() => {
        calls.push('update');
        return Promise.resolve();
      });

      await api.updateUserPassword('old', 'new');

      expect(vi.mocked(EmailAuthProvider.credential)).toHaveBeenCalledWith('me@example.com', 'old');
      expect(vi.mocked(reauthenticateWithCredential)).toHaveBeenCalledWith(
        mock.auth.currentUser,
        'credential',
      );
      expect(vi.mocked(updatePassword)).toHaveBeenCalledWith(mock.auth.currentUser, 'new');
      expect(calls).toEqual(['reauth', 'update']);
    });
  });

  describe('listen', () => {
    const actions: Parameters<typeof api.listen>[0] = {
      intervalAdded: (interval) => ({ type: 'INTERVAL_ADD', interval }),
      intervalUpdated: (interval) => ({ type: 'INTERVAL_UPDATED', interval }),
      intervalRemoved: (id) => ({ type: 'INTERVAL_REMOVE', id }),
      settingsChanged: (settings) => ({ type: 'USER_UPDATE_SETTINGS', settings }),
    };

    test('emits actions for added, changed and removed intervals of the user', () => {
      const emitted: Action[] = [];
      api.subscribe((action) => emitted.push(action));

      api.listen(actions);
      const [[, added]] = vi.mocked(onChildAdded).mock.calls;
      const [[, changed]] = vi.mocked(onChildChanged).mock.calls;
      const [[, removed]] = vi.mocked(onChildRemoved).mock.calls;
      added(snapshot({ startTime: 1, createdAt: 1 }, 'a1'), null);
      changed(snapshot({ startTime: 2, createdAt: 1 }, 'c1'), null);
      removed(snapshot(null, 'r1'));

      expect(emitted).toEqual([
        { type: 'INTERVAL_ADD', interval: { startTime: 1, createdAt: 1, id: 'a1' } },
        { type: 'INTERVAL_UPDATED', interval: { startTime: 2, createdAt: 1, id: 'c1' } },
        { type: 'INTERVAL_REMOVE', id: 'r1' },
      ]);
    });

    test('ignores intervals and settings that do not match the schema', () => {
      const emitted: Action[] = [];
      api.subscribe((action) => emitted.push(action));

      api.listen(actions);
      const [[, added]] = vi.mocked(onChildAdded).mock.calls;
      const [[, changed]] = vi.mocked(onValue).mock.calls;
      added(snapshot({ startTime: 'x', createdAt: 1 }, 'a1'), null);
      added(snapshot({ createdAt: 1, startTime: 1, user: 'u' }, 'a2'), null);
      changed(snapshot({ hoursInWeek: 'many' }, 'me'));

      expect(emitted).toEqual([]);
    });

    test('emits the settings of the user, also when they are missing', () => {
      const emitted: Action[] = [];
      api.subscribe((action) => emitted.push(action));

      api.listen(actions);
      const [[, changed]] = vi.mocked(onValue).mock.calls;
      changed(snapshot({ hoursInWeek: 20 }, 'me'));
      changed(snapshot(null, 'me'));

      expect(emitted).toEqual([
        { type: 'USER_UPDATE_SETTINGS', settings: { hoursInWeek: 20 } },
        { type: 'USER_UPDATE_SETTINGS', settings: null },
      ]);
    });

    test('only listens on the users own paths, and only for new intervals when added', () => {
      api.listen(actions);

      expect([...paths()].sort()).toEqual(['userIntervals/me', 'users/me']);
      expect(vi.mocked(onValue)).toHaveBeenCalledWith({ path: 'users/me' }, expect.any(Function));
      expect(vi.mocked(onChildAdded)).toHaveBeenCalledWith(
        { path: me, constraints: [{ orderByChild: 'startTime' }, { startAt: 9999 }] },
        expect.any(Function),
      );
      expect(vi.mocked(onChildChanged)).toHaveBeenCalledWith({ path: me }, expect.any(Function));
      expect(vi.mocked(onChildRemoved)).toHaveBeenCalledWith({ path: me }, expect.any(Function));
    });

    test('returns a function that stops all four listeners', () => {
      const stop = api.listen(actions);
      expect(mock.stops).toHaveLength(4);

      stop();

      mock.stops.forEach((stopListener) => expect(stopListener).toHaveBeenCalledTimes(1));
    });

    test('does nothing when nobody is signed in', () => {
      mock.auth.currentUser = null;

      const stop = api.listen(actions);

      expect(vi.mocked(ref)).not.toHaveBeenCalled();
      expect(() => stop()).not.toThrow();
    });
  });
});
