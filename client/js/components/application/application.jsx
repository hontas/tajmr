import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { addInterval, updateInterval, completeInterval, removeInterval } from '../../actions';
import Header from '../header/header.jsx';
import DigitalClock from '../digitalClock/digitalClock.jsx';
import Button from '../button/button.jsx';
import IntervalList from '../intervalList/intervalList.jsx';

function isToday({ startTime }) {
  const today = new Date();
  const date = new Date(startTime);

  return date.toLocaleDateString() === today.toLocaleDateString();
}

function isComplete({ endTime }) {
  return endTime;
}

function getTimeInterval({ startTime, endTime }) {
  return endTime - startTime;
}

function sum(res, curr) {
  return res + curr;
}

const Application = React.createClass({
  propTypes: {
    activeInterval: PropTypes.shape({
      startTime: PropTypes.number.isRequired
    }),
    dispatch: PropTypes.func.isRequired,
    intervals: PropTypes.arrayOf(PropTypes.object).isRequired
  },

  render() {
    const { intervals, activeInterval } = this.props;
    const intervalSum = intervals
      .filter(isToday)
      .filter(isComplete)
      .map(getTimeInterval)
      .reduce(sum, 0);

    const buttonText = activeInterval ? 'Take a break ▐▐' : 'Start workin\' ▶';

    return (
      <div className="application">
        <Header />
        <DigitalClock elapsed={ intervalSum } from={ activeInterval ? activeInterval.startTime : 0 } />
        <Button onClick={ this.onClick } text={ buttonText } />
        <IntervalList intervals={ intervals } onDelete={ this.onDelete } onUpdate={ this.onUpdate } />
      </div>
    );
  },

  onClick() {
    const { dispatch, activeInterval } = this.props;
    if (activeInterval) {
      dispatch(completeInterval(activeInterval));
    } else {
      dispatch(addInterval());
    }
  },

  onDelete(id) {
    const { dispatch } = this.props;
    dispatch(removeInterval(id));
  },

  onUpdate(interval) {
    const { dispatch } = this.props;
    dispatch(updateInterval(interval));
  }
});

function select({ intervals: intervalMap }) {
  const intervals = Object.keys(intervalMap).map((id) => intervalMap[id]);
  return {
    intervals,
    activeInterval: intervals.find((interval) => !interval.endTime)
  };
}

export default connect(select)(Application);
