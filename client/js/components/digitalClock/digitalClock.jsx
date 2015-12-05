import React, { PropTypes } from 'react';
import TimerMixin from 'react-timer-mixin';
import { getTimePartsFromElapsedTime } from '../../utils/time';

const oneMinute = 1000 * 60;

export default React.createClass({
  propTypes: {
    elapsed: PropTypes.number.isRequired,
    from: PropTypes.number.isRequired
  },

  mixins: [TimerMixin],

  componentDidMount() {
    this.setInterval(this.forceUpdate, oneMinute);
  },

  render() {
    const { from, elapsed } = this.props;
    const time = Date.now() - from + elapsed;
    const { hours, minutes } = getTimePartsFromElapsedTime(time);
    const timestring = `${hours}:${minutes}`;

    return (
      <div className="digital-clock">
        <time>{ timestring }</time>
      </div>
    );
  }
});
