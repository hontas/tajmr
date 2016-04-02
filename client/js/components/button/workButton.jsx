import React, { PropTypes } from 'react';

import Button from './button.jsx';

export default React.createClass({
  propTypes: {
    activeInterval: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired
  },

  render() {
    const { activeInterval } = this.props;
    const buttonText = activeInterval ? 'Ta en fika ▐▐' : 'Börja debitera ▶';

    return (
      <Button className="work-button" onClick={ this.props.onClick } text={ buttonText } />
    );
  }
});
