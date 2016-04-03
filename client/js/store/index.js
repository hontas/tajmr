import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import reducers from '../reducers';

const initialState = {};
const store = createStore(reducers, initialState, compose(
  applyMiddleware(thunkMiddleware),
  window.devToolsExtension ? window.devToolsExtension() : (f) => f
));

export default store;
