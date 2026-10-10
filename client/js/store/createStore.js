import rootReducer from './rootReducer';

export default function createStore(initialState = {}) {
  let state = rootReducer(initialState, { type: 'INIT' });
  const listeners = new Set();

  const store = {
    getState: () => state,
    dispatch(action) {
      if (typeof action === 'function') return action(store.dispatch, store.getState);
      state = rootReducer(state, action);
      listeners.forEach((listener) => listener());
      return action;
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };

  return store;
}
