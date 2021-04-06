import React from 'react';
import PropTypes from 'prop-types';

import Button from './button.jsx';

const WorkButton = ({ isLoading = false, activeInterval, onClick, ...props }) => {
  const buttonText = activeInterval ? 'Ta en fika ▐▐' : 'Börja debitera ▶';

  return (
    <Button
      {...props}
      theme="primary"
      className="work-button"
      onClick={onClick}
      text={buttonText}
      disabled={isLoading}
    />
  );
};

WorkButton.propTypes = {
  activeInterval: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

export default WorkButton;
