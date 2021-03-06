function createErrorObject(response) {
  return (err) =>
    Promise.reject(
      Object.assign(err, {
        status: response.status,
        statusText: response.statusText
      })
    );
}

function ajax(url, method, data) {
  const options = {
    method,
    mode: 'cors',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    credentials: 'omit'
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  return fetch(url, options)
    .then((response) => {
      if (response.ok) {
        return response;
      }
      return response.json().then(createErrorObject(response));
    })
    .then((response) => {
      if (response.status !== 204) {
        return response.json();
      }

      return response;
    })
    .catch((error) => {
      if (error.redirectUrl) {
        window.location.href = error.redirectUrl;
      }

      const err = error instanceof Error ? { error: error.toString() } : error;
      return Promise.reject(err);
    });
}

export function postJSON(url, data) {
  return ajax(url, 'POST', data);
}

export function putJSON(url, data) {
  return ajax(url, 'PUT', data);
}

export function getJSON(url) {
  return ajax(url, 'GET');
}

export function delJSON(url) {
  return ajax(url, 'DELETE');
}
