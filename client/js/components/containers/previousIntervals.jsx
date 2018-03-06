import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import * as customPropTypes from '../../constants/propTypes';
import IntervalList from '../intervalList/intervalList.jsx';
import Button from '../button/button.jsx';
import { attemptUpdate, attemptRemove } from '../../actions/intervals';
import { getWeek, getMonth } from '../../utils/time';
import { isComplete } from '../../utils/intervals';

const limits = {
  WEEK: 1,
  MONTH: 2,
  ALL: 3
};

class PreviousIntervals extends React.Component {
  state = {
    limit: limits.WEEK
  };

  componentWillReceiveProps(nextProps) {
    if (!this.props.userSettings.displayPreviousIntervals && nextProps.userSettings.displayPreviousIntervals) {
      this.setState({ limit: limits.WEEK });
    }
  }

  render() {
    const { userSettings } = this.props;
    const { limit } = this.state;
    const intervals = this.getIntervals();
    const showMore = limit < limits.ALL;

    if (!userSettings.displayPreviousIntervals) return null;

    return (
      <div className="previous-intervals">
        <h3 className="previous-intervals__title">Tidigare</h3>
        <IntervalList intervals={intervals} onDelete={this.onDelete} onUpdate={this.onUpdate} />
        {showMore &&
          <Button className="previous-intervals__show-more" onClick={this.showMore} theme="primary">Visa fler</Button>
        }
      </div>
    );
  }

  showMore = () => {
    this.setState(({ limit }) => ({ limit: limit + 1 }));
  };

  getIntervals = () => {
    const intervals = this.props.intervals
      .filter(isComplete)
      .filter(hasEnded);
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
  }

  onUpdate = (interval) => {
    const { dispatch } = this.props;
    dispatch(attemptUpdate(interval));
  }
}

PreviousIntervals.propTypes = {
  dispatch: PropTypes.func.isRequired,
  intervals: customPropTypes.intervals.isRequired,
  userSettings: customPropTypes.userSettings.isRequired
};

const now = Date.now();
function hasEnded({ endTime }) {
  return endTime < now;
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
    intervals: items
  };
}

export default connect(mapStateToProps)(PreviousIntervals);
