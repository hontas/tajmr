import React, { useState, useEffect } from 'react';

import Button from '../button/button.jsx';

import styles from './footer.module.css';

export default () => {
  const [beforeInstallEvent, setBeforeInstallEvent] = useState(null);
  const [installingPWA, setInstallingPWA] = useState(false);

  const installPWA = async () => {
    if (!beforeInstallEvent) return;

    // show spinner on install button
    setInstallingPWA(true);
    // Show the browser install prompt
    beforeInstallEvent.prompt();
    // Wait for the user to accept or dismiss the install prompt
    const { outcome } = await beforeInstallEvent.userChoice;
    // If the prompt was accepted, hide the install button
    if (outcome === 'accepted') {
      setBeforeInstallEvent(null);
    }
    setInstallingPWA(false);
  };

  function onBeforeInstall(event) {
    // Prevent the mini-infobar from appearing on mobile
    event.preventDefault();
    // Stash the event so it can be triggered later.
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
        <span className={styles.emoji} role="img" aria-label="heart">
          ❤
        </span>
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
