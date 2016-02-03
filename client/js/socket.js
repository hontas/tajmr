import io from 'socket.io-client';
import { getJSON } from './utils/webApi';
import { updateInterval, removeInterval } from './actions/intervals';
import { connect } from './actions';

export function init(dispatch) {
  const socket = io();

  socket.on('connect', () => {
    dispatch(connect(true));
  });

  socket.on('disconnect', () => {
    dispatch(connect(false));
  });

  socket.on('interval created', (id) => {
    console.log('interval created: %s', id);
    getJSON(`/api/intervals/${id}`)
      .then((res) => dispatch(updateInterval(res)));
  });

  socket.on('interval updated', (id) => {
    console.log('interval updated: %s', id);
    getJSON(`/api/intervals/${id}`)
      .then((res) => dispatch(updateInterval(res)));
  });

  socket.on('interval deleted', (id) => {
    console.log('interval deleted: %s', id);
    dispatch(removeInterval(id));
  });
}
