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
  getWeek,
  getMonth,
  getDayRange
} from '../../utils/time';

class CurrentIntervals extends React.Component {
  state = {
    displayAddForm: false
  };

  render() {
    const {
      intervals,
      activeInterval,
      todaysIntervals,
      userSettings,
      timestamp,
      notes
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
          <Button className="current-intervals__prev-work-btn" theme="primary" onClick={this.onAddPrevClick}>
            Efterregga
          </Button>
        </div>
        {this.state.displayAddForm &&
          <AddOneInterval
            onAdd={this.onAddOneInterval}
            onCancel={this.onCancelPrevClick}
            fullDay={hoursInDay}
            notes={notes}
          />
        }
        <IntervalList
          intervals={activeAndCurrentIntervals}
          onDelete={this.onDelete}
          onUpdate={this.onUpdate}
          notes={notes}
        />
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

  onCancelPrevClick = () => this.setState({ displayAddForm: false });

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
  notes: PropTypes.arrayOf(PropTypes.string)
};

CurrentIntervals.defaultProps = {
  activeInterval: null
};

const todayRange = getDayRange(Date.now());
function isToday({ startTime, endTime }) {
  const startedToday = startTime > todayRange.startTime;
  const endedToday = endTime > todayRange.startTime && endTime < todayRange.endTime;
  return startedToday || endedToday;
}

function mapStateToProps({ intervals: { items, timestamp }, userSettings }) {
  const notes = items
    .map(({ note }) => (note ? note.toLowerCase() : note))
    .filter((note) => note);

  return {
    timestamp,
    intervals: items,
    todaysIntervals: items.filter(isToday).filter(isComplete),
    activeInterval: items.find(isActive),
    userSettings,
    notes: [...new Set(notes)]
  };
}

export default connect(mapStateToProps, intervalActions)(CurrentIntervals);
