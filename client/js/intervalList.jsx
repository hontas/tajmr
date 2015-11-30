import React, { PropTypes } from 'react';
import store from '../store/store';
import IntervalListItem from './intervalListItem.jsx';

const IntervalList = ({ intervals }) => {

  const children = intervals
    .filter(({ startedWorkingAt, stoppedWorkingAt }) => startedWorkingAt && stoppedWorkingAt)
    .map((interval) => <IntervalListItem { ...interval } key={ interval.id } />);

  return (
    <ul className="interval-list">
      { children }
    </ul>
  );
};

IntervalList.propTypes = {
  intervals: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default IntervalList;
