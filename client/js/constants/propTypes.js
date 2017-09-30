import PropTypes from 'prop-types';

export const interval = PropTypes.shape({
  id: PropTypes.string.isRequired,
  startTime: PropTypes.number.isRequired,
  endTime: PropTypes.number,
  user: PropTypes.string,
  note: PropTypes.string
});

export const intervals = PropTypes.arrayOf(interval);

export const userSettings = PropTypes.shape({
  displayNotifications: PropTypes.bool.isRequired,
  displayPreviousIntervals: PropTypes.bool.isRequired,
  displayName: PropTypes.string,
  hoursInWeek: PropTypes.number.isRequired
});

export { default } from 'prop-types';
