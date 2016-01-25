import mongoClient from './mongoClient';
import { fromMongoId, queryFromId, logAndPass } from './utils';
import {
  broadcastIntervalCreated,
  broadcastIntervalUpdate,
  broadcastIntervalDelete } from '../lib/socket';

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
        .then((res) => {
          broadcastIntervalCreated(res.id);
          return res;
        })
        .then(logAndPass('created'))
        .then(close(db), closeError(db));
    });
}

export function update({ id }, interval) {
  const query = queryFromId(id);
  const { startTime, endTime, note } = interval;
  return connect()
    .then(({ db, collection }) => {
      return collection.findOneAndUpdate(query, { $set: { startTime, endTime, note } })
        .then(() => {
          broadcastIntervalUpdate(id);
          return interval;
        })
        .then(logAndPass('updated'))
        .then(close(db), closeError(db));
    });
}

export function remove(id) {
  return connect()
    .then(({ db, collection }) => {
      return collection.findOneAndDelete(queryFromId(id))
        .then((res) => {
            broadcastIntervalDelete(id);
            return res;
          })
        .then(logAndPass('removed'))
        .then(close(db), closeError(db));
    });
}

export function findOne({ id }) {
  const query = queryFromId(id);
  return connect()
    .then(({ db, collection }) => {
      return collection.find(query).limit(1).toArray()
        .then(transform)
        .then((res) => res[0])
        .then(logAndPass('found'))
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
