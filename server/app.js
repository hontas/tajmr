'use strict';

const initApp = require('./init/init');

const app = initApp();

// const mongodb = require('./db');
// mongodb.find()
//   .then((result) => {
//     console.log('result: ', result);
//   });

module.exports = app;
