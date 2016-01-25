import config from 'exp-config';
import * as socket from './server/lib/socket';

if (config.useDevServer) {
  process.env.MONGOLAB_URI = 'mongodb://localhost:27017/tajmr';
}

import app from './server/app';

app.set('port', (process.env.PORT || 5000));

const server = app.listen(app.get('port'), () => {
  console.log('Server listening on port: %s, node version: %s', app.get('port'), process.version);
  socket.init(server);
});
