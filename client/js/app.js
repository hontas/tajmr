/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import promiseFinally from 'promise.prototype.finally';

import '../styles';
import '../styles/critical.styl';
import firebaseApi from './utils/firebaseApi';
import createStore from './store';
import Application from './components/application/application.jsx';

promiseFinally.shim();

export const store = createStore(); // eslint-disable-line
firebaseApi.subscribe((action) => store.dispatch(action));
firebaseApi.init();

ReactDOM.render(
  <Provider store={store}>
    <Application />
  </Provider>,
  document.getElementById('root')
);
