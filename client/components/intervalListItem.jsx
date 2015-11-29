import React, { PropTypes } from 'react';
import { getTimePartsFromTimestamp } from '../utils/time';
import Button from './button.jsx';

export default React.createClass({
  propTypes: {
    startedWorkingAt: PropTypes.number.isRequired,
    stoppedWorkingAt: PropTypes.number.isRequired,
    note: PropTypes.string
  },

  render() {
    const { startedWorkingAt, stoppedWorkingAt, note } = this.props;
    const { hours: hours1, minutes: minutes1 } = getTimePartsFromTimestamp(startedWorkingAt);
    const { hours: hours2, minutes: minutes2 } = getTimePartsFromTimestamp(stoppedWorkingAt);

    return (
      <li className="interval-list-item">
        <input value={ `${hours1}:${minutes1}` } className="interval-list-item-time" onChange={ this.onChange } />
        <input value={ `${hours2}:${minutes2}` } className="interval-list-item-time" onChange={ this.onChange } />
        <input value={ note } className="interval-list-item-note" placeholder="Anteckning" onChange={ this.onChange } />
        <Button onClick={ this.onUpdate } text="Uppdatera" />
      </li>
    );
  },

  onUpdate() {
    console.log(this.props.id);
  },

  onChange(evt) {
    console.log(evt);
  }
});
