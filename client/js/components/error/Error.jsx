import * as React from 'react';
import PropTypes from 'prop-types';

import styles from './Error.module.css';

const Error = ({ error }) => <div className={styles.errorMsg}>⚠️ {error}</div>;

Error.propTypes = {
  error: PropTypes.string.isRequired,
};

export default Error;
