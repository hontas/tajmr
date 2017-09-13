import React from 'react';
import PropTypes from 'prop-types';

import IntervalListInput from './intervalListInput.jsx';
import * as types from '../../constants/propTypes';
import Trashcan from '../icons/Trashcan.jsx';
import { getTimePartsFromTimestamp } from '../../utils/time';
import Button from '../button/button.jsx';

class IntervalListItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { interval } = this.props;
    const { comment } = this.state;
    const text = typeof comment !== 'undefined' ? comment : interval.note;

    return (
      <li className="interval-list-item">
        <IntervalListInput timestamp={ interval.startTime } onUpdate={ this.updateProp('startTime') } />
        <IntervalListInput timestamp={ interval.endTime } onUpdate={ this.updateProp('endTime') } />

        <input className="interval-list-item-note"
          onChange={ this.onCommentChange }
          placeholder="Anteckning"
          value={ text }
          onBlur={ this.updateProp('note') } />

        <Button className="delete" onClick={ this.remove }>
          <Trashcan size={15} />
        </Button>
      </li>
    );
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

  onCommentChange = ({ target }) => {
    this.setState({ comment: target.value });
  }
}

IntervalListItem.propTypes = {
  interval: types.interval.isRequired,
  onDelete: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired
};

export default IntervalListItem;
