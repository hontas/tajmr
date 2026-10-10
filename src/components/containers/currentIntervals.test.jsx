import React from 'react';
import { StoreProvider } from '../../store/useStore';
import { render /* screen */ } from '@testing-library/react';

import createStore from '../../store/createStore';
import CurrentIntervals from './currentIntervals.jsx';
import { intervalsFetched } from '../../store/intervals';
import { intervals } from '../../../test/test-data.json';

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
      <StoreProvider store={store}>
        <CurrentIntervals />
      </StoreProvider>,
    );

    expect(container).not.toBeEmptyDOMElement();
  });
});
