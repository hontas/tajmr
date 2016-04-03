'use strict';

const fs = require('fs');
const https = require('https');
const config = require('exp-config');

if (config.useDevServer) {
  process.env.MONGOLAB_URI = 'mongodb://localhost:27017/tajmr';
}

const app = require('./server/app');
const options = {
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.crt')
};

app.set('port', (process.env.PORT || 5000));

https.createServer(options, app).listen(app.get('port'), () => {
  console.log('https server listening on port: %s, node version: %s', app.get('port'), process.version); // eslint-disable-line no-console
});
