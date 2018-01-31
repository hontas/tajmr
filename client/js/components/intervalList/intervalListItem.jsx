import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import IntervalListInput from './intervalListInput.jsx';
import * as customPropTypes from '../../constants/propTypes';
import Trashcan from '../icons/Trashcan.jsx';
import Button from '../button/button.jsx';
import AutoComplete from '../autoComplete/AutoComplete.jsx';

class IntervalListItem extends React.Component {
  render() {
    const {
      notes,
      className,
      interval: { startTime, endTime, note, notWork }
    } = this.props;

    return (
      <li className={classNames('interval-list-item', className)}>
        <IntervalListInput timestamp={startTime} onUpdate={this.updateProp('startTime')} />
        <IntervalListInput timestamp={endTime} onUpdate={this.updateProp('endTime')} />

        <AutoComplete
          className="interval-list-item__note"
          placeholder="Anteckning"
          onChange={this.updateProp('note')}
          value={note}
          notes={notes}
        />

        <input
          className="interval-list-item__no-work"
          type="checkbox"
          checked={notWork || false}
          onChange={this.onChecked('notWork')}
        />

        <Button className="delete" theme="danger" onClick={this.remove}>
          <Trashcan size={15} />
        </Button>
      </li>
    );
  }

  onChecked = (prop) => ({ target: { checked } }) => {
    const { interval, onUpdate } = this.props;
    onUpdate({
      ...interval,
      [prop]: checked
    });
  }

  updateProp = (prop) => ({ target: { value } }) => {
    const { interval, onUpdate } = this.props;
    onUpdate({
      ...interval,
      [prop]: value
    });
  }

  remove = () => {
    const { onDelete, interval } = this.props;
    onDelete(interval.id);
  }
}

IntervalListItem.propTypes = {
  interval: customPropTypes.interval.isRequired,
  onDelete: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  notes: PropTypes.arrayOf(PropTypes.string),
  className: PropTypes.string
};

export default IntervalListItem;
