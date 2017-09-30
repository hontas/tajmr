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
import * as intervalActions from '../../actions/intervals';
import { isToday, isCurrentWeek, getHours } from '../../utils/time';

class CurrentIntervals extends PureUpdatedAtComponent {
  render() {
    const {
      intervals,
      activeInterval,
      todaysIntervals,
      userSettings,
      fetchIntervalsInWeek,
      attemptUpdate,
      attemptRemove,
      timestamp
    } = this.props;
    const activeAndCurrentIntervals = activeInterval ? [].concat(activeInterval, todaysIntervals) : todaysIntervals;
    const hoursInWeek = userSettings.hoursInWeek || 40;
    const intervalSum = todaysIntervals
      .filter(isComplete)
      .map(getTimeInterval)
      .reduce(sum, 0);

    return (
      <div className="current-intervals">
        <DigitalClock elapsed={ intervalSum } from={ activeInterval ? activeInterval.startTime : 0 } />
        <ProgressBarTimeWrapper intervals={activeAndCurrentIntervals} max={ hoursInWeek / 5 } />
        <WorkButton activeInterval={ !!activeInterval } onClick={ this.onClick } />
        <IntervalList intervals={ activeAndCurrentIntervals } onDelete={ this.onDelete } onUpdate={ this.onUpdate } />
        <WeekStatsTimeWrapper
          fetchIntervalsInWeek={ fetchIntervalsInWeek }
          intervals={ intervals }
          timestamp={ timestamp }
          userSettings={userSettings} />
      </div>
    );
  }

  onDelete = (id) => this.props.attemptRemove(id)

  onUpdate = (interval) => this.props.attemptUpdate(interval)

  onClick = () => {
    const { activeInterval, attemptUpdate } = this.props;

    if (activeInterval) {
      const completeInterval = Object.assign({}, activeInterval, { endTime: Date.now() });
      return attemptUpdate(completeInterval);
    }

    return attemptUpdate({ startTime: Date.now() });
  }
}

const getTimeInterval = ({ startTime, endTime }) => endTime - startTime;
const isComplete = ({ endTime }) => endTime;
const sum = (res, curr) => res + curr;

CurrentIntervals.propTypes = {
  ...CurrentIntervals.propTypes,
  activeInterval: propTypes.interval,
  intervals: propTypes.intervals.isRequired,
  todaysIntervals: propTypes.intervals.isRequired,
  attemptUpdate: PropTypes.func.isRequired,
  attemptRemove: PropTypes.func.isRequired,
  fetchIntervalsInWeek: PropTypes.func.isRequired,
  timestamp: PropTypes.number.isRequired,
}

function mapStateToProps({ intervals, userSettings }) {
  const intervalList = Object.keys(intervals.items).map((id) => ({
    ...intervals.items[id],
    id
  }));

  const updatedAt = Math.max(intervals.updatedAt, userSettings.updatedAt);

  return {
    updatedAt,
    timestamp: intervals.timestamp,
    intervals: intervalList,
    todaysIntervals: intervalList.filter(({ endTime }) => endTime).filter(({ startTime }) => isToday(new Date(startTime))),
    activeInterval: intervalList.find((interval) => !interval.endTime),
    userSettings
  };
}

export default connect(mapStateToProps, intervalActions)(CurrentIntervals);
