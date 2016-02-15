import firebaseApi from './firebaseApi';

function withoutId(object) {
  const newObj = Object.assign({}, object);
  delete newObj.id;
  return newObj;
}

export function start(interval) {
  const auth = firebaseApi.ref.getAuth();
  const intervalDeluxe = Object.assign({}, interval, {
    user: auth && auth.uid,
    createdAt: Date.now()
  });

  return new Promise((resolve) => {
    const newId = firebaseApi.ref
      .child('intervals')
      .push(interval)
      .key();

    resolve(Object.assign({ id: newId }, intervalDeluxe));
  });
}

export function update(interval) {
  const intervalDeluxe = Object.assign({}, interval, {
    updatedAt: Date.now()
  });

  if (typeof intervalDeluxe.id === 'undefined') {
    return start(intervalDeluxe);
  }

  if (typeof intervalDeluxe.endTime === 'undefined') {
    delete intervalDeluxe.endTime;
  }

  return new Promise((resolve, reject) => {
    firebaseApi.intervals
      .child(intervalDeluxe.id)
      .update(withoutId(intervalDeluxe), (err) => {
        if (err) return reject(err);
        resolve(intervalDeluxe);
      });
  });
}

export function remove(intervalId) {
  return new Promise((resolve, reject) => {
    firebaseApi.ref
      .child('intervals')
      .child(intervalId)
      .remove((err) => {
        if (err) return reject(err);
        resolve();
      });
  });
}

export function findAll() {
  const auth = firebaseApi.ref.getAuth();

  return new Promise((resolve, reject) => {
    function success(data) {
      const values = data.val();
      if (!values) return resolve([]);

      resolve(Object.keys(values)
        .map((id) => {
          return Object.assign({ id }, values[id]);
        }));
    }

    firebaseApi.ref.child('intervals')
      .orderByChild('user')
      .equalTo(auth && auth.uid)
      .limitToLast(100)
      .once('value', success, reject);
  });
}
