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
    intervals: PropTypes.shape({
      items: PropTypes.array.isRequired,
      isFetching: PropTypes.bool.isRequired
    }).isRequired
  },

  render() {
    const { intervals, activeInterval } = this.props;
    const intervalSum = intervals.items
      .filter(isToday)
      .filter(isComplete)
      .map(getTimeInterval)
      .reduce(sum, 0);

    return (
      <div className="application">
        <Navbar { ...this.props } />
        <DigitalClock { ...this.props } elapsed={ intervalSum } from={ activeInterval ? activeInterval.startTime : 0 } />
        <WorkButton { ...this.props } />
        <IntervalList { ...this.props } intervals={ intervals.items } />
        <IntervalStats intervals={ intervals.items } />
      </div>
    );
  }
});

function select({ intervals, userSettings, user }) {
  return {
    user,
    isFetching: intervals.isFetching,
    intervals,
    activeInterval: intervals.items.find((interval) => !interval.endTime),
    userSettings
  };
}

export default connect(select)(Application);
