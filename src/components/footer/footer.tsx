import { useEffect, useState } from 'react';

import Button from '#/components/button/button.tsx';

import styles from './footer.module.css';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default () => {
  const [beforeInstallEvent, setBeforeInstallEvent] = useState<BeforeInstallPromptEvent | null>(
    null,
  );
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

  function onBeforeInstall(event: Event) {
    // Prevent the mini-infobar from appearing on mobile
    event.preventDefault();
    setBeforeInstallEvent(event as BeforeInstallPromptEvent);
  }

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', onBeforeInstall);
  }, []);

  return (
    <footer className={styles.footer}>
      <span>
        {'Gjord med '}
        <span className={styles.emoji}>❤</span>
        {' av '}
        <a className="animated" href="https://github.com/hontas">
          hontas
        </a>
      </span>

      {beforeInstallEvent && (
        <Button theme="primary" isLoading={installingPWA} onClick={installPWA}>
          {installingPWA ? 'Installerar appen' : 'Installera appen'}
        </Button>
      )}

      <a className="animated" href="https://github.com/hontas/tajmr.git">
        GitHub
      </a>
    </footer>
  );
};
