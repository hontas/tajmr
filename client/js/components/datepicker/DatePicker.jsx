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
        onClick={this.toggleDateInput}
        onKeyDown={this.toggleDateInput}
        role="button"
        tabIndex="-1"
      >
        <div className="date-picker__icon">
          <Calendar />
        </div>
        { date && showDateInput &&
          <DayPicker
            initialMonth={new Date(date)}
            className="date-picker__calendar"
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

    if (!showDateInput) {
      const clickHandler = ({ target }) => {
        if (!this.datePicker.contains(target)) {
          this.toggleDateInput({ preventDefault() {} });
        }
        document.removeEventListener('click', clickHandler);
      };
      document.addEventListener('click', clickHandler, false);
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
