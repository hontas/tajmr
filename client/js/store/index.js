import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import reducers from '../reducers';
//import localStorage from '../utils/localStorage';

//const version = '0.1.0';
//localStorage.get(version);
const initialState = {};
const store = createStore(
  reducers,
  initialState,
  applyMiddleware(thunkMiddleware, createLogger())
);

// store.subscribe(() => {
//   localStorage.set(version, store.getState());
// });

export default store;
