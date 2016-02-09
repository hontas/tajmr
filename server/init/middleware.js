'use strict';

const config = require('exp-config');
const path = require('path');
const express = require('express');
const compression = require('compression');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const errorhandler = require('errorhandler');

module.exports = function (app) {

  if (config.useDevServer) {
    const options = require('../../webpack.config');
    const compiler = require('webpack')(options);

    app.use(require('webpack-dev-middleware')(compiler, {
      noInfo: true,
      publicPath: options.output.publicPath
    }));

    app.use(require('webpack-hot-middleware')(compiler));
    app.use(errorhandler());
    app.use(morgan('dev'));
  }

  app.use(express.static(path.resolve(__dirname, '../../public')));

  app.use(compression());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.disable('x-powered-by');
};
