function ajax(url, method, data) {
  const options = {
    method: method,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  return fetch(url, options)
    .then(function (response) {
      if (response.ok) {
        return response;
      }
      return response.json().then((json) => Promise.reject(json));
    })
    .then((response) => {
      if (response.status !== 204) {
        return response.json();
      }
    })
    .catch((error) => {
      if (error.redirectUrl) {
        window.location.href = error.redirectUrl;
      }

      const err = error instanceof Error ? error :
        typeof error === 'string' ? Error(error) :
          Error(error.error);

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
