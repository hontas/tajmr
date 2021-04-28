import React from 'react';
import { Provider } from 'react-redux';
import { render /* screen */ } from '@testing-library/react';
import '@testing-library/jest-dom';

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
    render(
      <Provider store={store}>
        <CurrentIntervals />
      </Provider>
    );

    // TODO: assert intervals rendered
    // expect(screen.getByRole('heading')).toHaveTextContent('Welcome, John Doe')
  });
});
