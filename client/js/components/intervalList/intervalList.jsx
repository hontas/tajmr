import React from 'react';
import PropTypes from 'prop-types';

import * as customPropTypes from '../../constants/propTypes';
import IntervalListItem from './intervalListItem.jsx';
import './intervalList.css';

function sortBy(array, prop) {
  return array.slice().sort((a, b) => b[prop] - a[prop]);
}

const IntervalList = ({ intervals, onDelete, onUpdate, notes = [], ...props }) => (
  <ul {...props} className="interval-list">
    {sortBy(intervals, 'startTime').map((interval) => (
      <IntervalListItem
        key={interval.id}
        interval={interval}
        onDelete={onDelete}
        onUpdate={onUpdate}
        notes={notes}
      />
    ))}
  </ul>
);

IntervalList.propTypes = {
  intervals: customPropTypes.intervals.isRequired,
  onDelete: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  notes: PropTypes.arrayOf(PropTypes.string),
};

export default IntervalList;
