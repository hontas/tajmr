import * as Sentry from '@sentry/react';
import reducer, {
  intervalAdded,
  intervalUpdated,
  intervalRemoved,
  intervalsFetched,
  intervalUpdateFailed,
  requestIntervals,
  requestIntervalUpdate,
  updateTimestamp,
  reset,
  attemptUpdate,
  attemptRemove,
  fetchIntervalsForUser,
} from './intervals';
import createStore from './createStore';
import firebaseApi from '../utils/firebaseApi';

vi.mock('@sentry/react', () => ({ captureException: vi.fn(), captureMessage: vi.fn() }));
vi.mock('../utils/firebaseApi', () => ({
  __esModule: true,
  default: {
    createInterval: vi.fn(),
    updateInterval: vi.fn(),
    removeInterval: vi.fn(),
    fetchIntervalsForUser: vi.fn(),
  },
}));

const validNew = { startTime: 1000, endTime: 2000, note: 'work' };
const saved = { createdAt: 1, startTime: 1000 };

describe('intervals reducer', () => {
  beforeEach(() => vi.spyOn(Date, 'now').mockReturnValue(5000));
  afterEach(() => vi.restoreAllMocks());

  const initial = () => reducer(undefined, { type: '@@INIT' });

  test('initial state is fetching with no items', () => {
    expect(initial()).toMatchObject({ isFetching: true, isSaving: false, items: [], error: '' });
  });

  test('INTERVALS_REQUEST sets isFetching', () => {
    const state = reducer({ ...initial(), isFetching: false }, requestIntervals());
    expect(state).toMatchObject({ isFetching: true, updatedAt: 5000 });
  });

  test('INTERVALS_FETCHED maps an id keyed object to a list with ids', () => {
    const state = reducer(
      initial(),
      intervalsFetched({ a: { startTime: 1 }, b: { startTime: 2 } }),
    );
    expect(state.isFetching).toBe(false);
    expect(state.items).toEqual([
      { id: 'a', startTime: 1 },
      { id: 'b', startTime: 2 },
    ]);
  });

  test('REQUEST_INTERVAL_UPDATE sets isSaving', () => {
    expect(reducer(initial(), requestIntervalUpdate()).isSaving).toBe(true);
  });

  test('INTERVAL_ADD appends the interval', () => {
    const state = reducer(
      { ...initial(), isSaving: true, items: [{ id: 'a' }] },
      intervalAdded({ id: 'b' }),
    );
    expect(state.items).toEqual([{ id: 'a' }, { id: 'b' }]);
    expect(state.isSaving).toBe(false);
  });

  // The thunk's success handler and the Firebase listener can both report the same interval.
  test('INTERVAL_ADD with an existing id replaces it instead of duplicating', () => {
    const state = reducer(
      { ...initial(), items: [{ id: 'a', note: 'old' }] },
      intervalAdded({ id: 'a', note: 'new' }),
    );
    expect(state.items).toEqual([{ id: 'a', note: 'new' }]);
  });

  test('INTERVAL_UPDATED replaces the item with the same id (moved last)', () => {
    const state = reducer(
      { ...initial(), items: [{ id: 'a', note: 'old' }, { id: 'b' }] },
      intervalUpdated({ id: 'a', note: 'new' }),
    );
    expect(state.items).toEqual([{ id: 'b' }, { id: 'a', note: 'new' }]);
    expect(state.isSaving).toBe(false);
  });

  test('INTERVAL_UPDATED for an unknown id adds it', () => {
    const state = reducer(initial(), intervalUpdated({ id: 'z' }));
    expect(state.items).toEqual([{ id: 'z' }]);
  });

  test('INTERVAL_REMOVE removes by id', () => {
    const state = reducer(
      { ...initial(), items: [{ id: 'a' }, { id: 'b' }] },
      intervalRemoved('a'),
    );
    expect(state.items).toEqual([{ id: 'b' }]);
  });

  test('INTERVAL_UPDATE_FAILED stores the error and stops saving', () => {
    const state = reducer({ ...initial(), isSaving: true }, intervalUpdateFailed('boom'));
    expect(state).toMatchObject({ error: 'boom', isSaving: false });
  });

  test('INTERVALS_UPDATE_TIMESTAMP sets timestamp', () => {
    expect(reducer(initial(), updateTimestamp(42)).timestamp).toBe(42);
  });

  test('RESET_STATE clears items and stops fetching', () => {
    const state = reducer({ ...initial(), items: [{ id: 'a' }] }, reset());
    expect(state).toMatchObject({ items: [], isFetching: false, updatedAt: 5000 });
  });

  test('unknown actions return the same state', () => {
    const state = initial();
    expect(reducer(state, { type: 'nope' })).toBe(state);
  });
});

describe('intervals thunks', () => {
  let store;
  let logSpy;

  beforeEach(() => {
    store = createStore();
    logSpy = vi.spyOn(console, 'log');
    vi.clearAllMocks();
  });

  afterEach(() => {
    // interval contents must never end up in the console
    expect(logSpy).not.toHaveBeenCalled();
    logSpy.mockRestore();
  });

  const items = () => store.getState().intervals.items;

  describe('attemptUpdate', () => {
    test('creates a new interval via firebase when there is no id', async () => {
      firebaseApi.createInterval.mockResolvedValue({ ...validNew, id: 'n1' });

      await store.dispatch(attemptUpdate(validNew));

      expect(firebaseApi.createInterval).toHaveBeenCalledWith(validNew);
      expect(items()).toEqual([{ ...validNew, id: 'n1' }]);
      expect(store.getState().intervals.isSaving).toBe(false);
    });

    test('rejects and stores the error for an invalid new interval', async () => {
      await expect(store.dispatch(attemptUpdate({ note: 'no start' }))).rejects.toMatch(
        /Missing required properties/,
      );

      expect(firebaseApi.createInterval).not.toHaveBeenCalled();
      expect(store.getState().intervals.error).toMatch(/Missing required properties/);
    });

    test('updates an existing interval via firebase', async () => {
      const existing = { ...saved, id: 'e1', note: 'changed' };
      firebaseApi.updateInterval.mockResolvedValue(existing);

      await store.dispatch(attemptUpdate(existing));

      expect(firebaseApi.updateInterval).toHaveBeenCalledWith(existing);
      expect(items()).toEqual([existing]);
    });

    test('rejects an invalid existing interval', async () => {
      await expect(store.dispatch(attemptUpdate({ id: 'e1', startTime: 1 }))).rejects.toMatch(
        /Missing required properties/,
      );
      expect(firebaseApi.updateInterval).not.toHaveBeenCalled();
    });

    test('stores the error when firebase fails', async () => {
      firebaseApi.createInterval.mockRejectedValue('permission denied');

      await store.dispatch(attemptUpdate(validNew));

      expect(store.getState().intervals.error).toBe('permission denied');
      expect(store.getState().intervals.isSaving).toBe(false);
    });
  });

  describe('attemptRemove', () => {
    test('removes the interval after firebase succeeds', async () => {
      store.dispatch(intervalAdded({ id: 'a' }));
      store.dispatch(intervalAdded({ id: 'b' }));
      firebaseApi.removeInterval.mockResolvedValue();

      store.dispatch(attemptRemove('a'));
      await new Promise((resolve) => setImmediate(resolve));

      expect(firebaseApi.removeInterval).toHaveBeenCalledWith('a');
      expect(items()).toEqual([{ id: 'b' }]);
    });

    test('keeps the interval and stores an error when firebase fails', async () => {
      store.dispatch(intervalAdded({ id: 'a' }));
      firebaseApi.removeInterval.mockRejectedValue('nope');

      store.dispatch(attemptRemove('a'));
      await new Promise((resolve) => setImmediate(resolve));

      expect(items()).toEqual([{ id: 'a' }]);
      expect(store.getState().intervals.error).toMatch(/Could not remove interval with id: a/);
    });
  });

  describe('fetchIntervalsForUser', () => {
    test('stores only valid intervals', async () => {
      firebaseApi.fetchIntervalsForUser.mockResolvedValue({
        good: { ...saved },
        bad: { startTime: 'not a number' },
      });

      await store.dispatch(fetchIntervalsForUser());

      expect(items()).toEqual([{ ...saved, id: 'good' }]);
      expect(store.getState().intervals.isFetching).toBe(false);
    });

    test('reports ignored invalid intervals to Sentry by id only', async () => {
      firebaseApi.fetchIntervalsForUser.mockResolvedValue({
        good: { ...saved },
        bad: { startTime: 'not a number', note: 'secret note' },
      });

      await store.dispatch(fetchIntervalsForUser());

      expect(Sentry.captureMessage).toHaveBeenCalledTimes(1);
      const [message] = Sentry.captureMessage.mock.calls[0];
      expect(message).toContain('bad');
      expect(message).not.toContain('secret note');
    });

    test('does not report to Sentry when all intervals are valid', async () => {
      firebaseApi.fetchIntervalsForUser.mockResolvedValue({ good: { ...saved } });

      await store.dispatch(fetchIntervalsForUser());

      expect(Sentry.captureMessage).not.toHaveBeenCalled();
    });

    test('falls back to an empty list when the fetch fails', async () => {
      const error = new Error('offline');
      firebaseApi.fetchIntervalsForUser.mockRejectedValue(error);

      await store.dispatch(fetchIntervalsForUser());

      expect(Sentry.captureException).toHaveBeenCalledWith(error);
      expect(items()).toEqual([]);
      expect(store.getState().intervals.isFetching).toBe(false);
    });
  });
});
