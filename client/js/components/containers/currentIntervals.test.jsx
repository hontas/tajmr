import React from 'react';
import { Provider } from 'react-redux';
import { render /* screen */ } from '@testing-library/react';

import createStore from '../../redux/createStore';
import CurrentIntervals from './currentIntervals.jsx';
import { intervalsFetched } from '../../redux/intervals';
import { intervals } from '../../../../test/test-data.json';

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
    const { container } = render(
      <Provider store={store}>
        <CurrentIntervals />
      </Provider>,
    );

    expect(container).not.toBeEmptyDOMElement();
  });
});
