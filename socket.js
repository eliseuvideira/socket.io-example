const SocketIO = require("socket.io");

/** @type {SocketIO.Server} */
let socket;

module.exports = {
  startSocket: (server) => {
    socket = SocketIO(server);
  },
  socket: () => socket,
};
