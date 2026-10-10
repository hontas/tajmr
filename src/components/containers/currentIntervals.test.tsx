import { StoreProvider } from '#/store/useStore.tsx';
import { render /* screen */ } from '@testing-library/react';

import createStore from '#/store/createStore.ts';
import type { Store } from '#/store/types.ts';
import CurrentIntervals from './currentIntervals.tsx';
import { intervalsFetched } from '#/store/intervals.ts';
import { intervals } from '#test/test-data.json';

describe('PreviousIntervals', () => {
  let store: Store;

  beforeEach(() => {
    store = createStore();
    store.dispatch(intervalsFetched(intervals));
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
