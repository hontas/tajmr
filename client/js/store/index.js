import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import reducers from '../reducers';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const initialState = {};
const store = createStore(reducers, initialState, composeEnhancers(
  applyMiddleware(thunkMiddleware)
));

export default store;
