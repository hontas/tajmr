import PropTypes from 'prop-types';

export const interval = PropTypes.shape({
  startTime: PropTypes.number.isRequired,
  endTime: PropTypes.number
});

export const intervals = PropTypes.arrayOf(interval);

export const userSettings = PropTypes.shape({
  displayNotifications: PropTypes.bool.isRequired,
  displayPreviousIntervals: PropTypes.bool.isRequired
});
