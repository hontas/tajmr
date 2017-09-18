'use strict';

const intervals = require('../lib/intervals');

module.exports = function routes(app) {

  // app.post('/api/intervals', intervals.create);
  // app.get('/api/intervals', intervals.findAll);
  // app.get('/api/intervals/:id', intervals.findOne);
  // app.put('/api/intervals/:id', intervals.update);
  // app.delete('/api/intervals/:id', intervals.remove);

  app.get('/', (req, res) => res.render('index'));
};
