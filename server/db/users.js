import md5 from 'md5';
import mongoClient from './mongoClient';
import { queryFromId } from './utils';

function connect() {
  return mongoClient.connect('users');
}

function close(db) {
  return (value) => db.close().then(() => value);
}

function makeHash(mail, pass) {
  return md5('poniesArePeople2' + mail + pass);
}

function transform(users) {
  return users.map((user) => {
    const password = user.password;
    user.validPassword = (pass) => {
      return makeHash(user.username, pass) === password;
    };
    delete user.password;
    return user;
  });
}

function selectFirst(array) {
  return array[0];
}

function findOne({ collection, query }) {
  return collection.find(query)
    .limit(1)
    .toArray()
    .then(transform)
    .then(selectFirst);
}

module.exports = {
  add({ username, password }) {
    return connect()
      .then(({ db, collection }) => {
        const query = { username };
        return findOne({ collection, query })
          .then((user) => {
            if (user) throw new Error('Username taken');

            const hashword = makeHash(username, password);
            return collection.insertOne({ username, password: hashword });
          })
          .then((resp) => ({
            username,
            _id: resp.insertedId
          }))
          .then(close(db));
      });
  },

  find(query) {
    return connect()
      .then(({ db, collection }) => {
        return collection.find(query)
          .toArray()
          .then(transform)
          .then(close(db));
      });
  },

  findOne(query) {
    return connect()
      .then(({ db, collection }) => {
        return findOne({ collection, query })
          .then(close(db));
      });
  },

  findById(id) {
    return this.findOne(queryFromId(id));
  }
};
