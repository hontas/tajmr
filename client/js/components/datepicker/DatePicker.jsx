import React from 'react';
import PropTypes from 'prop-types';
import DayPicker from 'react-day-picker';
import classNames from 'classnames';

// 📅
import Calendar from '../icons/Calendar.jsx';

class DatePicker extends React.Component {
  state = { isHovered: false };

  render() {
    const { className, date, onDayClick } = this.props;
    const { isHovered } = this.state;
    return (
      <div
        className={classNames('date-picker', className, { 'date-picker--disabled': !date })}
        onFocus={this.onMouseOver}
        onBlur={this.onMouseOut}
        role="button"
        tabIndex="-1"
      >
        <div className="date-picker__icon">
          <Calendar />
        </div>
        { isHovered && date &&
          <DayPicker
            initialMonth={new Date(date)}
            canChangeMonth={false}
            className="date-picker__calendar"
            enableOutsideDays
            firstDayOfWeek={1}
            selectedDays={new Date(date)}
            onDayClick={onDayClick}
          />
        }
      </div>
    );
  }

  onMouseOver = () => this.setState({ isHovered: true });
  onMouseOut = () => this.setState({ isHovered: false });
}

DatePicker.defaultProps = {
  className: '',
  date: null
};

DatePicker.propTypes = {
  className: PropTypes.string,
  date: PropTypes.number,
  onDayClick: PropTypes.func.isRequired
};

export default DatePicker;
