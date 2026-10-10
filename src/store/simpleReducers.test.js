import appReducer, { initialized } from './app';
import userReducer, { userLoggedIn, userLoggedOut } from './user';
import userSettingsReducer, { updateSettings } from './userSettings';

describe('app reducer', () => {
  test('starts uninitialized and becomes initialized', () => {
    const initial = appReducer(undefined, { type: '@@INIT' });
    expect(initial).toEqual({ initialized: false });
    expect(appReducer(initial, initialized())).toEqual({ initialized: true });
  });
});

describe('user reducer', () => {
  test('is null by default', () => {
    expect(userReducer(undefined, { type: '@@INIT' })).toBeNull();
  });

  test('stores the user on login and clears it on logout', () => {
    const user = { uid: 'u1', email: 'a@b.c' };
    const loggedIn = userReducer(null, userLoggedIn(user));
    expect(loggedIn).toBe(user);
    expect(userReducer(loggedIn, userLoggedOut())).toBeNull();
  });
});

describe('userSettings reducer', () => {
  beforeEach(() => vi.spyOn(Date, 'now').mockReturnValue(1234));
  afterEach(() => vi.restoreAllMocks());

  test('has sensible defaults', () => {
    expect(userSettingsReducer(undefined, { type: '@@INIT' })).toEqual({
      updatedAt: 0,
      displayMonthReport: false,
      displayNotifications: false,
      displayPreviousIntervals: false,
      displayName: '',
      hoursInWeek: 40,
    });
  });

  test('merges settings and bumps updatedAt', () => {
    const state = userSettingsReducer(
      undefined,
      updateSettings({ hoursInWeek: 36, displayName: 'Pontus' }),
    );
    expect(state).toMatchObject({ hoursInWeek: 36, displayName: 'Pontus', updatedAt: 1234 });
    expect(state.displayNotifications).toBe(false);
  });

  test('handles null settings (user without saved settings)', () => {
    const state = userSettingsReducer(undefined, updateSettings(null));
    expect(state.hoursInWeek).toBe(40);
    expect(state.updatedAt).toBe(1234);
  });

  test('resets to defaults on logout', () => {
    const changed = userSettingsReducer(undefined, updateSettings({ hoursInWeek: 10 }));
    const reset = userSettingsReducer(changed, userLoggedOut());
    expect(reset.hoursInWeek).toBe(40);
  });
});
