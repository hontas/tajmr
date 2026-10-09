import React from 'react';
import { render, screen, act } from '@testing-library/react';

import createStore from '../redux/createStore';
import { initialized } from '../redux/app';
import { userLoggedIn } from '../redux/user';
import { StoreProvider, useSelector, useDispatch } from './useStore';

const renders = vi.fn();

const Initialized = () => {
  const isInitialized = useSelector((state) => state.app.initialized);
  const dispatch = useDispatch();
  renders();
  return (
    <button type="button" onClick={() => dispatch(initialized())}>
      {String(isInitialized)}
    </button>
  );
};

const setup = () => {
  const store = createStore();
  render(
    <StoreProvider store={store}>
      <Initialized />
    </StoreProvider>,
  );
  return store;
};

describe('useStore', () => {
  test('useSelector shows the selected state', () => {
    setup();
    expect(screen.getByRole('button')).toHaveTextContent('false');
  });

  test('useDispatch updates the state and the component', () => {
    const store = setup();

    act(() => {
      screen.getByRole('button').click();
    });

    expect(store.getState().app.initialized).toBe(true);
    expect(screen.getByRole('button')).toHaveTextContent('true');
  });

  test('a change in another part of the state does not re-render', () => {
    const store = setup();
    renders.mockClear();

    act(() => {
      store.dispatch(userLoggedIn({ uid: 'u1' }));
    });

    expect(renders).not.toHaveBeenCalled();
  });
});
