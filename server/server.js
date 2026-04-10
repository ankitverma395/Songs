import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import compression from 'compression'; // ✅ added
import { createServer } from 'http';
import { Server } from 'socket.io';

import authRoutes from './routes/auth.js';
import youtubeRoutes from './routes/youtube.js';
import playlistRoutes from './routes/playlist.js';
import analyticsRoutes from './routes/analytics.js';
import commentRoutes from './routes/comments.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true
  }
});

// 🔥 Middleware
app.use(cors());
app.use(express.json());
app.use(compression()); // ✅ IMPORTANT (faster responses)

// MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/youtube', youtubeRoutes);
app.use('/api/playlists', playlistRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/comments', commentRoutes);

// Socket.io
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

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});