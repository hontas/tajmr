import socketIo from 'socket.io';

let io;

function getSocketCount() {
  return Object.keys(io.sockets.connected).length;
}

export function init(server) {
  io = socketIo.listen(server);

  io.sockets.on('connect', (socket) => {
    console.log('Connected: %s, %s sockets connected.', socket.id, getSocketCount());

    socket.once('disconnect', () => {
      socket.disconnect();
      console.log('Disconnected: %s, %s sockets remaining.', socket.id, getSocketCount());
    });
  });
}

export function broadcastIntervalCreated(id) {
  io.emit('interval created', id);
}

export function broadcastIntervalUpdate(id) {
  io.emit('interval updated', id);
}

export function broadcastIntervalDelete(id) {
  io.emit('interval deleted', id);
}
