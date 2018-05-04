import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';

import createStore from '../../store';
import PreviousIntervals from './previousIntervals.jsx';
import { intervalsFetched } from '../../actions/intervals';
import { updateSettings } from '../../actions/userActions';

const { intervals } = require('../../../../test/test-data.json');

describe('PreviousIntervals', () => {
  let store;

  beforeEach(() => {
    store = createStore();
    const { userSettings } = store.getState();
    const updatedUserSettings = {
      ...userSettings,
      displayPreviousIntervals: true
    };
    store.dispatch(updateSettings(updatedUserSettings));
    store.dispatch(intervalsFetched(intervals));
  });

  afterEach(() => {
    store = null;
  });

  test('should render', () => {
    mount(<Provider store={store}><PreviousIntervals /></Provider>);
  });
});