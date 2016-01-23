import config from 'exp-config';

if (config.useDevServer) {
  process.env.MONGOLAB_URI = 'mongodb://localhost:27017/tajmr';
}

import app from './server/app';

app.set('port', (process.env.PORT || 5000));

app.listen(app.get('port'), () => {
  console.log('Server running at http://localhost:%s', app.get('port'));
});
