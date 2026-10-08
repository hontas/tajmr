import firebase from 'firebase/app';

import api from './firebaseApi';

// `vi.mock` factories may only reference variables prefixed with `mock`.
vi.mock('firebase/app', () => {
  const mockNodes = {};
  const mockNode = (path) => {
    if (!mockNodes[path]) {
      const node = {
        set: vi.fn(() => Promise.resolve()),
        remove: vi.fn(() => Promise.resolve()),
        once: vi.fn(),
        on: vi.fn((event, handler) => handler), // like firebase, returns the callback
        off: vi.fn(),
        push: vi.fn(() => ({ key: 'new-id' })),
      };
      ['orderByChild', 'startAt', 'endAt'].forEach((method) => {
        node[method] = vi.fn(() => node);
      });
      mockNodes[path] = node;
    }
    return mockNodes[path];
  };
  const mockAuth = {
    currentUser: { uid: 'me', email: 'me@example.com' },
    signInWithEmailAndPassword: vi.fn(() => Promise.resolve('signed-in')),
    sendPasswordResetEmail: vi.fn(() => Promise.resolve()),
    signOut: vi.fn(() => Promise.resolve()),
  };
  const mockDatabase = { ref: vi.fn((path) => mockNode(path)) };

  const mockFirebase = {
    initializeApp: vi.fn(),
    database: vi.fn(() => mockDatabase),
    auth: Object.assign(
      vi.fn(() => mockAuth),
      { EmailAuthProvider: { credential: vi.fn(() => 'credential') } },
    ),
    mockHandles: { nodes: mockNodes, node: mockNode, auth: mockAuth, database: mockDatabase },
  };
  return { __esModule: true, default: mockFirebase };
});
vi.mock('firebase/auth', () => ({}));
vi.mock('firebase/database', () => ({}));

// the app is initialised when firebaseApi is imported; mock call history is cleared before each test
const initializeAppCalls = firebase.initializeApp.mock.calls.length;
const { nodes, node, auth, database } = firebase.mockHandles;
const snapshot = (value, key) => ({ val: () => value, key });
const me = () => node('userIntervals/me');

describe('firebaseApi', () => {
  beforeEach(() => {
    vi.spyOn(Date, 'now').mockReturnValue(9999);
    Object.keys(nodes).forEach((path) => delete nodes[path]);
    auth.currentUser = { uid: 'me', email: 'me@example.com' };
  });

  afterEach(() => vi.restoreAllMocks());

  test('initialises firebase once', () => {
    expect(initializeAppCalls).toBe(1);
  });

  describe('auth', () => {
    test('login, logout and password reset delegate to firebase auth', async () => {
      await expect(api.login('a@b.c', 'pw')).resolves.toBe('signed-in');
      expect(auth.signInWithEmailAndPassword).toHaveBeenCalledWith('a@b.c', 'pw');

      await api.sendPasswordResetEmail('a@b.c');
      expect(auth.sendPasswordResetEmail).toHaveBeenCalledWith('a@b.c');

      await api.logout();
      expect(auth.signOut).toHaveBeenCalled();
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

      expect(node('userIntervals/me/new-id').set).toHaveBeenCalledWith({
        startTime: 1,
        note: 'n',
        createdAt: 9999,
        updatedAt: 9999,
      });
      expect(result).toEqual({ startTime: 1, note: 'n', createdAt: 9999, id: 'new-id' });
    });

    test('updateInterval sets updatedAt and resolves without it', async () => {
      const result = await api.updateInterval({ id: 'i1', startTime: 5 });

      expect(node('userIntervals/me/i1').set).toHaveBeenCalledWith({
        startTime: 5,
        updatedAt: 9999,
      });
      expect(result).toEqual({ id: 'i1', startTime: 5 });
    });

    test('removeInterval removes the interval of the user', async () => {
      await api.removeInterval('i1');
      expect(node('userIntervals/me/i1').remove).toHaveBeenCalled();
    });

    test('saveUserData writes to users/{id}', async () => {
      await api.saveUserData('u1', { hoursInWeek: 30 });
      expect(node('users/u1').set).toHaveBeenCalledWith({ hoursInWeek: 30 });
    });

    test('rejects (without touching the database) when nobody is signed in', async () => {
      auth.currentUser = null;

      await expect(api.createInterval({ startTime: 1 })).rejects.toThrow('Not signed in');
      await expect(api.updateInterval({ id: 'i1', startTime: 1 })).rejects.toThrow('Not signed in');
      await expect(api.removeInterval('i1')).rejects.toThrow('Not signed in');
      await expect(api.fetchIntervalsForUser()).rejects.toThrow('Not signed in');
      expect(Object.keys(nodes)).toEqual([]);
    });
  });

  describe('fetching (only ever reads the signed-in users own path)', () => {
    const data = { a: { startTime: 1 }, b: { startTime: 2 } };

    test('fetchIntervalsForUser returns the users intervals ordered by startTime', async () => {
      me().once.mockResolvedValue(snapshot(data));

      await expect(api.fetchIntervalsForUser()).resolves.toEqual(data);
      expect(me().orderByChild).toHaveBeenCalledWith('startTime');
    });

    test('fetchIntervalsInWeek queries the week range', async () => {
      me().once.mockResolvedValue(snapshot(data));

      await expect(api.fetchIntervalsInWeek(new Date(2021, 3, 7, 12).getTime())).resolves.toEqual(
        data,
      );
      expect(me().startAt).toHaveBeenCalledWith(+new Date(2021, 3, 5));
      expect(me().endAt).toHaveBeenCalledWith(+new Date(2021, 3, 12));
    });

    test('a user without intervals gets an empty object', async () => {
      me().once.mockResolvedValue(snapshot(null));

      await expect(api.fetchIntervalsForUser()).resolves.toEqual({});
      await expect(api.fetchIntervalsInWeek(Date.UTC(2021, 3, 7))).resolves.toEqual({});
    });

    test('never reads the shared intervals node or another users path', async () => {
      me().once.mockResolvedValue(snapshot(data));

      await api.fetchIntervalsForUser();
      await api.fetchIntervalsInWeek();

      expect(Object.keys(nodes)).toEqual(['userIntervals/me']);
      expect(database.ref).not.toHaveBeenCalledWith('intervals');
    });

    test('getUserSettings reads users/{uid}', async () => {
      const snap = snapshot({ hoursInWeek: 20 });
      node('users/me').once.mockResolvedValue(snap);

      await expect(api.getUserSettings({ uid: 'me' })).resolves.toBe(snap);
    });
  });

  describe('updateUserPassword', () => {
    test('reauthenticates before changing the password', async () => {
      const calls = [];
      auth.currentUser.reauthenticateWithCredential = vi.fn(() => {
        calls.push('reauth');
        return Promise.resolve();
      });
      auth.currentUser.updatePassword = vi.fn(() => {
        calls.push('update');
        return Promise.resolve();
      });

      await api.updateUserPassword('old', 'new');

      expect(firebase.auth.EmailAuthProvider.credential).toHaveBeenCalledWith(
        'me@example.com',
        'old',
      );
      expect(auth.currentUser.reauthenticateWithCredential).toHaveBeenCalledWith('credential');
      expect(auth.currentUser.updatePassword).toHaveBeenCalledWith('new');
      expect(calls).toEqual(['reauth', 'update']);
    });
  });

  describe('listen', () => {
    const actions = {
      intervalAdded: (i) => ({ type: 'added', i }),
      intervalUpdated: (i) => ({ type: 'updated', i }),
      intervalRemoved: (id) => ({ type: 'removed', id }),
    };
    const handlers = () =>
      Object.fromEntries(me().on.mock.calls.map(([event, handler]) => [event, handler]));

    test('emits actions for added, changed and removed intervals of the user', () => {
      const emitted = [];
      api.subscribe((action) => emitted.push(action));

      api.listen(actions);
      const { child_added: added, child_changed: changed, child_removed: removed } = handlers();
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

      expect(Object.keys(nodes)).toEqual(['userIntervals/me']);
      expect(me().orderByChild).toHaveBeenCalledWith('startTime');
      expect(me().startAt).toHaveBeenCalledWith(9999);
    });

    test('returns a function that detaches the same handlers', () => {
      const stop = api.listen(actions);
      const registered = Object.fromEntries(me().on.mock.calls);

      stop();

      expect(me().off).toHaveBeenCalledTimes(3);
      Object.entries(registered).forEach(([event, handler]) => {
        expect(me().off).toHaveBeenCalledWith(event, handler);
      });
    });

    test('does nothing when nobody is signed in', () => {
      auth.currentUser = null;

      const stop = api.listen(actions);

      expect(Object.keys(nodes)).toEqual([]);
      expect(() => stop()).not.toThrow();
    });
  });
});
