import { StoreProvider } from '#/store/useStore.tsx';
import { render, screen } from '@testing-library/react';

import Application from './application.tsx';
import type { Action } from '#/store/types.ts';
import firebaseApi from '#/utils/firebaseApi.ts';
import createStore from '#/store/createStore.ts';
import { initialized } from '#/store/app.ts';
import { userLoggedIn } from '#/store/user.ts';
import { intervalsFetched } from '#/store/intervals.ts';

vi.mock(import('#/utils/firebaseApi.ts'));

beforeEach(() => {
  vi.mocked(firebaseApi.fetchIntervalsInWeek).mockResolvedValue({});
});

const setup = (...actions: Action[]) => {
  const store = createStore();
  actions.forEach((action) => store.dispatch(action));
  render(
    <StoreProvider store={store}>
      <Application />
    </StoreProvider>,
  );
  return store;
};

describe('Application', () => {
  beforeAll(() =>
    Promise.all([
      import('#/components/navbar/navbar.tsx'),
      import('#/components/footer/footer.tsx'),
      import('#/components/containers/currentIntervals.tsx'),
      import('#/components/containers/previousIntervals.tsx'),
      import('#/components/auth/login.tsx'),
    ]),
  );

  test('shows the loader until the app is initialised', () => {
    setup();
    expect(screen.getByRole('status', { name: 'Laddar appen' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Logga in' })).not.toBeInTheDocument();
  });

  test('shows the login form for a logged-out user', async () => {
    setup(initialized());

    expect(await screen.findByRole('button', { name: 'Logga in' })).toBeInTheDocument();
    expect(await screen.findByText('TajmR')).toBeInTheDocument();
  });

  test('shows the work button for a logged-in user', async () => {
    setup(
      initialized(),
      userLoggedIn({ uid: 'u1', email: 'me@example.com', photoURL: null }),
      intervalsFetched({}),
    );

    expect(await screen.findByRole('button', { name: 'Öppna menyn' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Logga in' })).not.toBeInTheDocument();
  });
});
