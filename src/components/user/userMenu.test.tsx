import { type ComponentProps } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import type { AppUser } from '#/store/user.ts';
import type { UserSettingsState } from '#/store/userSettings.ts';
import UserMenu from './userMenu.tsx';
import firebaseApi from '#/utils/firebaseApi.ts';

vi.mock(import('#/utils/firebaseApi.ts'));

const user: AppUser = { uid: 'u1', email: 'me@example.com', photoURL: null };
const userSettings: UserSettingsState = {
  updatedAt: 0,
  displayName: '',
  displayMonthReport: false,
  displayNotifications: true,
  displayPreviousIntervals: false,
  hoursInWeek: 40,
};

const setup = (props: Partial<ComponentProps<typeof UserMenu>> = {}) => {
  const updateSettings = vi.fn<(prop: string, value: boolean | number | string) => void>();
  render(
    <UserMenu user={user} userSettings={userSettings} updateSettings={updateSettings} {...props} />,
  );
  return { updateSettings };
};

describe('UserMenu', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(firebaseApi.saveUserData).mockResolvedValue();
    vi.mocked(firebaseApi.updateUserPassword).mockResolvedValue();
  });

  test('uses a gravatar url based on the email when the user has no photo', () => {
    setup();
    expect(screen.getByAltText('avatar').getAttribute('src')).toMatch(
      /^https:\/\/www\.gravatar\.com\/avatar\/[0-9a-f]{32}$/,
    );
  });

  test('uses the photo url when present', () => {
    setup({ user: { ...user, photoURL: 'https://example.com/me.png' } });
    expect(screen.getByAltText('avatar')).toHaveAttribute('src', 'https://example.com/me.png');
  });

  test('reflects the current settings', () => {
    setup();
    expect(screen.getByLabelText('Visa notifiering')).toBeChecked();
    expect(screen.getByLabelText('Visa månadsrapport')).not.toBeChecked();
    expect(screen.getByLabelText('Full arbetsvecka (h)')).toHaveValue(40);
  });

  test('checkbox changes call updateSettings with the boolean', () => {
    const { updateSettings } = setup();

    fireEvent.click(screen.getByLabelText('Visa månadsrapport'));

    expect(updateSettings).toHaveBeenCalledWith('displayMonthReport', true);
  });

  describe('notifications', () => {
    const stubNotification = (permission: NotificationPermission) => {
      const requestPermission = vi.fn<() => Promise<NotificationPermission>>();
      requestPermission.mockResolvedValue('granted');
      vi.stubGlobal('Notification', { permission, requestPermission });
      return requestPermission;
    };

    afterEach(() => vi.unstubAllGlobals());

    test('turning the setting on asks the browser for permission', () => {
      const requestPermission = stubNotification('default');
      setup({ userSettings: { ...userSettings, displayNotifications: false } });

      fireEvent.click(screen.getByLabelText('Visa notifiering'));

      expect(requestPermission).toHaveBeenCalledTimes(1);
    });

    test('turning the setting off does not ask', () => {
      const requestPermission = stubNotification('granted');
      setup();

      fireEvent.click(screen.getByLabelText('Visa notifiering'));

      expect(requestPermission).not.toHaveBeenCalled();
    });

    test('says when the browser blocks notifications', () => {
      stubNotification('denied');
      setup();

      expect(screen.getByText(/blockerade i webbläsarens inställningar/)).toBeInTheDocument();
    });

    test('says when notifications are not supported', () => {
      vi.stubGlobal('Notification', undefined);
      Reflect.deleteProperty(window, 'Notification');
      setup();

      expect(screen.getByText(/lägg till appen på hemskärmen/)).toBeInTheDocument();
    });

    test('shows no hint when notifications are allowed', () => {
      stubNotification('granted');
      setup();

      expect(screen.queryByText(/Notiser/)).not.toBeInTheDocument();
    });
  });

  test('hours in week is converted to a number', () => {
    const { updateSettings } = setup();

    fireEvent.change(screen.getByLabelText('Full arbetsvecka (h)'), { target: { value: '36' } });

    expect(updateSettings).toHaveBeenCalledWith('hoursInWeek', 36);
  });

  test('saves the settings for the user', async () => {
    setup();

    fireEvent.click(screen.getByRole('button', { name: 'Spara inställningar' }));

    expect(firebaseApi.saveUserData).toHaveBeenCalledWith('u1', userSettings);
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Spara inställningar' })).toBeEnabled(),
    );
  });

  test('log out calls firebase logout', () => {
    setup();
    fireEvent.click(screen.getByRole('button', { name: 'Logga ut' }));
    expect(firebaseApi.logout).toHaveBeenCalled();
  });

  describe('change password', () => {
    const fill = (oldPass: string, newPass: string) => {
      fireEvent.change(screen.getByPlaceholderText('Nuvarande lösenord'), {
        target: { value: oldPass },
      });
      fireEvent.change(screen.getByPlaceholderText('Nytt lösenord'), {
        target: { value: newPass },
      });
    };

    test('updates the password and clears the inputs on success', async () => {
      setup();
      fill('old', 'new');

      fireEvent.click(screen.getByRole('button', { name: 'Ändra' }));

      expect(firebaseApi.updateUserPassword).toHaveBeenCalledWith('old', 'new');
      expect(await screen.findByRole('button', { name: '👍' })).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Nuvarande lösenord')).toHaveValue('');
      expect(screen.getByPlaceholderText('Nytt lösenord')).toHaveValue('');
    });

    test('shows the error message on failure', async () => {
      vi.mocked(firebaseApi.updateUserPassword).mockRejectedValue(new Error('Wrong password'));
      setup();
      fill('bad', 'new');

      fireEvent.click(screen.getByRole('button', { name: 'Ändra' }));

      expect(await screen.findByText('Wrong password')).toBeInTheDocument();
    });
  });
});
