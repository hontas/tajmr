import { StoreProvider } from '#/store/useStore.tsx';
import { render /* screen */ } from '@testing-library/react';

import createStore from '#/store/createStore.ts';
import type { Store } from '#/store/types.ts';
import PreviousIntervals from './previousIntervals.tsx';
import { intervalsFetched } from '#/store/intervals.ts';
import { updateSettings } from '#/store/userSettings.ts';
import { intervals } from '#test/test-data.json';

describe('PreviousIntervals', () => {
  let store: Store;

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

  test('should render', () => {
    const { container } = render(
      <StoreProvider store={store}>
        <PreviousIntervals />
      </StoreProvider>,
    );

    expect(container).not.toBeEmptyDOMElement();
  });
});
