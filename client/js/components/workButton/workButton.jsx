import React, { PropTypes } from 'react';

import { start, update } from '../../utils/intervalsApi';
import Button from '../button/button.jsx';
import { addInterval, completeInterval } from '../../actions/intervals';

export default React.createClass({
  propTypes: {
    activeInterval: PropTypes.shape({
      startTime: PropTypes.number.isRequired
    }),
    className: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    user: PropTypes.object
  },

  render() {
    const { activeInterval } = this.props;
    const buttonText = activeInterval ? 'Take a break ▐▐' : 'Start workin\' ▶';

    return (
      <Button onClick={ this.onClick } text={ buttonText } />
    );
  },

  onClick() {
    const { dispatch, activeInterval, user } = this.props;

    if (activeInterval && user) {
      const updateAction = completeInterval(activeInterval);
      dispatch(updateAction);
      return update(updateAction)
        .catch((err) => console.log('Failed to update interval', err));
    }

    if (activeInterval) {
      return dispatch(completeInterval(activeInterval));
    }

    if (user) {
      return start(addInterval())
        .then((res) => dispatch(addInterval(res)))
        .catch((err) => console.log('Failed to create interval', err));
    }

    dispatch(addInterval());
  }
});
