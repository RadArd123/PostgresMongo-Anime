import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';

let io: Server;

export const initSocket = (httpServer: HttpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: 'http://localhost:5173',
      credentials: true,
      methods: ['GET', 'POST', 'DELETE', 'PUT']
    }
  });

  io.on('connection', (socket) => {
    console.log('User connected to live chat:', socket.id);

    socket.on('disconnect', () => {
      console.log('User disconnected from live chat:', socket.id);
    });
  });

  return io;
};

export const getIO = (): Server => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};
