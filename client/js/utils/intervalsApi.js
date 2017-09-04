import firebaseApi from './firebaseApi';

function withoutId(object) {
  const newObj = Object.assign({}, object);
  delete newObj.id;
  return newObj;
}

function start(interval) {
  const auth = firebaseApi.ref.getAuth();
  const updatedInterval = Object.assign({}, interval, {
    user: auth && auth.uid,
    createdAt: interval.startTime
  });

  return new Promise((resolve) => {
    const newId = firebaseApi.ref
      .child('intervals')
      .push(updatedInterval)
      .key();

    resolve(Object.assign({ id: newId }, updatedInterval));
  });
}

export function update(interval) {
  const updatedInterval = Object.assign({}, interval, {
    updatedAt: Date.now()
  });

  if (typeof updatedInterval.id === 'undefined') {
    return start(updatedInterval);
  }

  if (typeof updatedInterval.endTime === 'undefined') {
    delete updatedInterval.endTime;
  }

  return new Promise((resolve, reject) => {
    firebaseApi.intervals
      .child(updatedInterval.id)
      .update(withoutId(updatedInterval), (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(updatedInterval);
        }
      });
  });
}

export function remove(intervalId) {
  return new Promise((resolve, reject) => {
    firebaseApi.ref
      .child('intervals')
      .child(intervalId)
      .remove((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
  });
}

export function findAll() {
  return firebaseApi.getAllIntervals()
    .then((intervals) =>
      Object.keys(intervals)
        .map((id) => ({ id, ...intervals[id] })));
}
