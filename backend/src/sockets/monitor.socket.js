const { verifyAccess } = require('../utils/jwt');

function setupSockets(io) {
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('Auth required'));
    try {
      socket.user = verifyAccess(token);
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log('🔌 Socket:', socket.id, 'User:', socket.user.email);

    socket.on('joinAdmin', () => {
      if (socket.user.role !== 'ADMIN') return socket.emit('error', 'Admin only');
      socket.join('admin-room');
      console.log(socket.id, '→ admin-room');
    });

    socket.on('joinUser', () => socket.join(`user-${socket.user.id}`));

    socket.on('disconnect', () => console.log('🔌 Disconnected:', socket.id));
  });
}
module.exports = { setupSockets };