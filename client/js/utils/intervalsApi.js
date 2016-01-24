import { postJSON, putJSON, getJSON, delJSON } from './webApi';

export function start({ interval }) {
  return postJSON('/api/intervals', interval);
}

export function update({ interval }) {
  return putJSON(`/api/intervals/${interval.id}`, interval);
}

export function remove(intervalId) {
  return delJSON(`/api/intervals/${intervalId}`);
}

export function findAll() {
  return getJSON('/api/intervals');
}
