import * as React from 'react';
import { useSelector } from '#/store/useStore.jsx';
import UpdatePrompt from '#/components/updatePrompt/updatePrompt.jsx';
import Loader from './Loader.jsx';

import styles from './application.module.css';

const Navbar = React.lazy(
  () => import(/* webpackChunkName: "Navbar" */ '#/components/navbar/navbar.jsx'),
);
const Footer = React.lazy(
  () => import(/* webpackChunkName: "Footer" */ '#/components/footer/footer.jsx'),
);
const CurrentIntervals = React.lazy(
  () =>
    import(
      /* webpackChunkName: "CurrentIntervals" */ '#/components/containers/currentIntervals.jsx'
    ),
);
const PreviousIntervals = React.lazy(
  () =>
    import(
      /* webpackChunkName: "PreviousIntervals" */ '#/components/containers/previousIntervals.jsx'
    ),
);
const Login = React.lazy(() => import('#/components/auth/login.jsx'));

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
