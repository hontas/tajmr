import React, { PropTypes } from 'react';
import store from '../store/store';
import IntervalListItem from './intervalListItem.jsx';

export default React.createClass({
  propTypes: {
    intervals: PropTypes.arrayOf(PropTypes.object).isRequired
  },

  render() {
    const children = this.props.intervals
      .map((interval) => <IntervalListItem { ...interval } key={ interval.id } onUpdate={ this.onUpdate } onDelete={ this.onDelete } />);

    return (
      <ul className="interval-list">
        { children }
      </ul>
    );
  },

  onDelete(id) {
    store.removeInterval(id);
  },

  onUpdate(interval) {
    store.updateInterval(interval);
  }
});
