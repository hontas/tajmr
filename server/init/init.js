import path from 'path';
import express from 'express';
import middleware from './middleware';
import routes from './routes';

module.exports = function init() {
  const app = express();

  app.set('views', path.resolve(__dirname, '../views'));
  app.set('view engine', 'jade');

  middleware(app);
  routes(app);

  return app;
};
