import config from 'exp-config';
import path from 'path';
import express from 'express';
import compression from 'compression';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import session from 'express-session';
import morgan from 'morgan';
import errorhandler from 'errorhandler';

require('../lib/passport');

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
  app.use(cookieParser());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(session({ resave: true, saveUninitialized: true, secret: 'tisbettertoforgivethanforget' }));
  app.use(passport.initialize());
  app.use(passport.session());

  app.disable('x-powered-by');
};
