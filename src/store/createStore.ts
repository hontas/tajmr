import rootReducer from './rootReducer.ts';
import type { Action, Dispatch, RootState, Store, Thunk } from './types.ts';

export default function createStore(initialState: Partial<RootState> = {}): Store {
  let state = rootReducer(initialState, { type: '@@INIT' });
  const listeners = new Set<() => void>();

  const dispatch = ((action: Action | Thunk<unknown>) => {
    if (typeof action === 'function') return action(dispatch, store.getState);
    state = rootReducer(state, action);
    listeners.forEach((listener) => listener());
    return action;
  }) as Dispatch;

  const store: Store = {
    getState: () => state,
    dispatch,
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };

  return store;
}
