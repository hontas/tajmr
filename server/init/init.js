const path = require('path');
const express = require('express');
const middleware = require('./middleware');
const routes = require('./routes');

module.exports = function init() {
  const app = express();

  app.set('views', path.resolve(__dirname, '../views'));
  app.set('view engine', 'jade');

  middleware(app);
  routes(app);

  return app;
};
