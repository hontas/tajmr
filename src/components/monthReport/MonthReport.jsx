import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Button from '#/components/button/button.jsx';
import useNow from '#/hooks/useNow.js';
import * as customTypes from '#/constants/propTypes.js';
import { getMonth, getHours, months, addMonths } from '#/utils/time.js';

import styles from './MonthReport.module.css';

const isNotWork = 'notwork';

const MonthReport = ({ className, intervals }) => {
  const now = useNow();
  const [referenceDate, setReferenceDate] = useState(() => new Date());
  const [filterOut, setFilterOut] = useState([]);

  const { startTime, endTime } = getMonth(referenceDate);
  const monthIntervals = intervals.filter(
    (interval) => interval.startTime > startTime && interval.startTime <= endTime,
  );
  const grouped = monthIntervals.reduce((res, curr) => {
    let keyToBe = curr.note ? curr.note.toLowerCase() : '-';
    if (curr.notWork) keyToBe = `${isNotWork}:${keyToBe}`;
    if (!res[keyToBe]) res[keyToBe] = 0;
    res[keyToBe] += (curr.endTime || now) - curr.startTime;
    return res;
  }, {});
  const categories = Object.keys(grouped).map((cat) => cat.toLowerCase());
  const filteredCategories = categories.filter((cat) => !filterOut.includes(cat));
  const totalMinusNotWork = filteredCategories.reduce((res, curr) => res + grouped[curr], 0);

  const toggleFilter = (cat) =>
    setFilterOut((current) =>
      current.includes(cat) ? current.filter((c) => c !== cat) : [...current, cat],
    );

  return (
    <div className={classNames(styles.container, className)}>
      <h2 className={styles.title}>Månadssammanställning</h2>
      <h3 className={styles.subtitle}>
        <Button
          className={styles.button}
          onClick={() => setReferenceDate((date) => addMonths(date, -1))}
        >
          ◀︎
        </Button>
        {`${months[referenceDate.getMonth()]} ${referenceDate.getFullYear()}`}
        <Button
          className={styles.button}
          onClick={() => setReferenceDate((date) => addMonths(date, 1))}
        >
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
            onClick={() => toggleFilter(cat)}
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
            <p className={styles.listItemValue}>{`${getHours(grouped[note]).toFixed(1)}h`}</p>
          </li>
        ))}
        <li className={styles.listItem}>
          <p className={styles.listItemTitle}>TOTAL:</p>
          <p className={styles.listItemValue}>{`${getHours(totalMinusNotWork).toFixed(1)}h`}</p>
        </li>
      </ul>
    </div>
  );
};

MonthReport.propTypes = {
  className: PropTypes.string,
  intervals: customTypes.intervals.isRequired,
};

export default MonthReport;
