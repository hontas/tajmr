import React from 'react';
import PropTypes from 'prop-types';

import IntervalListInput from './intervalListInput.jsx';
import * as customPropTypes from '../../constants/propTypes';
import Trashcan from '../icons/Trashcan.jsx';
import Button from '../button/button.jsx';

class IntervalListItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { interval: { startTime, endTime, note, notWork } } = this.props;
    const { comment } = this.state;
    const text = typeof comment !== 'undefined' ? comment : note;

    return (
      <li className="interval-list-item">
        <IntervalListInput timestamp={startTime} onUpdate={this.updateProp('startTime')} />
        <IntervalListInput timestamp={endTime} onUpdate={this.updateProp('endTime')} />

        <input
          className="interval-list-item__note"
          onChange={this.onCommentChange}
          placeholder="Anteckning"
          value={text}
          onBlur={this.updateProp('note')}
        />

        <input
          className="interval-list-item__no-work"
          type="checkbox"
          checked={notWork}
          onChange={this.onChecked('notWork')}
        />

        <Button className="delete" onClick={this.remove}>
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

  onCommentChange = ({ target }) => {
    this.setState({ comment: target.value });
  }
}

IntervalListItem.propTypes = {
  interval: customPropTypes.interval.isRequired,
  onDelete: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired
};

export default IntervalListItem;
