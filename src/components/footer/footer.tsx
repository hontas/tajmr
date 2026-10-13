import { useEffect, useState } from 'react';
import classNames from 'classnames';

import Button from '#/components/button/button.tsx';
import Credits from '#/components/credits/credits.tsx';

import styles from './footer.module.css';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const Footer = () => {
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

  useEffect(() => {
    function onBeforeInstall(event: Event) {
      // Prevent the mini-infobar from appearing on mobile
      event.preventDefault();
      setBeforeInstallEvent(event as BeforeInstallPromptEvent);
    }

    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', onBeforeInstall);
  }, []);

  return (
    <footer
      className={classNames(styles.footer, { [styles.withInstall]: Boolean(beforeInstallEvent) })}
    >
      <Credits className={styles.credits} />

      {beforeInstallEvent && (
        <Button theme="primary" isLoading={installingPWA} onClick={installPWA}>
          {installingPWA ? 'Installerar appen' : 'Installera appen'}
        </Button>
      )}
    </footer>
  );
};

export default Footer;
