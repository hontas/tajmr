'use strict';

if (process.env.NODE_ENV === 'development') {
  const config = require('./config.json');
  process.env.MONGOLAB_URI = config.mongo_uri;
  process.env.LOGIN_HASH = config.login_hash;
}

const app = require('./server/app');

app.set('port', (process.env.PORT || 5000));

app.listen(app.get('port'), () => {
  console.log('Server running at http://localhost:%s', app.get('port'));
});
