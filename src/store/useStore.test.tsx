import { render, screen, act } from '@testing-library/react';

import createStore from './createStore.ts';
import { initialized } from './app.ts';
import { userLoggedIn } from './user.ts';
import { StoreProvider, useSelector, useDispatch } from './useStore.tsx';

const renders = vi.fn<() => void>();

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
      store.dispatch(userLoggedIn({ uid: 'u1', email: null, photoURL: null }));
    });

    expect(renders).not.toHaveBeenCalled();
  });
});
