import React from 'react';
import { StoreProvider } from '../../hooks/useStore';
import { render /* screen */ } from '@testing-library/react';

import createStore from '../../redux/createStore';
import PreviousIntervals from './previousIntervals.jsx';
import { intervalsFetched } from '../../redux/intervals';
import { updateSettings } from '../../redux/userSettings';
import { intervals } from '../../../../test/test-data.json';

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
    const { container } = render(
      <StoreProvider store={store}>
        <PreviousIntervals />
      </StoreProvider>,
    );

    expect(container).not.toBeEmptyDOMElement();
  });
});
