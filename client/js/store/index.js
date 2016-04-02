import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import reducers from '../reducers';
//import localStorage from '../utils/localStorage';

//const version = '0.1.0';
//localStorage.get(version);
const initialState = {};
const store = createStore(reducers, initialState, compose(
  applyMiddleware(thunkMiddleware, createLogger()),
  window.devToolsExtension ? window.devToolsExtension() : (f) => f
));

// store.subscribe(() => {
//   localStorage.set(version, store.getState());
// });

export default store;
