import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Button from '../button/button.jsx';
import * as customTypes from '../../constants/propTypes';
import {
  getMonth,
  getHours,
  months
} from '../../utils/time';

class MonthReport extends Component {
  state = { referenceDate: new Date() };

  render() {
    const { referenceDate } = this.state;
    const { className } = this.props;
    const intervals = this.getGroupedIntervalsBy('note');
    const totalMinusNotWork = Object.keys(intervals)
      .filter((note) => !note.startsWith('notWork'))
      .reduce((res, curr) => res + intervals[curr], 0);

    return (
      <div className={classNames('MonthReport', className)}>
        <h2 className="MonthReport__title">Månadssammanställning</h2>
        <h3 className="MonthReport__subtitle">
          <Button onClick={this.lastMonth}>◀︎</Button>
          {`${months[referenceDate.getMonth()]} ${referenceDate.getFullYear()}`}
          <Button onClick={this.nextMonth}>▶︎</Button>
        </h3>
        <ul className="MonthReport__list">
          {Object.keys(intervals)
            .map((note) => (
              <li
                key={note}
                className={classNames('MonthReport__list-item', {
                  'not-work': note.startsWith('notWork')
                })}
              >
                <p className="MonthReport__list-item__title">{note}</p>
                <p className="MonthReport__list-item__value">
                  {`${getHours(intervals[note]).toFixed(1)}h`}
                </p>
              </li>
            ))
          }
          <li className="MonthReport__list-item">
            <p className="MonthReport__list-item__title">TOTAL (work):</p>
            <p className="MonthReport__list-item__value">
              {`${getHours(totalMinusNotWork).toFixed(1)}h`}
            </p>
          </li>
        </ul>
      </div>
    );
  }

  lastMonth = () => {
    const { referenceDate } = this.state;
    const newRefDate = new Date(referenceDate);
    newRefDate.setMonth(referenceDate.getMonth() - 1);
    this.setState({ referenceDate: newRefDate });
  };

  nextMonth = () => {
    const { referenceDate } = this.state;
    const newRefDate = new Date(referenceDate);
    newRefDate.setMonth(referenceDate.getMonth() + 1);
    this.setState({ referenceDate: newRefDate });
  };

  getGroupedIntervalsBy = (key) =>
    this.getMonthIntervals()
      .reduce((res, curr) => {
        let keyToBe = curr[key] ? curr[key] : 'undefined';
        if (curr.notWork) keyToBe = `notWork:${keyToBe}`;
        if (!res[keyToBe]) res[keyToBe] = 0;
        res[keyToBe] += (curr.endTime - curr.startTime);
        return res;
      }, {});

  getMonthIntervals = () => {
    const { startTime, endTime } = getMonth(this.state.referenceDate);
    return this.props.intervals
      .filter((interval) => interval.startTime > startTime && interval.startTime <= endTime);
  };
}

MonthReport.propTypes = {
  className: PropTypes.string,
  intervals: customTypes.intervals.isRequired,
};

export default MonthReport;
