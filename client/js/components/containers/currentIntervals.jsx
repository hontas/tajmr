import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import MonthReport from '../monthReport/MonthReport.jsx';
import * as customTypes from '../../constants/propTypes';
import DigitalClock from '../digitalClock/digitalClock.jsx';
import WorkButton from '../button/workButton.jsx';
import ProgressBarTimeWrapper from '../ui-elements/ProgressBarTimeWrapper.jsx';
import IntervalList from '../intervalList/intervalList.jsx';
import MonthStats from '../intervalStats/monthStats.jsx';
import Button from '../button/button.jsx';
import { WeekStatsTimeWrapper } from '../intervalStats/weekStats.jsx';
import * as intervalActions from '../../actions/intervals';
import AddOneInterval from '../intervalList/addOneInterval.jsx';
import {
  getIntervalSum,
  isActive,
  isComplete
} from '../../utils/intervals';
import {
  isToday,
  getWeek,
  getMonth
} from '../../utils/time';

class CurrentIntervals extends React.PureComponent {
  state = {
    displayAddForm: false
  };

  render() {
    const {
      intervals,
      activeInterval,
      todaysIntervals,
      userSettings,
      timestamp
    } = this.props;

    const activeAndCurrentIntervals = activeInterval ? [].concat(activeInterval, todaysIntervals) : todaysIntervals;
    const hoursInWeek = userSettings.hoursInWeek || 40;
    const hoursInDay = hoursInWeek / 5;
    const intervalSum = getIntervalSum(todaysIntervals);
    const week = getWeek(timestamp);
    const month = getMonth(timestamp);
    const weekIntervals = intervals.filter(({ startTime }) =>
      startTime > week.startTime && startTime < week.endTime);
    const monthIntervals = intervals.filter(({ startTime }) =>
      startTime > month.startTime && startTime < month.endTime);

    return (
      <div className="current-intervals">
        <DigitalClock elapsed={intervalSum} from={activeInterval ? activeInterval.startTime : 0} />
        <ProgressBarTimeWrapper intervals={activeAndCurrentIntervals} max={hoursInWeek / 5} />
        <div className="action-buttons" style={{ display: 'flex' }}>
          <WorkButton activeInterval={!!activeInterval} onClick={this.onClick} />
          <Button className="current-intervals__prev-work-btn" type="primary" onClick={this.onAddPrevClick}>
            Efterregga
          </Button>
        </div>
        {this.state.displayAddForm &&
          <AddOneInterval onAdd={this.onAddOneInterval} fullDay={hoursInDay} />
        }
        <IntervalList intervals={activeAndCurrentIntervals} onDelete={this.onDelete} onUpdate={this.onUpdate} />
        <WeekStatsTimeWrapper
          fetchIntervalsInWeek={this.updateTimestamp}
          intervals={weekIntervals}
          timestamp={timestamp}
          userSettings={userSettings}
        />
        {intervals.length > 0 &&
          <MonthStats
            timestamp={timestamp}
            monthIntervals={monthIntervals}
            hoursPerWeek={userSettings.hoursInWeek}
          />
        }
        {userSettings.displayMonthReport &&
          <MonthReport intervals={intervals} />
        }
      </div>
    );
  }

  updateTimestamp = (timestamp) => {
    this.props.updateTimestamp(timestamp);
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

  onAddPrevClick = () => this.setState({ displayAddForm: true });

  onAddOneInterval = (interval) => {
    const { attemptUpdate, intervalAdded } = this.props;
    attemptUpdate(interval)
      .then((saveInterval) => {
        this.setState({ displayAddForm: false });
        intervalAdded(saveInterval);
      });
    // 👆 must do manual add cause child_added only register startDate > Date.now()
  };
}

CurrentIntervals.propTypes = {
  ...CurrentIntervals.propTypes,
  activeInterval: customTypes.interval,
  intervals: customTypes.intervals.isRequired,
  todaysIntervals: customTypes.intervals.isRequired,
  attemptUpdate: PropTypes.func.isRequired,
  attemptRemove: PropTypes.func.isRequired,
  updateTimestamp: PropTypes.func.isRequired,
  timestamp: PropTypes.number.isRequired,
};

CurrentIntervals.defaultProps = {
  activeInterval: null
};

function mapStateToProps({ intervals, userSettings }) {
  const intervalList = Object.keys(intervals.items).map((id) => ({
    ...intervals.items[id],
    id
  }));

  return {
    timestamp: intervals.timestamp,
    intervals: intervalList,
    todaysIntervals: intervalList.filter(isComplete).filter(({ startTime }) => isToday(new Date(startTime))),
    activeInterval: intervalList.find(isActive),
    userSettings
  };
}

export default connect(mapStateToProps, intervalActions)(CurrentIntervals);
