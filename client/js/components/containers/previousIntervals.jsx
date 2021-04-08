import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as Sentry from '@sentry/react';

import * as customPropTypes from '../../constants/propTypes';
import IntervalList from '../intervalList/intervalList.jsx';
import Button from '../button/button.jsx';
import { attemptUpdate, attemptRemove } from '../../redux/intervals';
import { getWeek, getMonth, startOfDay } from '../../utils/time';
import { isComplete } from '../../utils/intervals';
import { ErrorBoundaryFallback } from '../ErrorBoundaryFallback.jsx';

const limits = {
  ZERO: 0,
  WEEK: 1,
  MONTH: 2,
  ALL: 3,
};

class PreviousIntervals extends React.Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    if (!prevState.limit && nextProps.userSettings.displayPreviousIntervals) {
      return { limit: limits.WEEK };
    }
    return null;
  }

  state = {
    limit: limits.ZERO,
  };

  render() {
    const { userSettings } = this.props;
    const { limit } = this.state;
    const intervals = this.getIntervals();
    const showMore = limit < limits.ALL;

    if (!userSettings.displayPreviousIntervals) return null;

    return (
      <div className="previous-intervals">
        <h3 className="previous-intervals__title">Tidigare</h3>
        <Sentry.ErrorBoundary fallback={ErrorBoundaryFallback}>
          <>
            <IntervalList intervals={intervals} onDelete={this.onDelete} onUpdate={this.onUpdate} />
            {showMore && (
              <Button
                className="previous-intervals__show-more"
                onClick={this.showMore}
                theme="primary"
              >
                Visa fler
              </Button>
            )}
          </>
        </Sentry.ErrorBoundary>
      </div>
    );
  }

  showMore = () => {
    this.setState(({ limit }) => ({ limit: limit + 1 }));
  };

  getIntervals = () => {
    const intervals = this.props.intervals
      .filter(isComplete)

      .filter(endedBeforeToday);
    switch (this.state.limit) {
      case limits.ALL:
        return intervals;
      case limits.MONTH:
        return intervals.filter(isSameMonth);
      default:
        return intervals.filter(isSameWeek);
    }
  };

  onDelete = (id) => {
    const { dispatch } = this.props;
    dispatch(attemptRemove(id));
  };

  onUpdate = (interval) => {
    const { dispatch } = this.props;
    dispatch(attemptUpdate(interval));
  };
}

PreviousIntervals.propTypes = {
  dispatch: PropTypes.func.isRequired,
  intervals: customPropTypes.intervals.isRequired,
  userSettings: customPropTypes.userSettings.isRequired,
};

const now = Date.now();
const today = startOfDay(now);
function endedBeforeToday({ endTime }) {
  return endTime < today;
}

const week = getWeek(now);
function isSameWeek({ startTime }) {
  return startTime > week.startTime && startTime < week.endTime;
}

const month = getMonth(now);
function isSameMonth({ startTime }) {
  return startTime > month.startTime && startTime < month.endTime;
}

function mapStateToProps({ intervals: { items }, userSettings }) {
  return {
    userSettings,
    intervals: items,
  };
}

export default connect(mapStateToProps)(PreviousIntervals);
