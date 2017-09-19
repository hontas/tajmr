import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import PureUpdatedAtComponent from '../PureUpdatedAtComponent.jsx';
import * as propTypes from '../../constants/propTypes';
import IntervalList from '../intervalList/intervalList.jsx';
import IntervalStats from '../intervalStats/intervalStats.jsx';
import { attemptUpdate, attemptRemove } from '../../actions/intervals';

class PreviousIntervals extends PureUpdatedAtComponent {
  render() {
    const { intervals, userSettings } = this.props;

    return userSettings.displayPreviousIntervals ? (
        <div className="previous-intervals">
          <h3 className="previous-intervals__title">{ 'Tidigare' }</h3>
          <IntervalList intervals={ intervals } onDelete={ this.onDelete } onUpdate={ this.onUpdate } />
        </div>
      ) : <div />;
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
  ...PureUpdatedAtComponent.propTypes,
  dispatch: PropTypes.func.isRequired,
  intervals: propTypes.intervals.isRequired,
  userSettings: propTypes.userSettings.isRequired
}

function mapStateToProps({ intervals, userSettings }) {
  const intervalList = Object.keys(intervals.items).map((id) => ({
    ...intervals.items[id],
    id
  }));

  const updatedAt = Math.max(intervals.updatedAt, userSettings.updatedAt);

  return {
    updatedAt,
    userSettings,
    intervals: intervalList
      .filter(({ endTime }) => endTime) // is completed
      .filter(isNotToday)
  };
}

export default connect(mapStateToProps)(PreviousIntervals);
