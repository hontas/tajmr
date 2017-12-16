import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Wave } from 'better-react-spinkit';
import md5 from 'md5';

import Cog from '../icons/Cog.jsx';
import Login from '../auth/login.jsx';
import UserMenu from '../user/userMenu.jsx';
import pkg from '../../../../package.json';

const garavatarUrl = 'https://www.gravatar.com/avatar';

class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { user, isSaving, isFetching } = this.props;
    const isLoading = isSaving || isFetching;
    const photoURL = user && (user.photoURL || `${garavatarUrl}/${md5(user.email)}`);

    const menuClasses = 'pure-menu-item pure-menu-has-children pure-menu-allow-hover';

    return (
      <div className="navbar pure-menu pure-menu-horizontal pure-menu-fixed">
        <h1 className="brand pure-menu-heading">TajmR</h1>
        <span className="version">{ `v${pkg.version}` }</span>
        {isLoading &&
          <div style={{ color: 'gray', display: 'inline-block', marginLeft: '1em' }}>
            <Wave color="currentColor" className="spin-kit-spinner" />
            <small className="loading-text">{ isFetching ? 'Laddar intervall...' : 'Sparar...' }</small>
          </div>
        }

        <ul className="navbar-menu pure-menu-list">
          { !user ?
            <li className={menuClasses}>
              <div className="pure-menu-link">
                Logga in
              </div>
              <ul className="pure-menu-children">
                <li className="pure-menu-item">
                  <Login />
                </li>
              </ul>
            </li>
            :
            <li className={menuClasses}>
              <div className="pure-menu-link">
                <Cog size={16} />
                <span className="menu-link__text">Inställningar</span>
              </div>
              <ul className="pure-menu-children">
                <li className="pure-menu-item">
                  <UserMenu {...this.props} />
                </li>
              </ul>
            </li>
         }
          {user && <img alt="avatar" className="profile-image" src={photoURL} /> }
        </ul>
      </div>
    );
  }
}

Navbar.propTypes = {
  dispatch: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
  isSaving: PropTypes.bool.isRequired,
  user: PropTypes.shape({
    uid: PropTypes.string.isRequired
  })
};

function mapStateToProps({ intervals, userSettings, user }) {
  return {
    user,
    isFetching: intervals.isFetching,
    isSaving: intervals.isSaving,
    userSettings
  };
}

export default connect(mapStateToProps)(Navbar);
