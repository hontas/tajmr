import React, { PropTypes } from 'react';

import { update, remove } from '../../utils/intervalsApi';
import IntervalListItem from './intervalListItem.jsx';
import { updateInterval, removeInterval } from '../../actions';

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
    dispatch: PropTypes.func.isRequired,
    intervals: PropTypes.arrayOf(PropTypes.object).isRequired,
    user: PropTypes.shape({
      id: PropTypes.string,
      username: PropTypes.string
    })
  },

  render() {
    const children = sortBy(this.props.intervals, 'startTime')
      .filter(sameDayOrActive)
      .map((interval) => <IntervalListItem { ...interval }
          key={ interval.id }
          onDelete={ this.onDelete }
          onUpdate={ this.onUpdate }/>);

    return (
      <ul className="interval-list">
        { children }
      </ul>
    );
  },

  onDelete(id) {
    const { dispatch, user } = this.props;
    if (user) {
      return remove(id)
        .then(() => dispatch(removeInterval(id)));
    }

    dispatch(removeInterval(id));
  },

  onUpdate(interval) {
    const { dispatch, user } = this.props;
    if (user) {
      return update(updateInterval(interval))
        .then((res) => dispatch(updateInterval(res)))
        .catch((err) => console.log('Failed to update interval', err));
    }

    dispatch(updateInterval(interval));
  }

});
