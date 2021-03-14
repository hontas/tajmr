/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import * as Sentry from '@sentry/browser';

import connectWithFirebase from './utils/connectWithFirebase';
import createStore from './redux/createStore';

import Application from './components/application/application.jsx';
import './register-sw';
import '../styles/main.css';

Sentry.init({ dsn: 'https://a359f82382f84f2d85c9a876827f8e1a@sentry.io/1836574' });

export const store = createStore();
connectWithFirebase(store);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Application />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);