import * as React from 'react';

import styles from './Error.module.css';

const Error = ({ error }: { error: string }) => <div className={styles.errorMsg}>⚠️ {error}</div>;

export default Error;
