import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import reducers from '../reducers';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose; // eslint-disable-line
const composed = composeEnhancers(applyMiddleware(thunkMiddleware));

const initialState = {};
const store = createStore(reducers, initialState, composed);

export default store;
