import React from 'react';
import PropTypes from 'prop-types';

import { getTimePartsFromTimestamp } from '../../utils/time';
import DatePicker from '../datepicker/index.jsx'; // 📅
import Button from '../button/button.jsx';

function debounce(fn, timeout = 400, thisArg) {
  let timeoutId;
  return function (...args) {
    const context = thisArg || this;
    if (timeoutId) {
      timeoutId = clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      fn.apply(context, args);
    }, timeout);
  };
}

export default React.createClass({
  propTypes: {
    endTime: PropTypes.number,
    id: PropTypes.string.isRequired,
    note: PropTypes.string,
    onDelete: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
    startTime: PropTypes.number.isRequired
  },

  getInitialState() {
    return {};
  },

  componentDidMount() {
    this.debouncedUpdate = debounce(this.onUpdate);
  },

  render() {
    const { startTime, endTime, note } = this.props;
    const { start, end, comment } = this.state;
    const { hours: hours1, minutes: minutes1 } = getTimePartsFromTimestamp(startTime);
    const { hours: hours2, minutes: minutes2 } = getTimePartsFromTimestamp(endTime);

    const startTimeString = start ? start : `${hours1}:${minutes1}`;
    const endTimeString = end ? end : `${hours2}:${minutes2}`;
    const text = comment ? comment : note;

    const getEndTimeAttributes = () => {
      if (endTime) {
        return {
          value: endTimeString,
          onChange: this.onEndChange
        };
      } else {
        return {
          value: 'active',
          disabled: true
        };
      }
    };

    return (
      <li className="interval-list-item">
        <DatePicker date={ startTime } />
        <input className="interval-list-item-time" onChange={ this.onStartChange } value={ startTimeString } />
        <input className="interval-list-item-time" { ...getEndTimeAttributes() } />

        <input className="interval-list-item-note" onChange={ this.onCommentChange } placeholder="Anteckning" value={ text } />
        <Button className="delete" onClick={ this.onDelete } text="⌫" />
      </li>
    );
  },

  validateTime(time) {
    return /^\d{2}:\d{2}$/.test(time);
  },

  getUpdatedTimeFor(updated, originalTime) {
    if (!updated) {
      return originalTime;
    } else if (!this.validateTime(updated)) {
      console.log('Wrong format %s - should be XX:XX where X is a positive integer', updated); // eslint-disable-line no-console
      return originalTime;
    }

    const date = new Date(originalTime);
    const [hours, minutes] = updated.split(':');

    date.setHours(hours);
    date.setMinutes(minutes);

    return date.getTime();
  },

  onUpdate() {
    const { id, note, startTime, endTime } = this.props;
    const { comment, start, end } = this.state;
    const text = comment || note || '';

    if ((start && !this.validateTime(start)) || (end && !this.validateTime(end))) {
      return;
    }

    this.props.onUpdate({
      id,
      note: text,
      startTime: this.getUpdatedTimeFor(start, startTime),
      endTime: this.getUpdatedTimeFor(end, endTime)
    });
  },

  onDelete() {
    this.props.onDelete(this.props.id);
  },

  onStartChange(evt) {
    this.setState({ start: evt.target.value }, this.debouncedUpdate);
  },

  onEndChange(evt) {
    this.setState({ end: evt.target.value }, this.debouncedUpdate);
  },

  onCommentChange(evt) {
    this.setState({ comment: evt.target.value }, this.debouncedUpdate);
  }
});
