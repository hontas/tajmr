import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Button from '../button/button.jsx';
import * as customTypes from '../../constants/propTypes';
import { getMonth, getHours, months } from '../../utils/time';

import styles from './MonthReport.module.css';

const isNotWork = 'notwork';

class MonthReport extends Component {
  state = {
    referenceDate: new Date(),
    filterOut: [],
  };

  render() {
    const { referenceDate, filterOut } = this.state;
    const { className } = this.props;
    const intervals = this.getGroupedIntervalsBy('note');
    const categories = Object.keys(intervals).map((cat) => cat.toLowerCase());
    const filteredCategories = categories.filter((cat) => !filterOut.includes(cat));
    const totalMinusNotWork = filteredCategories.reduce((res, curr) => res + intervals[curr], 0);

    return (
      <div className={classNames(styles.container, className)}>
        <h2 className={styles.title}>Månadssammanställning</h2>
        <h3 className={styles.subtitle}>
          <Button className={styles.button} onClick={this.lastMonth}>
            ◀︎
          </Button>
          {`${months[referenceDate.getMonth()]} ${referenceDate.getFullYear()}`}
          <Button className={styles.button} onClick={this.nextMonth}>
            ▶︎
          </Button>
        </h3>
        <div className={styles.filters}>
          {categories.map((cat) => (
            <Button
              className={classNames(styles.filter, {
                [styles.filterActive]: filteredCategories.includes(cat),
              })}
              key={cat}
              onClick={() => this.toggleFilter(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>
        <ul className={styles.list}>
          {filteredCategories.map((note) => (
            <li
              key={note}
              className={classNames(styles.listItem, {
                [styles.notWork]: note.startsWith(isNotWork),
              })}
            >
              <p className={styles.listItemTitle}>{note}</p>
              <p className={styles.listItemValue}>{`${getHours(intervals[note]).toFixed(1)}h`}</p>
            </li>
          ))}
          <li className={styles.listItem}>
            <p className={styles.listItemTitle}>TOTAL:</p>
            <p className={styles.listItemValue}>{`${getHours(totalMinusNotWork).toFixed(1)}h`}</p>
          </li>
        </ul>
      </div>
    );
  }

  toggleFilter = (cat) => {
    if (this.state.filterOut.includes(cat)) {
      this.setState((state) => ({ filterOut: state.filterOut.filter((c) => c !== cat) }));
    } else {
      this.setState((state) => ({ filterOut: [...state.filterOut, cat] }));
    }
  };

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
    this.getMonthIntervals().reduce((res, curr) => {
      let keyToBe = curr[key] ? curr[key].toLowerCase() : '-';
      if (curr.notWork) keyToBe = `${isNotWork}:${keyToBe}`;
      if (!res[keyToBe]) res[keyToBe] = 0;
      res[keyToBe] += (curr.endTime || Date.now()) - curr.startTime;
      return res;
    }, {});

  getMonthIntervals = () => {
    const { referenceDate } = this.state;
    const { intervals } = this.props;
    const { startTime, endTime } = getMonth(referenceDate);
    return intervals.filter(
      (interval) => interval.startTime > startTime && interval.startTime <= endTime
    );
  };
}

MonthReport.propTypes = {
  className: PropTypes.string,
  intervals: customTypes.intervals.isRequired,
};

export default MonthReport;
