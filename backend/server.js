import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

// Route imports
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import generationRoutes from './routes/generationRoutes.js';

// Load environment variables
dotenv.config();

// Database connection
connectDB();

const app = express();
const server = http.createServer(app);

// CORS configuration to allow requests from your Vercel frontend and local dev server
const corsOptions = {
  origin: [process.env.FRONTEND_URL || "http://localhost:5173"],
  optionsSuccessStatus: 200,
};

const io = new Server(server, {
  cors: corsOptions,
});

// Middleware
app.use(cors(corsOptions));
app.use(express.json()); // To parse JSON bodies

// --- Socket.IO Logic ---
let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on('connection', (socket) => {
  // when a user connects
  console.log('A user connected.');

  // take userId and socketId from user
  socket.on('addUser', (userId) => {
    addUser(userId, socket.id);
    io.emit('getUsers', users);
  });

  // send and get message
  socket.on('sendMessage', ({ senderId, receiverId, text }) => {
    const user = getUser(receiverId);
    if (user) {
      io.to(user.socketId).emit('getMessage', {
        sender: senderId,
        text,
      });
    }
  });

  // when a user disconnects
  socket.on('disconnect', () => {
    console.log('A user disconnected!');
    removeUser(socket.id);
    io.emit('getUsers', users);
  });
});

// --- API Routes ---
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/generate', generationRoutes);

// Base route for Render health check
app.get('/', (req, res) => {
  res.send('API is running successfully.');
});

// --- Server Listening ---
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} 🔥`);
});
