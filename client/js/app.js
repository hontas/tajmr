/* eslint-disable react/jsx-filename-extension */
import 'core-js';
import 'regenerator-runtime/runtime';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import promiseFinally from 'promise.prototype.finally';

import '../styles/critical.styl';
import '../styles';
import firebaseApi from './utils/firebaseApi';
import createStore from './store';
import Application from './components/application/application.jsx';

promiseFinally.shim();

export const store = createStore(); // eslint-disable-line
firebaseApi.subscribe((action) => store.dispatch(action));
firebaseApi.init();

const App = () => (
  <Provider store={store}>
    <Application />
  </Provider>
);

if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line global-require
  const axe = require('react-axe');
  axe(React, ReactDOM, 1000);
  ReactDOM.render(<App />, document.getElementById('root'));
} else {
  ReactDOM.render(<App />, document.getElementById('root'));
}
