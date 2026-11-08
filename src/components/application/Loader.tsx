import * as React from 'react';

import { Wave } from '#/components/spinkit/spinkit.tsx';

import styles from './application.module.css';

const Loader = () => (
  <main className={styles.main}>
    <output className={styles.init} aria-label="Laddar appen">
      <Wave color="rgba(255,255,255,.75)" size="50px" />
    </output>
  </main>
);

export default Loader;
