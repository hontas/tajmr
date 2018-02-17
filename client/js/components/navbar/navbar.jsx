import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { Wave } from 'better-react-spinkit';

import Button from '../button/button.jsx';
import Hamburger from '../icons/Hamburger.jsx';
import UserMenu from '../user/userMenu.jsx';
import pkg from '../../../../package.json';

class Navbar extends React.Component {
  state = { showUserMenu: false };

  render() {
    const { showUserMenu } = this.state;
    const { user, isSaving, isFetching } = this.props;
    const isLoading = isSaving || isFetching;

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

        {user &&
          <Button
            className="navbar__menu-btn"
            onClick={this.toggleUserMenu}
          >
            <Hamburger active={showUserMenu} />
          </Button>
        }
        <UserMenu
          {...this.props}
          className={classNames('navbar__user-menu', {
            'navbar__user-menu--active': showUserMenu
          })}
        />

      </div>
    );
  }

  toggleUserMenu = () => this.setState(({ showUserMenu }) => ({ showUserMenu: !showUserMenu }));
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
