import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Wave } from 'better-react-spinkit';

import Navbar from '../navbar/navbar.jsx';
import CurrentIntervals from '../containers/currentIntervals.jsx';
import PreviousIntervals from '../containers/previousIntervals.jsx';
import Footer from '../footer/footer.jsx';
import Login from '../auth/login.jsx';

class Application extends React.Component {
  render() {
    return (
      <div className="application">
        <Navbar />
        <main className="main">{this.renderBody()}</main>
        <Footer />
      </div>
    );
  }

  renderBody = () => {
    const { initialized, user } = this.props;
    if (!initialized) {
      return (
        <div className="application__init">
          <Wave color="rgba(255,255,255,.75)" size={50} />
        </div>
      );
    }
    return user ? (
      <>
        <CurrentIntervals />
        <PreviousIntervals />
      </>
    ) : (
      <Login />
    );
  };
}

Application.propTypes = {
  user: PropTypes.shape({
    uid: PropTypes.string.isRequired
  }),
  initialized: PropTypes.bool.isRequired
};

const mapStateToProps = ({ user, app }) => ({
  user,
  initialized: app.initialized
});

export default connect(mapStateToProps)(Application);
