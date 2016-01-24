import { ObjectId } from 'mongodb';

export function fromMongoId(document) {
  return ({ insertedId: id }) => {
    const clone = Object.assign({}, document, { id });
    delete clone._id;
    return clone;
  };
}

export function idQuery(id) {
  return { _id: new ObjectId(id) };
}

export function logAndPass(message) {
  return (value) => {
    console.log(message, value);
    return value;
  };
}
