import { createContext, use, useSyncExternalStore, type ReactNode } from 'react';

import type { RootState, Store } from './types.ts';

const StoreContext = createContext<Store | null>(null);

function useStore() {
  const store = use(StoreContext);
  if (!store) throw new Error('useStore must be used inside a StoreProvider');
  return store;
}

export function StoreProvider({ store, children }: { store: Store; children: ReactNode }) {
  return <StoreContext value={store}>{children}</StoreContext>;
}

export function useDispatch() {
  return useStore().dispatch;
}

// the selector must return a part of the state, not a new array or object, or React re-renders forever
export function useSelector<Selected>(selector: (state: RootState) => Selected): Selected {
  const { subscribe, getState } = useStore();
  return useSyncExternalStore(subscribe, () => selector(getState()));
}
