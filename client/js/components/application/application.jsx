import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Navbar from '../navbar/navbar.jsx';
import Footer from '../footer/footer.jsx';
import * as SpinKit from '../spinkit/spinkit.jsx';

const CurrentIntervals = React.lazy(() => import('../containers/currentIntervals.jsx'));
const PreviousIntervals = React.lazy(() => import('../containers/previousIntervals.jsx'));
const Login = React.lazy(() => import('../auth/login.jsx'));

function Application({ initialized, user }) {
  return (
    <div className="application">
      <Navbar />
      <main className="main">
        {initialized && (
          <React.Suspense fallback={<div>Loading...</div>}>
            {user ? (
              <>
                <CurrentIntervals />
                <PreviousIntervals />
              </>
            ) : (
              <Login />
            )}
          </React.Suspense>
        )}
        {!initialized && (
          <div className="application__init" data-testid="app-init">
            <SpinKit.Wave color="rgba(255,255,255,.75)" size="50px" />
          </div>
        )}
      </main>
      <Footer />
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
