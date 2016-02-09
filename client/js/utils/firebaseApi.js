/* globals Firebase */
const firebase = new Firebase('https://tajmr.firebaseio.com/');
import store from '../store';
import { userLoggedIn, userLoggedOut } from '../actions/userActions';

firebase.onAuth((authData) => {
  if (authData) {
    console.log('onAuth', authData);
    store.dispatch(userLoggedIn(authData));
  } else {
    store.dispatch(userLoggedOut());
  }
});

export default {
  login(email, password) {
    return new Promise((resolve, reject) => {
      firebase.authWithPassword({
        email, password
      }, (error, authData) => {
        if (error) return reject(error);
        resolve(authData);
      });
    });
  },

  logout() {
    return firebase.unauth();
  }
};
