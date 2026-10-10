import React, { useState, useEffect } from 'react';

import Button from '../button/button.jsx';

import styles from './footer.module.css';

export default () => {
  const [beforeInstallEvent, setBeforeInstallEvent] = useState(null);
  const [installingPWA, setInstallingPWA] = useState(false);

  const installPWA = async () => {
    if (!beforeInstallEvent) return;

    setInstallingPWA(true);
    beforeInstallEvent.prompt();
    const { outcome } = await beforeInstallEvent.userChoice;
    if (outcome === 'accepted') {
      setBeforeInstallEvent(null);
    }
    setInstallingPWA(false);
  };

  function onBeforeInstall(event) {
    // Prevent the mini-infobar from appearing on mobile
    event.preventDefault();
    setBeforeInstallEvent(event);
  }

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', onBeforeInstall);
  }, []);

  return (
    <footer className={styles.footer}>
      <span>
        {'Built with '}
        <span className={styles.emoji}>❤</span>
        {' by '}
        <a className="animated" href="https://github.com/hontas">
          hontas
        </a>
      </span>

      {beforeInstallEvent && (
        <Button theme="primary" isLoading={installingPWA} onClick={installPWA}>
          {installingPWA ? 'Installing PWA' : 'Install PWA'}
        </Button>
      )}

      <a className="animated" href="https://github.com/hontas/tajmr.git">
        GitHub
      </a>
    </footer>
  );
};
