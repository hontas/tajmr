import React from 'react';
import PropTypes from 'prop-types';
import Button from '../button/button.jsx';

import * as propTypes from '../../constants/propTypes';
import { updateSettings } from '../../actions/userActions';
import firebaseApi from '../../utils/firebaseApi';

class UserMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSavingUserSettings: false
    };
  }

  render() {
    const { userSettings } = this.props;
    const { displayNotifications, displayPreviousIntervals } = userSettings;
    const { isSavingUserSettings } = this.state;

    return (
      <form className="pure-form pure-form-stacked user-menu">
        <label className="pure-checkbox">{ 'Visa notifiering ' }
          <input checked={ displayNotifications } onChange={ this.handleChange('displayNotifications') } style={ { float: 'right' } } type="checkbox" />
        </label>
        <label className="pure-checkbox">{ 'Visa tidigare ' }
          <input checked={ displayPreviousIntervals } onChange={ this.handleChange('displayPreviousIntervals') } style={ { float: 'right' } } type="checkbox" />
        </label>
        <Button className="pure-button-primary" isLoading={ isSavingUserSettings } onClick={ this.saveUserSettings } text="Spara" />
        <button className="pure-button" onClick={ firebaseApi.logout }>{ 'Logga ut' }</button>
      </form>
    );
  }

  handleChange(prop) {
    const { dispatch } = this.props;

    return ({ target }) => {
      const value = target.type === 'checkbox' ? target.checked : target.value;
      dispatch(updateSettings({ [prop]: value }));
    };
  }

  saveUserSettings = (evt) => {
    evt.preventDefault();
    const { user, userSettings, onClose } = this.props;
    this.setState({
      isSavingUserSettings: true
    });

    firebaseApi
      .users
      .child(user.uid)
      .set(userSettings, () => {
        this.setState({ isSavingUserSettings: false });
        onClose();
      });
  }
}

UserMenu.propTypes = {
  dispatch: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  user: PropTypes.shape({
    uid: PropTypes.string.isRequired
  }).isRequired,
  userSettings: propTypes.userSettings.isRequired
};

export default UserMenu;
