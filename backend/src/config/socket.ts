import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { getAllowedOrigins } from './security';
import { pool } from './db';

let io: Server;

export const initSocket = (httpServer: HttpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: getAllowedOrigins(),
      credentials: true,
      methods: ['GET', 'POST', 'DELETE', 'PUT']
    }
  });

  io.use(async (socket, next) => {
    try {
      const cookieHeader = socket.handshake.headers.cookie || '';
      const tokenPair = cookieHeader
        .split(';')
        .map((part) => part.trim())
        .find((part) => part.startsWith('token='));
      const token = tokenPair ? decodeURIComponent(tokenPair.slice('token='.length)) : null;
      const secret = process.env.JWT_SECRET;

      if (!token || !secret) {
        next(new Error('Unauthorized'));
        return;
      }

      const decoded = jwt.verify(token, secret) as { id?: number };
      const userId = Number(decoded.id);
      if (!Number.isSafeInteger(userId) || userId <= 0) {
        next(new Error('Unauthorized'));
        return;
      }

      const userResult = await pool.query('SELECT id FROM users WHERE id = $1', [userId]);
      if (userResult.rowCount !== 1) {
        next(new Error('Unauthorized'));
        return;
      }

      socket.data.userId = userId;
      next();
    } catch {
      next(new Error('Unauthorized'));
    }
  });

  io.on('connection', (socket) => {
    console.log('User connected to live chat:', socket.id);
    socket.join(`user:${socket.data.userId}`);

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
