import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import Navbar from '../navbar/navbar.jsx';
import DigitalClock from '../digitalClock/digitalClock.jsx';
import WorkButton from '../workButton/workButton.jsx';
import IntervalList from '../intervalList/intervalList.jsx';
import IntervalStats from '../intervalStats/intervalStats.jsx';

function isToday({ startTime }) {
  const today = new Date();
  const date = new Date(startTime);

  return date.toLocaleDateString() === today.toLocaleDateString();
}

function isComplete({ endTime }) {
  return endTime;
}

function getTimeInterval({ startTime, endTime }) {
  return endTime - startTime;
}

function sum(res, curr) {
  return res + curr;
}

const Application = React.createClass({
  propTypes: {
    activeInterval: PropTypes.shape({
      startTime: PropTypes.number.isRequired
    }),
    dispatch: PropTypes.func.isRequired,
    intervals: PropTypes.arrayOf(PropTypes.object).isRequired
  },

  render() {
    const { intervals, activeInterval } = this.props;
    const intervalSum = intervals
      .filter(isToday)
      .filter(isComplete)
      .map(getTimeInterval)
      .reduce(sum, 0);

    return (
      <div className="application">
        <Navbar { ...this.props } />
        <DigitalClock { ...this.props } elapsed={ intervalSum } from={ activeInterval ? activeInterval.startTime : 0 } />
        <WorkButton { ...this.props } />
        <IntervalList intervals={ intervals } { ...this.props } />
        <IntervalStats intervals={ intervals } />
      </div>
    );
  }
});

function select({ intervals: intervalMap, userSettings, user }) {
  const intervals = Object.keys(intervalMap).map((id) => intervalMap[id]);
  return {
    user,
    intervals,
    activeInterval: intervals.find((interval) => !interval.endTime),
    userSettings
  };
}

export default connect(select)(Application);
