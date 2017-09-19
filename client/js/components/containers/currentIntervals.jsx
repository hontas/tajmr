import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import PureUpdatedAtComponent from '../PureUpdatedAtComponent.jsx';
import * as propTypes from '../../constants/propTypes';
import DigitalClock from '../digitalClock/digitalClock.jsx';
import WorkButton from '../button/workButton.jsx';
import ProgressBarTimeWrapper from '../ui-elements/ProgressBarTimeWrapper.jsx';
import IntervalList from '../intervalList/intervalList.jsx';
import { WeekStatsTimeWrapper } from '../intervalStats/weekStats.jsx';
import { attemptUpdate, attemptRemove } from '../../actions/intervals';
import { isToday, isCurrentWeek, getHours } from '../../utils/time';

class CurrentIntervals extends PureUpdatedAtComponent {
  render() {
    const { intervals, activeInterval, weekIntervals, userSettings } = this.props;
    const activeAndCurrentIntervals = activeInterval ? [].concat(activeInterval, intervals) : intervals;
    const hoursInWeek = userSettings.hoursInWeek || 40;
    const intervalSum = intervals
      .filter(isComplete)
      .map(getTimeInterval)
      .reduce(sum, 0);

    return (
      <div className="current-intervals">
        <DigitalClock elapsed={ intervalSum } from={ activeInterval ? activeInterval.startTime : 0 } />
        <ProgressBarTimeWrapper intervals={activeAndCurrentIntervals} max={ hoursInWeek / 5 } />
        <WorkButton activeInterval={ !!activeInterval } onClick={ this.onClick } />
        <IntervalList intervals={ activeAndCurrentIntervals } onDelete={ this.onDelete } onUpdate={ this.onUpdate } />
        <WeekStatsTimeWrapper intervals={ weekIntervals } userSettings={userSettings} />
      </div>
    );
  }

  onDelete = (id) => {
    const { dispatch } = this.props;
    dispatch(attemptRemove(id));
  }

  onUpdate = (interval) => {
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
  ...CurrentIntervals.propTypes,
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

  const updatedAt = Math.max(intervals.updatedAt, userSettings.updatedAt);

  return {
    updatedAt,
    intervals: intervalList.filter(({ endTime }) => endTime).filter(({ startTime }) => isToday(new Date(startTime))),
    weekIntervals: intervalList.filter(({ startTime }) => isCurrentWeek(new Date(startTime))),
    activeInterval: intervalList.find((interval) => !interval.endTime),
    userSettings
  };
}

export default connect(mapStateToProps)(CurrentIntervals);
