import React, { PropTypes } from 'react';

import Button from '../button/button.jsx';
import { addInterval, completeInterval } from '../../actions';

export default React.createClass({
  propTypes: {
    activeInterval: PropTypes.shape({
      startTime: PropTypes.number.isRequired
    }),
    className: PropTypes.string,
    dispatch: PropTypes.func.isRequired
  },

  render() {
    const { activeInterval } = this.props;
    const buttonText = activeInterval ? 'Take a break ▐▐' : 'Start workin\' ▶';

    return (
      <Button onClick={ this.onClick } text={ buttonText } />
    );
  },

  onClick() {
    const { dispatch, activeInterval } = this.props;
    if (activeInterval) {
      dispatch(completeInterval(activeInterval));
    } else {
      dispatch(addInterval());
    }
  }
});
