import firebase from 'firebase/app';

import api from './firebaseApi';

// `jest.mock` factories may only reference variables prefixed with `mock`.
jest.mock('firebase/app', () => {
  const mockQuery = {};
  ['orderByChild', 'startAt', 'endAt'].forEach((method) => {
    mockQuery[method] = jest.fn(() => mockQuery);
  });
  mockQuery.once = jest.fn();
  mockQuery.on = jest.fn();

  const mockRefs = {};
  const mockRef = (path) => {
    if (!mockRefs[path]) {
      mockRefs[path] = { set: jest.fn(() => Promise.resolve()), remove: jest.fn(() => Promise.resolve()), once: jest.fn() };
    }
    return mockRefs[path];
  };
  const mockRoot = {
    child: jest.fn(() => Object.assign(mockQuery, { push: jest.fn(() => ({ key: 'new-id' })) })),
  };
  const mockAuth = {
    currentUser: { uid: 'me', email: 'me@example.com' },
    signInWithEmailAndPassword: jest.fn(() => Promise.resolve('signed-in')),
    sendPasswordResetEmail: jest.fn(() => Promise.resolve()),
    signOut: jest.fn(() => Promise.resolve()),
  };
  const mockDatabase = { ref: jest.fn((path) => (path ? mockRef(path) : mockRoot)) };

  const mockFirebase = {
    initializeApp: jest.fn(),
    database: jest.fn(() => mockDatabase),
    auth: Object.assign(
      jest.fn(() => mockAuth),
      { EmailAuthProvider: { credential: jest.fn(() => 'credential') } }
    ),
    mockHandles: { query: mockQuery, refs: mockRefs, auth: mockAuth, database: mockDatabase },
  };
  return { __esModule: true, default: mockFirebase };
});
jest.mock('firebase/auth', () => ({}));
jest.mock('firebase/database', () => ({}));

const { query, refs, auth } = firebase.mockHandles;
const snapshot = (value) => ({ val: () => value });

describe('firebaseApi', () => {
  beforeEach(() => {
    jest.spyOn(Date, 'now').mockReturnValue(9999);
    query.once.mockReset();
  });

  afterEach(() => jest.restoreAllMocks());

  test('initialises firebase once', () => {
    expect(firebase.initializeApp).toHaveBeenCalledTimes(1);
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
      const a = jest.fn();
      const b = jest.fn();
      api.subscribe(a);
      api.subscribe(b);

      api.emit({ type: 'X' });

      expect(a).toHaveBeenCalledWith({ type: 'X' });
      expect(b).toHaveBeenCalledWith({ type: 'X' });
    });
  });

  describe('writes', () => {
    test('createInterval writes under a generated id with user and createdAt', async () => {
      const result = await api.createInterval({ startTime: 1, note: 'n' });

      expect(refs['intervals/new-id'].set).toHaveBeenCalledWith({
        startTime: 1,
        note: 'n',
        user: 'me',
        createdAt: 9999,
        updatedAt: 9999,
      });
      expect(result).toEqual({ startTime: 1, note: 'n', user: 'me', createdAt: 9999, id: 'new-id' });
    });

    test('updateInterval sets updatedAt and resolves without it', async () => {
      const result = await api.updateInterval({ id: 'i1', startTime: 5 });

      expect(refs['intervals/i1'].set).toHaveBeenCalledWith({ startTime: 5, updatedAt: 9999 });
      expect(result).toEqual({ id: 'i1', startTime: 5 });
    });

    test('removeInterval removes the path', async () => {
      await api.removeInterval('i1');
      expect(refs['intervals/i1'].remove).toHaveBeenCalled();
    });

    test('saveUserData writes to users/{id}', async () => {
      await api.saveUserData('u1', { hoursInWeek: 30 });
      expect(refs['users/u1'].set).toHaveBeenCalledWith({ hoursInWeek: 30 });
    });
  });

  describe('fetching', () => {
    const data = {
      mine: { user: 'me', startTime: 1 },
      theirs: { user: 'someone-else', startTime: 2 },
    };

    test('fetchIntervalsForUser keeps only the current user intervals', async () => {
      query.once.mockResolvedValue(snapshot(data));

      await expect(api.fetchIntervalsForUser()).resolves.toEqual({
        mine: { user: 'me', startTime: 1 },
      });
      expect(query.orderByChild).toHaveBeenCalledWith('startTime');
    });

    test('fetchIntervalsInWeek queries a week range and filters by user', async () => {
      query.once.mockResolvedValue(snapshot(data));

      await expect(api.fetchIntervalsInWeek(Date.UTC(2021, 3, 7))).resolves.toEqual({
        mine: { user: 'me', startTime: 1 },
      });
      expect(query.startAt).toHaveBeenCalled();
      expect(query.endAt).toHaveBeenCalled();
    });

    // BUG (see issue #11): a user without intervals gets `null` from firebase and
    // `Object.keys(null)` throws.
    test('BUG: fetchIntervalsForUser rejects when the user has no intervals', async () => {
      query.once.mockResolvedValue(snapshot(null));

      await expect(api.fetchIntervalsForUser()).rejects.toThrow(TypeError);
    });

    test('getUserSettings reads users/{uid}', async () => {
      const snap = snapshot({ hoursInWeek: 20 });
      refs['users/me'] = { once: jest.fn(() => Promise.resolve(snap)) };

      await expect(api.getUserSettings({ uid: 'me' })).resolves.toBe(snap);
    });
  });

  describe('updateUserPassword', () => {
    test('reauthenticates before changing the password', async () => {
      const calls = [];
      auth.currentUser.reauthenticateWithCredential = jest.fn(() => {
        calls.push('reauth');
        return Promise.resolve();
      });
      auth.currentUser.updatePassword = jest.fn(() => {
        calls.push('update');
        return Promise.resolve();
      });

      await api.updateUserPassword('old', 'new');

      expect(firebase.auth.EmailAuthProvider.credential).toHaveBeenCalledWith('me@example.com', 'old');
      expect(auth.currentUser.reauthenticateWithCredential).toHaveBeenCalledWith('credential');
      expect(auth.currentUser.updatePassword).toHaveBeenCalledWith('new');
      expect(calls).toEqual(['reauth', 'update']);
    });
  });

  describe('init listeners', () => {
    let logSpy;
    beforeEach(() => {
      logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
      query.on.mockReset();
    });
    afterEach(() => logSpy.mockRestore());

    const handlers = () =>
      Object.fromEntries(query.on.mock.calls.map(([event, handler]) => [event, handler]));
    const snap = (key, value) => ({ key, val: () => value });

    test('emits actions for added (own only), changed and removed intervals', () => {
      const emitted = [];
      api.subscribe((action) => emitted.push(action));
      const actions = {
        intervalAdded: (i) => ({ type: 'added', i }),
        intervalUpdated: (i) => ({ type: 'updated', i }),
        intervalRemoved: (id) => ({ type: 'removed', id }),
      };

      api.init(actions);
      const { child_added: added, child_changed: changed, child_removed: removed } = handlers();

      added(snap('a1', { user: 'me', startTime: 1 }));
      added(snap('a2', { user: 'other', startTime: 1 }));
      changed(snap('c1', { user: 'me' }));
      removed(snap('r1'));

      expect(emitted).toEqual([
        { type: 'added', i: { user: 'me', startTime: 1, id: 'a1' } },
        { type: 'updated', i: { user: 'me', id: 'c1' } },
        { type: 'removed', id: 'r1' },
      ]);
    });

    // BUG (see issue #14): changed/removed events are emitted for every user's intervals.
    test('BUG: child_changed is emitted even for other users intervals', () => {
      const emitted = [];
      api.subscribe((action) => emitted.push(action));
      api.init({
        intervalAdded: jest.fn(),
        intervalUpdated: (i) => ({ type: 'updated', i }),
        intervalRemoved: jest.fn(),
      });

      handlers().child_changed(snap('x', { user: 'other' }));

      expect(emitted).toContainEqual({ type: 'updated', i: { user: 'other', id: 'x' } });
    });
  });
});
