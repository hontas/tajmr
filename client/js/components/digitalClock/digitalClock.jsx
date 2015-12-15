import React, { PropTypes } from 'react';
import TimerMixin from 'react-timer-mixin';
import { getTimePartsFromElapsedTime, zeroPad } from '../../utils/time';
import notify from '../../utils/notification';

const oneMinute = 1000 * 60;

export default React.createClass({
  propTypes: {
    displayNotifications: PropTypes.bool.isRequired,
    elapsed: PropTypes.number.isRequired,
    from: PropTypes.number.isRequired
  },

  mixins: [TimerMixin],

  componentDidMount() {
    this.setInterval(this.forceUpdate, oneMinute);
  },

  render() {
    const { from, elapsed, displayNotifications } = this.props;
    const time = from ? Date.now() - from + elapsed : elapsed;
    const { hours, minutes } = getTimePartsFromElapsedTime(time);
    const timestring = `${zeroPad(hours)}:${zeroPad(minutes)}`;

    if (displayNotifications && from && minutes === 0) {
      notify(`Nu har du jobbat i ${hours} timmar.`);
    }

    return (
      <div className="digital-clock">
        <time>{ timestring }</time>
      </div>
    );
  }
});
