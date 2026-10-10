import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import IntervalListInput from './intervalListInput.jsx';
import * as customPropTypes from '#/constants/propTypes.js';
import Trashcan from '#/components/icons/Trashcan.jsx';
import Button from '#/components/button/button.jsx';
import AutoComplete from '#/components/autoComplete/AutoComplete.jsx';

import styles from './intervalListItem.module.css';

const IntervalListItem = ({ notes, onDelete, onUpdate, className, interval }) => {
  const { startTime, endTime, note, notWork } = interval;
  const updateProp =
    (prop) =>
    ({ target: { value } }) =>
      onUpdate({ ...interval, [prop]: value });

  return (
    <li className={classNames(styles.container, className)} data-testid="interval-item">
      <IntervalListInput
        dataTestId="interval-from-input"
        titlePrefix="from"
        timestamp={startTime}
        onUpdate={updateProp('startTime')}
      />

      <IntervalListInput
        dataTestId="interval-end-input"
        titlePrefix="end"
        timestamp={endTime}
        onUpdate={updateProp('endTime')}
      />

      <AutoComplete
        dataTestId="interval-note-input"
        className={styles.note}
        placeholder="Anteckning"
        onChange={updateProp('note')}
        value={note}
        notes={notes}
      />

      <input
        data-testid="interval-not-work-checkbox"
        className={styles.notWork}
        type="checkbox"
        title="not work"
        checked={notWork || false}
        onChange={({ target: { checked } }) => onUpdate({ ...interval, notWork: checked })}
      />

      {onDelete && (
        <Button
          className={styles.deleteBtn}
          theme="danger"
          title="remove"
          data-testid="remove-interval"
          onClick={() => onDelete(interval.id)}
        >
          <Trashcan size={15} />
        </Button>
      )}
    </li>
  );
};

IntervalListItem.propTypes = {
  interval: customPropTypes.interval.isRequired,
  onDelete: PropTypes.func,
  onUpdate: PropTypes.func.isRequired,
  notes: PropTypes.arrayOf(PropTypes.string),
  className: PropTypes.string,
};

export default IntervalListItem;
