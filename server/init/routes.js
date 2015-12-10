'use strict';

const path = require('path');
const express = require('express');
const auth = require('../lib/auth');

module.exports = function routes(app) {

  app.use(express.static(path.resolve(__dirname, '../../public')));

  app.get('/login', auth.login);

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../../public', 'index.html'));
  });

};
