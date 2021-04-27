import React, { useState } from 'react';
import PropTypes from 'prop-types';
import IntervalListItem from './intervalListItem.jsx';
import Save from '../icons/Save.jsx';
import Button from '../button/button.jsx';
import Error from '../error/Error.jsx';

import styles from './addOneInterval.module.css';

const startHour = 9;

const AddOneInterval = ({ notes, onCancel, onAdd, fullDay, ...rest }) => {
  const hours = parseInt(fullDay, 10);
  const minutes = Math.round(60 * (fullDay - hours));
  const [error, setError] = useState(null);
  const [interval, setInterval] = useState({
    startTime: getTimestampFromHMS(startHour),
    endTime: getTimestampFromHMS(startHour + hours, minutes),
    note: '',
  });

  const handleClickSubmit = (evt) => {
    evt.preventDefault();
    onAdd(interval)
      .then(() => setError(null))
      .catch(setError);
  };

  const onUpdate = (updatedInterval) => {
    setInterval(updatedInterval);
  };

  return (
    <>
      <form {...rest} className={styles.container} onSubmit={handleClickSubmit}>
        <IntervalListItem
          className={styles.intervalListItem}
          interval={interval}
          onUpdate={onUpdate}
          notes={notes}
        />
        <Button
          className={styles.saveBtn}
          data-testid="add-one-interval-save-btn"
          type="submit"
          theme="primary"
          onClick={handleClickSubmit}
        >
          <Save size={16} />
        </Button>
        <Button
          className={styles.cancelBtn}
          data-testid="add-one-interval-cancel-btn"
          theme="primary"
          onClick={onCancel}
        >
          ╳
        </Button>
      </form>
      {error && <Error error={error} />}
    </>
  );
};

function getTimestampFromHMS(hours, minutes = 0, seconds = 0) {
  const date = new Date();
  date.setHours(hours);
  date.setMinutes(minutes);
  date.setSeconds(seconds);
  return date.getTime();
}

AddOneInterval.propTypes = {
  onAdd: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  fullDay: PropTypes.number.isRequired,
  notes: PropTypes.arrayOf(PropTypes.string),
};

export default AddOneInterval;
