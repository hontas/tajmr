import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import * as customPropTypes from '../../constants/propTypes';
import IntervalList from '../intervalList/intervalList.jsx';
import { attemptUpdate, attemptRemove } from '../../actions/intervals';
import { startOfDay } from '../../utils/time';
import { isComplete } from '../../utils/intervals';

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

PreviousIntervals.propTypes = {
  dispatch: PropTypes.func.isRequired,
  intervals: customPropTypes.intervals.isRequired,
  userSettings: customPropTypes.userSettings.isRequired
};

const today = +startOfDay(Date.now());
function isNotToday({ endTime }) {
  return endTime < today;
}

function mapStateToProps({ intervals: { items }, userSettings }) {
  return {
    userSettings,
    intervals: items
      .filter(isComplete)
      .filter(isNotToday)
  };
}

export default connect(mapStateToProps)(PreviousIntervals);
