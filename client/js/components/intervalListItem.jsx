import React, { PropTypes } from 'react';
import { getTimePartsFromTimestamp } from '../utils/time';
import Button from './button.jsx';

export default React.createClass({
  propTypes: {
    startedWorkingAt: PropTypes.number.isRequired,
    stoppedWorkingAt: PropTypes.number.isRequired,
    onUpdate: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    note: PropTypes.string
  },

  getInitialState() {
    return {};
  },

  render() {
    const { startedWorkingAt, stoppedWorkingAt, note } = this.props;
    const { start, end, comment } = this.state;
    const { hours: hours1, minutes: minutes1 } = getTimePartsFromTimestamp(startedWorkingAt);
    const { hours: hours2, minutes: minutes2 } = getTimePartsFromTimestamp(stoppedWorkingAt);

    const startTime = start ? start : `${hours1}:${minutes1}`;
    const endTime = end ? end : `${hours2}:${minutes2}`;
    const text = comment ? comment : note;

    return (
      <li className="interval-list-item">
        <input value={ startTime } className="interval-list-item-time" onChange={ this.onStartChange } />
        <input value={ endTime } className="interval-list-item-time" onChange={ this.onEndChange } />
        <input value={ text } className="interval-list-item-note" placeholder="Anteckning" onChange={ this.onCommentChange } />
        <Button className="update" onClick={ this.onUpdate } text="Uppdatera" />
        <Button className="delete" onClick={ this.onDelete } text="⌫" />
      </li>
    );
  },

  onUpdate() {
    const { id, note, startedWorkingAt, stoppedWorkingAt } = this.props;
    const { comment, start, end } = this.state;
    const text = comment || note || '';

    this.props.onUpdate({
      id,
      note: text,
      startedWorkingAt: this.getUpdatedTimeFor(start, startedWorkingAt),
      stoppedWorkingAt: this.getUpdatedTimeFor(end, stoppedWorkingAt)
    });
  },

  onDelete() {
    this.props.onDelete(this.props.id);
  },

  onStartChange(evt) {
    this.setState({ start: evt.target.value });
  },

  onEndChange(evt) {
    this.setState({ end: evt.target.value });
  },

  onCommentChange(evt) {
    this.setState({ comment: evt.target.value });
  },

  getUpdatedTimeFor(updated, originalTime) {
    if (!updated) {
      return originalTime;
    } else if (!/^\d{2}\:\d{2}$/.test(updated)) {
      console.log('Wrong format %s - should be XX:XX where X is a positive integer', updated);
      return originalTime;
    }

    const date = new Date(originalTime);
    const [hours, minutes] = updated.split(':');

    date.setHours(hours);
    date.setMinutes(minutes);

    return date.getTime();
  }
});
