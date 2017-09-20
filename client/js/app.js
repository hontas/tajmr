import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import firebaseApi from './utils/firebaseApi';
import store from './store';
import Application from './components/application/application.jsx';

firebaseApi.init();
ReactDOM.render(
  <Provider store={store}>
    <Application />
  </Provider>,
  document.getElementById('root')
);
