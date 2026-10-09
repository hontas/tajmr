import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import reducers from '.';

// oxlint-disable-next-line no-underscore-dangle -- the Redux DevTools global
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const composed = composeEnhancers(applyMiddleware(thunkMiddleware));

export default function storeCreator(initialState = {}) {
  return createStore(reducers, initialState, composed);
}
