import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import * as propTypes from '../../constants/propTypes';
import DigitalClock from '../digitalClock/digitalClock.jsx';
import WorkButton from '../button/workButton.jsx';
import IntervalList from '../intervalList/intervalList.jsx';
import WeekStats from '../intervalStats/weekStats.jsx';
import { attemptUpdate, attemptRemove } from '../../actions/intervals';
import { isToday, isCurrentWeek } from '../../utils/time';

const CurrentIntervals = React.createClass({
  propTypes: {
    activeInterval: propTypes.interval,
    dispatch: PropTypes.func.isRequired,
    intervals: propTypes.intervals.isRequired,
    weekIntervals: propTypes.intervals.isRequired
  },

  render() {
    const { intervals, activeInterval, weekIntervals } = this.props;
    const intervalSum = intervals
        .filter(({ endTime }) => endTime) // is complete
        .map(getTimeInterval)
        .reduce(sum, 0);
    const activeAndCurrentIntervals = activeInterval ? [].concat(activeInterval, intervals) : intervals;

    return (
      <div className="current-intervals">
        <DigitalClock elapsed={ intervalSum } from={ activeInterval ? activeInterval.startTime : 0 } />
        <WorkButton activeInterval={ !!activeInterval } onClick={ this.onClick } />
        <IntervalList intervals={ activeAndCurrentIntervals } onDelete={ this.onDelete } onUpdate={ this.onUpdate } />
        <WeekStats intervals={ weekIntervals } />
      </div>
    );
  },

  onDelete(id) {
    const { dispatch } = this.props;
    dispatch(attemptRemove(id));
  },

  onUpdate(interval) {
    const { dispatch } = this.props;
    dispatch(attemptUpdate(interval));
  },

  onClick() {
    const { dispatch, activeInterval } = this.props;

    if (activeInterval) {
      const completeInterval = Object.assign({}, activeInterval, { endTime: Date.now() });
      return dispatch(attemptUpdate(completeInterval));
    }

    return dispatch(attemptUpdate({ startTime: Date.now() }));
  }
});

function getTimeInterval({ startTime, endTime }) {
  return endTime - startTime;
}

function sum(res, curr) {
  return res + curr;
}

function mapStateToProps({ intervals }) {
  return {
    intervals: intervals.items.filter(({ startTime }) => isToday(new Date(startTime))),
    weekIntervals: intervals.items.filter(({ startTime }) => isCurrentWeek(new Date(startTime))),
    activeInterval: intervals.items.find((interval) => !interval.endTime)
  };
}

export default connect(mapStateToProps)(CurrentIntervals);