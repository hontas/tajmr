import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import * as propTypes from '../../constants/propTypes';
import IntervalList from '../intervalList/intervalList.jsx';
import IntervalStats from '../intervalStats/intervalStats.jsx';
import { attemptUpdate, attemptRemove } from '../../actions/intervals';

const CurrentIntervals = React.createClass({
  propTypes: {
    dispatch: PropTypes.func.isRequired,
    intervals: propTypes.intervals.isRequired,
    userSettings: propTypes.userSettings.isRequired
  },

  render() {
    const { intervals, userSettings } = this.props;

    return userSettings.displayPreviousIntervals ? (
        <div className="previous-intervals">
          <h3>{ 'Tidigare' }</h3>
          <IntervalList intervals={ intervals } onDelete={ this.onDelete } onUpdate={ this.onUpdate } />
          <IntervalStats intervals={ intervals } />
        </div>
      ) : <div />;
  },

  onDelete(id) {
    const { dispatch } = this.props;
    dispatch(attemptRemove(id));
  },

  onUpdate(interval) {
    const { dispatch } = this.props;
    dispatch(attemptUpdate(interval));
  }
});

function isNotToday({ startTime }) {
  const today = new Date();
  const date = new Date(startTime);

  return date.getDate() !== today.getDate();
}

function mapStateToProps({ intervals, userSettings }) {
  return {
    userSettings,
    intervals: intervals.items
      .filter(({ endTime }) => endTime) // is completed
      .filter(isNotToday)
  };
}

export default connect(mapStateToProps)(CurrentIntervals);
