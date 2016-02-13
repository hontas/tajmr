import firebaseApi from './firebaseApi';

function withoutId(object) {
  const newObj = Object.assign({}, object);
  delete newObj.id;
  return newObj;
}

export function start(interval) {
  //return postJSON('/api/intervals', interval);

  const auth = firebaseApi.ref.getAuth();
  const intervalDeluxe = Object.assign({
    user: auth && auth.uid,
    createdAt: Date.now()
  }, interval);

  return new Promise((resolve) => {
    const newId = firebaseApi.ref
      .child('intervals')
      .push(interval)
      .key();

    resolve(Object.assign({ id: newId }, intervalDeluxe));
  });
}

export function update(interval) {
  //return putJSON(`/api/intervals/${interval.id}`, interval);

  const intervalDeluxe = Object.assign({
    updatedAt: Date.now()
  }, interval);

  if (typeof intervalDeluxe.id === 'undefined') {
    return start(intervalDeluxe);
  }

  return new Promise((resolve, reject) => {
    firebaseApi.ref
      .child('intervals')
      .child(intervalDeluxe.id)
      .update(withoutId(intervalDeluxe), (err) => {
        if (err) return reject(err);
        resolve(interval);
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
