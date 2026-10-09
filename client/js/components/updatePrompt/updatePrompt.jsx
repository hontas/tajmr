import React, { useEffect, useRef, useState } from 'react';

import Button from '../button/button.jsx';
import registerServiceWorker from '../../register-sw';

import styles from './updatePrompt.module.css';

export default function UpdatePrompt() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const update = useRef(() => Promise.resolve());

  useEffect(() => {
    update.current = registerServiceWorker({ onNeedRefresh: () => setUpdateAvailable(true) });
  }, []);

  if (!updateAvailable) return null;

  return (
    <output className={styles.toast} data-testid="update-prompt">
      <span className={styles.message}>En ny version av appen finns</span>
      <div className={styles.actions}>
        <Button
          className={styles.later}
          theme="link"
          text="Senare"
          onClick={() => setUpdateAvailable(false)}
        />
        <Button className={styles.update} text="Uppdatera" onClick={() => update.current(true)} />
      </div>
    </output>
  );
}
