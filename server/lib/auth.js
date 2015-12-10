'use strict';

const basicAuth = require('basic-auth');
const md5 = require('md5');

function logout(req, res) {
  res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
  return res.redirect('/');
}

function isLoggedIn(req, res, next) {
  const user = basicAuth(req);
  if (!user || !user.name || !user.pass) {
    return logout(null, res);
  }

  if (process.env.LOGIN_HASH === md5(user.name + user.pass)) {
    return next();
  } else {
    return logout(null, res);
  }
}

function login(req, res) {
  if (isLoggedIn) {
    return res.redirect('/');
  } else {
    return logout(null, res);
  }
}

module.exports = {
  login,
  logout,
  isLoggedIn
};
