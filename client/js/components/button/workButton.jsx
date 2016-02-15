import React, { PropTypes } from 'react';

import Button from './button.jsx';
import { attemptUpdate, addInterval } from '../../actions/intervals';

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
    const buttonText = activeInterval ? 'Ta en fika ▐▐' : 'Börja debitera ▶';

    return (
      <Button onClick={ this.onClick } text={ buttonText } className="work-button" />
    );
  },

  onClick() {
    const { dispatch, activeInterval } = this.props;

    if (activeInterval) {
      const completeInterval = Object.assign({}, activeInterval, { endTime: Date.now() });
      return dispatch(attemptUpdate(completeInterval));
    }

    return dispatch(attemptUpdate({ startTime: Date.now() }));
  }
});
