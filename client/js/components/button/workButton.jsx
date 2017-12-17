import React from 'react';
import PropTypes from 'prop-types';

import Button from './button.jsx';

const WorkButton = ({ activeInterval, onClick }) => {
  const buttonText = activeInterval ? 'Ta en fika ▐▐' : 'Börja debitera ▶';

  return (
    <Button type="primary" className="work-button" onClick={onClick} text={buttonText} />
  );
};

WorkButton.propTypes = {
  activeInterval: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired
};

export default WorkButton;
