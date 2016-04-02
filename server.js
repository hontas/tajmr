'use strict';

const config = require('exp-config');

if (config.useDevServer) {
  process.env.MONGOLAB_URI = 'mongodb://localhost:27017/tajmr';
}

const app = require('./server/app');

app.set('port', (process.env.PORT || 5000));

app.listen(app.get('port'), () => {
  console.log('Server listening on port: %s, node version: %s', app.get('port'), process.version); // eslint-disable-line no-console
});
