import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import * as propTypes from '../../constants/propTypes';
import DigitalClock from '../digitalClock/digitalClock.jsx';
import WorkButton from '../button/workButton.jsx';
import ProgressBar from '../ui-elements/progressBar.jsx';
import IntervalList from '../intervalList/intervalList.jsx';
import WeekStats from '../intervalStats/weekStats.jsx';
import { attemptUpdate, attemptRemove } from '../../actions/intervals';
import { isToday, isCurrentWeek, getHours } from '../../utils/time';

class CurrentIntervals extends React.Component {
  render() {
    const { intervals, activeInterval, weekIntervals, userSettings } = this.props;
    const intervalSum = intervals
        .filter(isComplete)
        .map(getTimeInterval)
        .reduce(sum, 0);
    const activeAndCurrentIntervals = activeInterval ? [].concat(activeInterval, intervals) : intervals;
    const hoursInWeek = userSettings.hoursInWeek || 40;;

    return (
      <div className="current-intervals">
        <DigitalClock elapsed={ intervalSum } from={ activeInterval ? activeInterval.startTime : 0 } />
        <ProgressBar progress={getHours(intervalSum)} max={ hoursInWeek / 5 } />
        <WorkButton activeInterval={ !!activeInterval } onClick={ this.onClick } />
        <IntervalList intervals={ activeAndCurrentIntervals } onDelete={ this.onDelete } onUpdate={ this.onUpdate } />
        <WeekStats intervals={ weekIntervals } />
      </div>
    );
  }

  onDelete = (id) => {
    const { dispatch } = this.props;
    dispatch(attemptRemove(id));
  }

  onUpdate = (interval) => {
    console.log('onUpdate interval', interval);
    const { dispatch } = this.props;
    dispatch(attemptUpdate(interval));
  }

  onClick = () => {
    const { dispatch, activeInterval } = this.props;

    if (activeInterval) {
      const completeInterval = Object.assign({}, activeInterval, { endTime: Date.now() });
      return dispatch(attemptUpdate(completeInterval));
    }

    return dispatch(attemptUpdate({ startTime: Date.now() }));
  }
}

const getTimeInterval = ({ startTime, endTime }) => endTime - startTime;
const isComplete = ({ endTime }) => endTime;
const sum = (res, curr) => res + curr;

CurrentIntervals.propTypes = {
  activeInterval: propTypes.interval,
  dispatch: PropTypes.func.isRequired,
  intervals: propTypes.intervals.isRequired,
  weekIntervals: propTypes.intervals.isRequired
}

function mapStateToProps({ intervals, userSettings }) {
  const intervalList = Object.keys(intervals.items).map((id) => ({
    ...intervals.items[id],
    id
  }));

  return {
    intervals: intervalList.filter(({ endTime }) => endTime).filter(({ startTime }) => isToday(new Date(startTime))),
    weekIntervals: intervalList.filter(({ startTime }) => isCurrentWeek(new Date(startTime))),
    activeInterval: intervalList.find((interval) => !interval.endTime),
    userSettings
  };
}

export default connect(mapStateToProps)(CurrentIntervals);
