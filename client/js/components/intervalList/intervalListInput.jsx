import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import DatePicker from '../datepicker/DatePicker.jsx';
import { getTimeString } from '../../utils/time';

function stateFromProps(props) {
  const isActive = !props.timestamp;
  const value = isActive ? 'active' : getTimeString(props.timestamp);
  return { value, isActive, isValid: true };
}

class IntervalListInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = stateFromProps(props);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.timestamp === this.props.timestamp) return;
    this.setState(stateFromProps(newProps));
  }

  render() {
    const { className, timestamp } = this.props;
    const { value, isActive, isValid } = this.state;
    const baseClassName = 'interval-list-input';
    const variationClass = isValid ? '' : `${baseClassName}--error`;

    return (
      <div className={classNames(baseClassName, className, variationClass)}>
        <input
          className={`${baseClassName}__input`}
          disabled={isActive}
          onBlur={this.validateAndPush}
          onChange={this.handleChange}
          value={value}
        />
        <DatePicker
          className={`${baseClassName}__date`}
          date={timestamp}
          onDayClick={this.handleDateChange}
        />
      </div>
    );
  }

  validateAndPush = () => {
    const { value } = this.state;
    const isValid = validateTimeString(value);
    if (isValid) {
      const { timestamp, onUpdate } = this.props;
      const [hours, minutes] = value.split(':');
      const date = new Date(timestamp);

      date.setHours(hours);
      date.setMinutes(minutes);
      onUpdate({ target: { value: date.getTime() } });
    } else {
      // eslint-disable-next-line no-console
      console.log('Wrong format %s - should be XX:XX where X is a positive integer', value);
    }
    this.setState({ isValid });
  }

  handleDateChange = (value) => {
    const { timestamp, onUpdate } = this.props;
    const currentDate = new Date(timestamp);
    const nextDate = new Date(value);
    currentDate.setDate(nextDate.getDate());

    onUpdate({ target: { value: currentDate.getTime() } });
  }

  handleChange = ({ target: { value } }) => {
    this.setState({ value });
  }
}

function validateTimeString(time) {
  const [hours, minutes] = time.split(':')
    .map((v) => parseInt(v, 10));
  return hours >= 0 && hours < 24 &&
    minutes >= 0 && minutes < 60 &&
    /^\d{2}:\d{2}$/.test(time);
}

IntervalListInput.defaultProps = {
  className: ''
};

IntervalListInput.propTypes = {
  className: PropTypes.string,
  timestamp: PropTypes.number.isRequired,
  onUpdate: PropTypes.func.isRequired
};

export default IntervalListInput;