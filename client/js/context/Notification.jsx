import * as React from 'react';
import PropTypes from 'prop-types';
import { useNotificationPermission } from '../hooks/useNotificationPermission';

const NotificationContext = React.createContext();

export const NotificationProvider = ({ children }) => {
  const value = useNotificationPermission();
  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

NotificationProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useNotificationContext = () => {
  const context = React.useContext(NotificationContext);

  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }

  return context;
};
