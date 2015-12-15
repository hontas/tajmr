import React, { PropTypes } from 'react';
import IntervalListItem from './intervalListItem.jsx';

const last24Hours = (Date.now() - 1000 * 3600 * 24);

function sortBy(array, prop) {
  return array.slice().sort((a, b) => {
    return b[prop] - a[prop];
  });
}

function sameDayOrActive(interval) {
  return !interval.endTime || interval.startTime > last24Hours;
}

export default React.createClass({
  propTypes: {
    intervals: PropTypes.arrayOf(PropTypes.object).isRequired,
    onDelete: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired
  },

  render() {
    const { onUpdate, onDelete } = this.props;
    const children = sortBy(this.props.intervals, 'startTime')
      .filter(sameDayOrActive)
      .map((interval) => <IntervalListItem { ...interval }
          key={ interval.id }
          onDelete={ onDelete }
          onUpdate={ onUpdate }/>);

    return (
      <ul className="interval-list">
        { children }
      </ul>
    );
  }
});
