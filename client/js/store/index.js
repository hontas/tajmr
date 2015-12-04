import { createStore } from 'redux';
import reducers from '../reducers';
import localStorage from '../utils/localStorage';

const version = '0.1.0';
const initialState = localStorage.get(version);
const store = createStore(reducers, initialState);

store.subscribe(() => {
  localStorage.set(version, store.getState());
});

export default store;
