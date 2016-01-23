import { MongoClient } from 'mongodb';
const options = { promiseLibrary: Promise };

function connectToMongo() {
  return MongoClient.connect(process.env.MONGOLAB_URI, options);
}

module.exports = {
  connect(collectionName) {
    return new Promise((resolve, reject) => {
      connectToMongo()
        .then((db) => {
          db.collection(collectionName, (err, collection) => {
            if (err) {
              reject(err);
            } else {
              resolve({ db, collection });
            }
          });
        })
        .catch(reject);
    });
  }
};
