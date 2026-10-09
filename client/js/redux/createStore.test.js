import createStore from './createStore';
import { initialized } from './app';
import { userLoggedIn } from './user';

describe('createStore', () => {
  test('starts with the default state of every slice', () => {
    const state = createStore().getState();

    expect(state.app).toEqual({ initialized: false });
    expect(state.user).toBeNull();
    expect(state.intervals.items).toEqual([]);
    expect(state.userSettings.hoursInWeek).toBe(40);
  });

  test('dispatch runs the reducers and notifies the listeners', () => {
    const store = createStore();
    const listener = vi.fn();
    store.subscribe(listener);

    store.dispatch(initialized());

    expect(store.getState().app.initialized).toBe(true);
    expect(listener).toHaveBeenCalledTimes(1);
  });

  test('an unsubscribed listener is not called', () => {
    const store = createStore();
    const listener = vi.fn();
    const unsubscribe = store.subscribe(listener);
    unsubscribe();

    store.dispatch(initialized());

    expect(listener).not.toHaveBeenCalled();
  });

  test('slices that did not change keep their identity', () => {
    const store = createStore();
    const { intervals } = store.getState();

    store.dispatch(userLoggedIn({ uid: 'u1' }));

    expect(store.getState().intervals).toBe(intervals);
    expect(store.getState().user).toEqual({ uid: 'u1' });
  });

  test('an action that changes nothing keeps the whole state', () => {
    const store = createStore();
    const state = store.getState();

    store.dispatch({ type: 'UNKNOWN' });

    expect(store.getState()).toBe(state);
  });

  test('a function is called with dispatch and getState, and its result is returned', async () => {
    const store = createStore();

    const result = await store.dispatch((dispatch, getState) => {
      dispatch(initialized());
      return Promise.resolve(getState().app.initialized);
    });

    expect(result).toBe(true);
  });
});
