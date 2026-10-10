import { StoreProvider } from '#/store/useStore.tsx';
import { render, screen } from '@testing-library/react';

import createStore from '#/store/createStore.ts';
import type { Store } from '#/store/types.ts';
import CurrentIntervals from './currentIntervals.tsx';
import { intervalsFetched } from '#/store/intervals.ts';
import { intervals } from '#test/test-data.json';

describe('CurrentIntervals', () => {
  let store: Store;

  beforeEach(() => {
    store = createStore();
    store.dispatch(intervalsFetched(intervals));
  });

  const setup = () =>
    render(
      <StoreProvider store={store}>
        <CurrentIntervals />
      </StoreProvider>,
    );

  test('should render', () => {
    const { container } = setup();

    expect(container).not.toBeEmptyDOMElement();
  });

  test('has a named list of the intervals and a work button', () => {
    setup();

    expect(screen.getByRole('list', { name: 'Dagens intervall' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Börja debitera|Ta en fika/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Efterregga' })).toBeInTheDocument();
  });
});
