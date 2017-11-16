import React from 'react';
import State from '../state/State';

import '../styles';
import '../styles/critical.styl';
import firebaseApi from './utils/firebaseApi';
import store from './store';
import Application from './components/application/application.jsx';

export default () => (
  <State>
    <Application />
  </State>
);
