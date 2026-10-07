import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

import UserMenu from './userMenu.jsx';
import firebaseApi from '../../utils/firebaseApi';
import { NotificationContext } from '../../context/Notification.jsx';

jest.mock('../../utils/firebaseApi', () => ({
  __esModule: true,
  default: {
    logout: jest.fn(),
    saveUserData: jest.fn(),
    updateUserPassword: jest.fn(),
  },
}));

const user = { uid: 'u1', email: 'me@example.com' };
const userSettings = {
  displayMonthReport: false,
  displayNotifications: true,
  displayPreviousIntervals: false,
  hoursInWeek: 40,
};

const setup = (props = {}) => {
  const updateSettings = jest.fn();
  render(
    <UserMenu user={user} userSettings={userSettings} updateSettings={updateSettings} {...props} />
  );
  return { updateSettings };
};

describe('UserMenu', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    firebaseApi.saveUserData.mockResolvedValue();
    firebaseApi.updateUserPassword.mockResolvedValue();
  });

  test('uses a gravatar url based on the email when the user has no photo', () => {
    setup();
    expect(screen.getByAltText('avatar').getAttribute('src')).toMatch(
      /^https:\/\/www\.gravatar\.com\/avatar\/[0-9a-f]{32}$/
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
      expect(screen.getByRole('button', { name: 'Spara inställningar' })).toBeEnabled()
    );
  });

  test('log out calls firebase logout', () => {
    setup();
    fireEvent.click(screen.getByRole('button', { name: 'Logga ut' }));
    expect(firebaseApi.logout).toHaveBeenCalled();
  });

  describe('change password', () => {
    const fill = (oldPass, newPass) => {
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
      firebaseApi.updateUserPassword.mockRejectedValue({ message: 'Wrong password' });
      setup();
      fill('bad', 'new');

      fireEvent.click(screen.getByRole('button', { name: 'Ändra' }));

      expect(await screen.findByText('Wrong password')).toBeInTheDocument();
    });
  });
  describe('notifications toggle', () => {
    const renderWithContext = (ctx, settings = { ...userSettings, displayNotifications: false }) =>
      render(
        <NotificationContext.Provider value={ctx}>
          <UserMenu user={user} userSettings={settings} updateSettings={jest.fn()} />
        </NotificationContext.Provider>
      );

    test('asks for browser permission when switched on and permission can be requested', () => {
      const requestPermission = jest.fn();
      renderWithContext({ canRequest: true, requestPermission });
      fireEvent.click(screen.getByLabelText('Visa notifiering'));
      expect(requestPermission).toHaveBeenCalledTimes(1);
    });

    test('does not ask again when permission is already decided', () => {
      const requestPermission = jest.fn();
      renderWithContext({ canRequest: false, requestPermission });
      fireEvent.click(screen.getByLabelText('Visa notifiering'));
      expect(requestPermission).not.toHaveBeenCalled();
    });
  });
});
