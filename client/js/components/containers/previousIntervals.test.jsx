import React from 'react';
import { Provider } from 'react-redux';
import { render /* screen */ } from '@testing-library/react';
import '@testing-library/jest-dom';

import createStore from '../../redux/createStore';
import PreviousIntervals from './previousIntervals.jsx';
import { intervalsFetched } from '../../redux/intervals';
import { updateSettings } from '../../redux/userSettings';

const { intervals } = require('../../../../test/test-data.json');

describe('PreviousIntervals', () => {
  let store;

  beforeEach(() => {
    store = createStore();
    const { userSettings } = store.getState();
    const updatedUserSettings = {
      ...userSettings,
      displayPreviousIntervals: true,
    };
    store.dispatch(updateSettings(updatedUserSettings));
    store.dispatch(intervalsFetched(intervals));
  });

  afterEach(() => {
    store = null;
  });

  test('should render', () => {
    render(
      <Provider store={store}>
        <PreviousIntervals />
      </Provider>
    );

    // TODO: assert intervals rendered
    // expect(screen.getByRole('heading')).toHaveTextContent('Welcome, John Doe')
  });
});
