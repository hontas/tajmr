import React from 'react';
import PropTypes from 'prop-types';

import Button from './button.jsx';
import styles from './workButton.module.css';

const WorkButton = ({ isLoading = false, activeInterval, onClick, ...props }) => {
  const buttonText = activeInterval ? 'Ta en fika ▐▐' : 'Börja debitera ▶';

  return (
    <Button
      {...props}
      theme="primary"
      className={styles.workButton}
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
