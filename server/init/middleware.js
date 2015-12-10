'use strict';

const compression = require('compression');
const bodyParser = require('body-parser');

module.exports = function (app) {

  app.use(compression());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));

};
