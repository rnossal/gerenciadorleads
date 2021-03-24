const websocket = (io) => {
  io.on('connection', (socket) => {
    socket.on('message', (message) => {
      socket.emit('message', `2x${message}`);
    });
  });
};

export default websocket;
