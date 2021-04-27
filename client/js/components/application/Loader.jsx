import * as React from 'react';

import { Wave } from '../spinkit/spinkit.jsx';

import styles from './application.module.css';

const Loader = () => (
  <main className={styles.main}>
    <div className={styles.init} data-testid="app-init">
      <Wave color="rgba(255,255,255,.75)" size="50px" />
    </div>
  </main>
);

export default Loader;
