import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';

import createStore from '../../redux/createStore';
import CurrentIntervals from './currentIntervals.jsx';
import { intervalsFetched } from '../../redux/intervals';

const { intervals } = require('../../../../test/test-data.json');

describe('PreviousIntervals', () => {
  let store;

  beforeEach(() => {
    store = createStore();
    store.dispatch(intervalsFetched(intervals));
  });

  afterEach(() => {
    store = null;
  });

  test('should render', () => {
    mount(
      <Provider store={store}>
        <CurrentIntervals />
      </Provider>
    );
  });
});
