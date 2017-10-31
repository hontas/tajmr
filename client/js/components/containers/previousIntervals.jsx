import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import * as customPropTypes from '../../constants/propTypes';
import IntervalList from '../intervalList/intervalList.jsx';
import { attemptUpdate, attemptRemove } from '../../actions/intervals';

class PreviousIntervals extends React.PureComponent {
  render() {
    const { intervals, userSettings } = this.props;

    if (!userSettings.displayPreviousIntervals) return null;

    return (
      <div className="previous-intervals">
        <h3 className="previous-intervals__title">Tidigare</h3>
        <IntervalList intervals={intervals} onDelete={this.onDelete} onUpdate={this.onUpdate} />
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
}

function isNotToday({ startTime }) {
  const today = new Date();
  const date = new Date(startTime);

  return date.getDate() !== today.getDate();
}

PreviousIntervals.propTypes = {
  dispatch: PropTypes.func.isRequired,
  intervals: customPropTypes.intervals.isRequired,
  userSettings: customPropTypes.userSettings.isRequired
};

function mapStateToProps({ intervals, userSettings }) {
  const intervalList = Object.keys(intervals.items).map((id) => ({
    ...intervals.items[id],
    id
  }));

  return {
    userSettings,
    intervals: intervalList
      .filter(({ endTime }) => endTime) // is completed
      .filter(isNotToday)
  };
}

export default connect(mapStateToProps)(PreviousIntervals);
