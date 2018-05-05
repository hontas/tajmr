import React from 'react';
import PropTypes from 'prop-types';
import IntervalListItem from './intervalListItem.jsx';
import Save from '../icons/Save.jsx';
import Button from '../button/button.jsx';

class AddOneInterval extends React.Component {
  constructor(props) {
    super(props);
    const startHour = 9;
    const hours = parseInt(props.fullDay, 10);
    const minutes = Math.round(60 * (props.fullDay - hours));
    this.state = {
      interval: {
        startTime: getTimestampFromHMS(startHour),
        endTime: getTimestampFromHMS(startHour + hours, minutes),
        note: ''
      }
    };
  }

  render() {
    return (
      <form
        className="add-one-interval"
        onSubmit={this.onAdd}
      >
        <IntervalListItem
          className="add-one-interval__interval-list-item"
          interval={this.state.interval}
          onUpdate={this.onUpdate}
          onDelete={onDelete}
          notes={this.props.notes}
        />
        <Button
          type="submit"
          theme="primary"
          className="add-one-interval__btn"
        >
          <Save size={17} />
        </Button>
        <Button
          theme="secondary"
          className="add-one-interval__btn"
          onClick={this.props.onCancel}
        >
          ✖
        </Button>
      </form>
    );
  }

  onAdd = (evt) => {
    evt.preventDefault();
    this.props.onAdd(this.state.interval);
  }

  onCancel = () => {

  };

  onUpdate = (interval) => {
    this.setState({ interval });
  }
}

function onDelete() {}

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
  notes: PropTypes.arrayOf(PropTypes.string)
};

export default AddOneInterval;
