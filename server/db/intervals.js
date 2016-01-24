import mongoClient from './mongoClient';
import { fromMongoId, idQuery } from './utils';

function connect() {
  return mongoClient.connect('intervals');
}

function close(db) {
  return (value) => db.close().then(() => value);
}

function closeError(db) {
  return (error) => db.close().then(() => Promise.reject(error));
}

export function create(interval) {
  return connect()
    .then(({ db, collection }) => {
      return collection.insertOne(interval)
        .then(fromMongoId(interval))
        .then(close(db), closeError(db));
    });
}

export function update(query, interval) {
  return connect()
    .then(({ db, collection }) => {
      return collection.findOneAndUpdate(query, { $set: interval })
        .then(() => interval)
        .then(close(db), closeError(db));
    });
}

export function remove(id) {
  return connect()
    .then(({ db, collection }) => {
      return collection.findOneAndDelete(idQuery(id))
        .then(close(db), closeError(db));
    });
}

export function find(query = {}) {
  return connect()
    .then(({ db, collection }) => {
      return collection.find(query).toArray()
        .then(close(db), closeError(db));
    });
}
