import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Notifications from '../Notifications/Notifications.jsx';

import Loader from './Loader.jsx';
import styles from './application.module.css';

const Navbar = React.lazy(() => import(/* webpackChunkName: "Navbar" */ '../navbar/navbar.jsx'));
const Footer = React.lazy(() => import(/* webpackChunkName: "Footer" */ '../footer/footer.jsx'));
const CurrentIntervals = React.lazy(() =>
  import(/* webpackChunkName: "CurrentIntervals" */ '../containers/currentIntervals.jsx')
);
const PreviousIntervals = React.lazy(() =>
  import(/* webpackChunkName: "PreviousIntervals" */ '../containers/previousIntervals.jsx')
);
const Login = React.lazy(() => import('../auth/login.jsx'));

function Application({ initialized, user }) {
  return (
    <div className={styles.application}>
      <Notifications />
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

Application.propTypes = {
  user: PropTypes.shape({
    uid: PropTypes.string.isRequired,
  }),
  initialized: PropTypes.bool.isRequired,
};

const mapStateToProps = ({ user, app }) => ({
  user,
  initialized: app.initialized,
});

export default connect(mapStateToProps)(Application);
