'use strict';

const express = require('express');
const routes = require('./routes');
const middleware = require('./middleware');

module.exports = function init() {
  const app = express();

  middleware(app);
  routes(app);

  return app;
};
