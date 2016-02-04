import React, { PropTypes } from 'react';

import Button from '../button/button.jsx';
import { attemptUpdate, addInterval, updateInterval } from '../../actions/intervals';

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

    if (activeInterval) {
      const completeInterval = Object.assign({}, activeInterval, { endTime: Date.now() });
      if (user) {
        return dispatch(attemptUpdate(completeInterval));
      }

      return dispatch(updateInterval(completeInterval));
    }

    if (user) {
      return dispatch(attemptUpdate({ startTime: Date.now() }));
    }

    dispatch(addInterval());
  }
});
