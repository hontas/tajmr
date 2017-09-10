import React from 'react';
import PropTypes from 'prop-types';

import * as propTypes from '../../constants/propTypes';
import IntervalListItem from './intervalListItem.jsx';

function sortBy(array, prop) {
  return array.slice().sort((a, b) => {
    return b[prop] - a[prop];
  });
}

const IntervalList = ({ intervals, onDelete, onUpdate }) => {
  const children = sortBy(intervals, 'startTime')
    .map((interval) => <IntervalListItem { ...interval }
        key={ interval.id }
        onDelete={ onDelete }
        onUpdate={ onUpdate } />);

  return (
    <ul className="interval-list">
      { children }
    </ul>
  );
};

IntervalList.propTypes = {
  intervals: propTypes.intervals.isRequired,
  onDelete: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired
};

export default IntervalList;
