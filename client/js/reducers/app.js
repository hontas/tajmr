const initialState = {
  initialized: false
};

const firebaseInit = 'firebase/INITIALIZED';

export function initialized() {
  return { type: firebaseInit };
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case firebaseInit: return {
      ...state,
      initialized: true
    };
    default: return state;
  }
}
