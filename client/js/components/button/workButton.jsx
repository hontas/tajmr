import React from 'react';
import PropTypes from 'prop-types';

import Button from './button.jsx';

export default class WorkButton extends React.Component {
  propTypes: {
    activeInterval: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired
  }

  render() {
    const { activeInterval } = this.props;
    const buttonText = activeInterval ? 'Ta en fika ▐▐' : 'Börja debitera ▶';

    return (
      <Button className="work-button" onClick={ this.props.onClick } text={ buttonText } />
    );
  }
};
