import io from 'socket.io-client';
import { getJSON } from './utils/webApi';
import * as actions from './actions';

export function init(dispatch) {
  const socket = io();

  socket.on('connect', () => {
    dispatch(actions.connect(true));
  });

  socket.on('disconnect', () => {
    dispatch(actions.connect(false));
  });

  socket.on('interval created', (id) => {
    console.log('interval created: %s', id);
    getJSON(`/api/intervals/${id}`)
      .then((res) => dispatch(actions.updateInterval(res)));
  });

  socket.on('interval updated', (id) => {
    console.log('interval updated: %s', id);
    getJSON(`/api/intervals/${id}`)
      .then((res) => dispatch(actions.updateInterval(res)));
  });

  socket.on('interval deleted', (id) => {
    console.log('interval deleted: %s', id);
    dispatch(actions.removeInterval(id));
  });
}
