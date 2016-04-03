'use strict';

const config = require('exp-config');
const app = require('./server/app');

if (config.useDevServer) {
  process.env.MONGOLAB_URI = 'mongodb://localhost:27017/tajmr';
}

app.set('port', (process.env.PORT || 5000));

app.listen(app.get('port'), () => {
  console.log('https server listening on port: %s, node version: %s', app.get('port'), process.version); // eslint-disable-line no-console
});
