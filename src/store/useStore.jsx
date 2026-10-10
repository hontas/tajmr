import React, { createContext, useContext, useSyncExternalStore } from 'react';

const StoreContext = createContext(null);

export function StoreProvider({ store, children }) {
  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}

export function useDispatch() {
  return useContext(StoreContext).dispatch;
}

// the selector must return a part of the state, not a new array or object, or React re-renders forever
export function useSelector(selector) {
  const { subscribe, getState } = useContext(StoreContext);
  return useSyncExternalStore(subscribe, () => selector(getState()));
}
