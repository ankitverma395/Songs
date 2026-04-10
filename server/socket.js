import { Server } from 'socket.io';

export const initializeSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    
    socket.on('join-chat', (songId) => {
      socket.join(`song-${songId}`);
    });
    
    socket.on('send-message', (data) => {
      io.to(`song-${data.songId}`).emit('new-message', data);
    });
    
    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });

  return io;
};