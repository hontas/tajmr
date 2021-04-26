import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import IntervalListInput from './intervalListInput.jsx';
import * as customPropTypes from '../../constants/propTypes';
import Trashcan from '../icons/Trashcan.jsx';
import Button from '../button/button.jsx';
import AutoComplete from '../autoComplete/AutoComplete.jsx';

import styles from './intervalListItem.module.css';

class IntervalListItem extends React.Component {
  render() {
    const {
      notes,
      onDelete,
      className,
      interval: { startTime, endTime, note, notWork },
    } = this.props;

    return (
      <li className={classNames(styles.container, className)} data-testid="interval-item">
        <IntervalListInput
          dataTestId="interval-from-input"
          titlePrefix="from"
          timestamp={startTime}
          onUpdate={this.updateProp('startTime')}
        />

        <IntervalListInput
          dataTestId="interval-end-input"
          titlePrefix="end"
          timestamp={endTime}
          onUpdate={this.updateProp('endTime')}
        />

        <AutoComplete
          dataTestId="interval-note-input"
          className={styles.note}
          placeholder="Anteckning"
          onChange={this.updateProp('note')}
          value={note}
          notes={notes}
        />

        <input
          data-testid="interval-not-work-checkbox"
          className={styles.notWork}
          type="checkbox"
          title="not work"
          checked={notWork || false}
          onChange={this.onChecked('notWork')}
        />

        {onDelete && (
          <Button
            className={styles.deleteBtn}
            theme="danger"
            title="remove"
            data-testid="remove-interval"
            onClick={this.remove}
          >
            <Trashcan size={15} />
          </Button>
        )}
      </li>
    );
  }

  onChecked = (prop) => ({ target: { checked } }) => {
    const { interval, onUpdate } = this.props;
    onUpdate({
      ...interval,
      [prop]: checked,
    });
  };

  updateProp = (prop) => ({ target: { value } }) => {
    const { interval, onUpdate } = this.props;
    onUpdate({
      ...interval,
      [prop]: value,
    });
  };

  remove = () => {
    const { onDelete, interval } = this.props;
    onDelete(interval.id);
  };
}

IntervalListItem.propTypes = {
  interval: customPropTypes.interval.isRequired,
  onDelete: PropTypes.func,
  onUpdate: PropTypes.func.isRequired,
  notes: PropTypes.arrayOf(PropTypes.string),
  className: PropTypes.string,
};

export default IntervalListItem;
