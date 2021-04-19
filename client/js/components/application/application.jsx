import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Loader from '../loader/Loader.jsx';

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
    <div className="application">
      <React.Suspense fallback={<Loader />}>
        {initialized ? (
          <>
            <Navbar />
            <main className="main">
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
