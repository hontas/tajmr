import * as React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Button from '../button/button.jsx';
import { removeNotification as removeNotificationAC, TYPES } from '../../redux/notifications';

import styles from './Notifications.module.css';

const Notifications = ({ notifications, removeNotification }) => (
  <div className={styles.container}>
    {notifications.map(({ id, type, theme, message, actionText, onAction }) => {
      const isDismiss = type === TYPES.DISMISS;
      const isAction = Boolean(!isDismiss && actionText && onAction);
      return (
        <div key={id} className={classNames(styles.notification, styles[theme])}>
          {message}
          {isDismiss && (
            <Button
              className={styles.action}
              text="╳"
              theme="link"
              onClick={() => removeNotification(id)}
            />
          )}
          {isAction && (
            <Button
              className={styles.action}
              text={actionText}
              theme="link"
              onClick={async () => {
                await onAction();
                removeNotification(id);
              }}
            />
          )}
        </div>
      );
    })}
  </div>
);

Notifications.propTypes = {
  removeNotification: PropTypes.func.isRequired,
  notifications: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      theme: PropTypes.string.isRequired,
      message: PropTypes.string.isRequired,
      actionText: PropTypes.string,
      onAction: PropTypes.func,
    })
  ),
};

function mapStateToProps({ notifications }) {
  return {
    notifications: notifications.notifications,
  };
}

export default connect(mapStateToProps, { removeNotification: removeNotificationAC })(
  Notifications
);
