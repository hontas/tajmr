import React, { PropTypes } from 'react';
import Spinner from 'react-spinkit';

import { remove } from '../../utils/intervalsApi';
import IntervalListItem from './intervalListItem.jsx';
import { attemptUpdate, updateInterval, removeInterval } from '../../actions/intervals';

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
    isFetching: PropTypes.bool,
    user: PropTypes.shape({
      id: PropTypes.string,
      username: PropTypes.string
    })
  },

  render() {
    const { intervals, isFetching } = this.props;
    const children = sortBy(intervals, 'startTime')
      .filter(sameDayOrActive)
      .map((interval) => <IntervalListItem { ...interval }
          key={ interval.id }
          onDelete={ this.onDelete }
          onUpdate={ this.onUpdate }/>);

    return (
      <ul className="interval-list">
        { !isFetching ? children :
          <div style={ { textAlign: 'center' } }>
            <Spinner noFadeIn spinnerName="three-bounce" />
            <p>{ 'Loading intervals' }</p>
          </div>
        }
      </ul>
    );
  },

  onDelete(id) {
    const { dispatch, user } = this.props;

    if (user) {
      return remove(id);
    }

    dispatch(removeInterval(id));
  },

  onUpdate(interval) {
    const { dispatch, user } = this.props;

    dispatch(updateInterval(interval));

    if (user) {
      dispatch(attemptUpdate(interval));
    }
  }

});
