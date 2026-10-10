import type { Action } from './types.ts';

export interface AppState {
  initialized: boolean;
}

export interface AppAction {
  type: typeof firebaseInit;
}

const initialState: AppState = {
  initialized: false,
};

const firebaseInit = 'firebase/INITIALIZED';

export function initialized(): AppAction {
  return { type: firebaseInit };
}

export default function reducer(state = initialState, action: Action): AppState {
  switch (action.type) {
    case firebaseInit:
      return {
        ...state,
        initialized: true,
      };
    default:
      return state;
  }
}
