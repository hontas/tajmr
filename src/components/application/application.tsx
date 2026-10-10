import * as React from 'react';
import { useSelector } from '#/store/useStore.tsx';
import UpdatePrompt from '#/components/updatePrompt/updatePrompt.tsx';
import Loader from './Loader.tsx';

import styles from './application.module.css';

const Navbar = React.lazy(() => import('#/components/navbar/navbar.tsx'));
const Footer = React.lazy(() => import('#/components/footer/footer.tsx'));
const CurrentIntervals = React.lazy(() => import('#/components/containers/currentIntervals.tsx'));
const PreviousIntervals = React.lazy(() => import('#/components/containers/previousIntervals.tsx'));
const Login = React.lazy(() => import('#/components/auth/login.tsx'));

function Application() {
  const user = useSelector((state) => state.user);
  const initialized = useSelector((state) => state.app.initialized);

  return (
    <div className={styles.application}>
      <UpdatePrompt />
      <React.Suspense fallback={<Loader />}>
        {initialized ? (
          <>
            <Navbar />
            <main className={styles.main}>
              {user ? (
                <>
                  <CurrentIntervals />
                  <PreviousIntervals />
                </>
              ) : (
                <Login />
              )}
            </main>
            <Footer />
          </>
        ) : (
          <Loader />
        )}
      </React.Suspense>
    </div>
  );
}

export default Application;
