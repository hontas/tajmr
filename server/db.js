'use strict';

const MongoClient = require('mongodb').MongoClient;

function exec(collectionName, actionFn) {
  let dbLink;

  return MongoClient.connect(process.env.MONGOLAB_URI)
    .then((db) => {
      dbLink = db;
      return db.collection(collectionName);
    })
    .then((collection) => {
      if (actionFn && typeof actionFn === 'function') {
        return actionFn(collection);
      }
    })
    .then((result) => {
      dbLink.close();
      return result;
    })
    .catch((err) => {
      console.log('An error occured:', err);
    });
}

module.exports = {
  connect() {
    return exec('intervals');
  },
  find() {
    return exec('intervals', (collection) => collection.find().toArray());
  }
};
