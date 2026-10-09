import * as React from 'react';
import { useSelector } from '../../hooks/useStore';
import UpdatePrompt from '../updatePrompt/updatePrompt.jsx';
import Loader from './Loader.jsx';

import styles from './application.module.css';

const Navbar = React.lazy(() => import(/* webpackChunkName: "Navbar" */ '../navbar/navbar.jsx'));
const Footer = React.lazy(() => import(/* webpackChunkName: "Footer" */ '../footer/footer.jsx'));
const CurrentIntervals = React.lazy(
  () => import(/* webpackChunkName: "CurrentIntervals" */ '../containers/currentIntervals.jsx'),
);
const PreviousIntervals = React.lazy(
  () => import(/* webpackChunkName: "PreviousIntervals" */ '../containers/previousIntervals.jsx'),
);
const Login = React.lazy(() => import('../auth/login.jsx'));

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
