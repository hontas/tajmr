'use strict';

const socketIo = require('socket.io');

let io;

function getSocketCount() {
  return Object.keys(io.sockets.connected).length;
}

function init(server) {
  io = socketIo.listen(server);

  io.sockets.on('connect', (socket) => {
    console.log('Connected: %s, %s sockets connected.', socket.id, getSocketCount());

    socket.once('disconnect', () => {
      socket.disconnect();
      console.log('Disconnected: %s, %s sockets remaining.', socket.id, getSocketCount());
    });
  });
}

function broadcastIntervalCreated(id) {
  io.emit('interval created', id);
}

function broadcastIntervalUpdate(id) {
  io.emit('interval updated', id);
}

function broadcastIntervalDelete(id) {
  io.emit('interval deleted', id);
}

module.exports = {
  init,
  broadcastIntervalCreated,
  broadcastIntervalUpdate,
  broadcastIntervalDelete
};
