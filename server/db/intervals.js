import mongoClient from './mongoClient';
import { fromMongoId, idQuery, logAndPass } from './utils';

function connect() {
  return mongoClient.connect('intervals');
}

function close(db) {
  return (value) => db.close().then(() => value);
}

function closeError(db) {
  return (error) => db.close().then(() => Promise.reject(error));
}

function transform(intervals) {
  return intervals.map((interval) => {
    const clone = Object.assign({}, interval, { id: interval._id });
    delete clone._id;
    return clone;
  });
}

export function create(interval) {
  return connect()
    .then(({ db, collection }) => {
      return collection.insertOne(interval)
        .then(fromMongoId(interval))
        .then(logAndPass('created'))
        .then(close(db), closeError(db));
    });
}

export function update(query, interval) {
  return connect()
    .then(({ db, collection }) => {
      return collection.findOneAndUpdate(query, { $set: interval })
        .then(() => interval)
        .then(logAndPass('updated'))
        .then(close(db), closeError(db));
    });
}

export function remove(id) {
  console.log(id);
  return connect()
    .then(({ db, collection }) => {
      return collection.findOneAndDelete(idQuery(id))
        .then(logAndPass('removed'))
        .then(close(db), closeError(db));
    });
}

export function find(query = {}) {
  return connect()
    .then(({ db, collection }) => {
      return collection.find(query).toArray()
        .then(transform)
        .then(logAndPass('found'))
        .then(close(db), closeError(db));
    });
}
