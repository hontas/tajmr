import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import * as socket from './socket';
import store from './store';
//import { fetchIntervals } from './actions/intervals';
import Application from './components/application/application.jsx';

socket.init(store.dispatch);

ReactDOM.render(
  <Provider store={ store }>
      <Application />
  </Provider>,
  document.getElementById('root')
);

//store.dispatch(fetchIntervals());
