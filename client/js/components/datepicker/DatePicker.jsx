import React from 'react';
import PropTypes from 'prop-types';
import DayPicker from 'react-day-picker';
import classNames from 'classnames';

// 📅
import Calendar from '../icons/Calendar.jsx';

class DatePicker extends React.Component {
  state = { showDateInput: false };

  render() {
    const { className, date, onDayClick } = this.props;
    const { showDateInput } = this.state;
    return (
      <div
        className={classNames('date-picker', className, {
          'date-picker--disabled': !date,
          'date-picker--show-picker': showDateInput
        })}
        ref={(node) => { this.datePicker = node; }}
      >
        <button type="button" className="date-picker__calendar-btn" onClick={this.toggleDateInput}>
          <Calendar />
        </button>
        { date && showDateInput &&
          <DayPicker
            className="date-picker__calendar"
            initialMonth={new Date(date)}
            showOutsideDays
            firstDayOfWeek={1}
            selectedDays={new Date(date)}
            onDayClick={onDayClick}
          />
        }
      </div>
    );
  }

  toggleDateInput = (evt) => {
    evt.preventDefault();
    const { showDateInput } = this.state;
    this.setState({ showDateInput: !showDateInput });

    if (!showDateInput && !this.handleOutsideClick) {
      const clickHandler = ({ target }) => {
        if (!this.datePicker.contains(target)) {
          this.setState({ showDateInput: false });
          document.removeEventListener('click', clickHandler);
        }
      };
      this.handleOutsideClick = clickHandler;
      document.addEventListener('click', clickHandler, false);
    } else {
      document.removeEventListener('click', this.handleOutsideClick);
      this.handleOutsideClick = null;
    }
  };
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
