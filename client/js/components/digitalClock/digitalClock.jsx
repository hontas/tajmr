import React from 'react';
import PropTypes from 'prop-types';

import { getTimePartsFromElapsedTime, zeroPad, getTimeString } from '../../utils/time';
import notify from '../../utils/notification';

const thirtySeconds = 1000 * 30;

class DigitalClock extends React.Component {
  componentDidMount() {
    this.intervalId = setInterval(() => {
      this.forceUpdate();
    }, thirtySeconds);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  render() {
    const { from, elapsed } = this.props;
    const time = from ? Date.now() - from + elapsed : elapsed;
    const { hours, minutes } = getTimePartsFromElapsedTime(time);
    const timestring = getTimeString(time, { isDuration: true });

    if (from && hours && minutes === 0) {
      notify(`Nu har du jobbat i ${hours} timmar.`);
    }

    return (
      <div className="digital-clock">
        <time>{ timestring }</time>
      </div>
    );
  }
}

DigitalClock.propTypes = {
  elapsed: PropTypes.number.isRequired,
  from: PropTypes.number.isRequired
};

export default DigitalClock;
