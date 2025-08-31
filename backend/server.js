import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';

// Import Routes
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import generationRoutes from './routes/generationRoutes.js';
import messageRoutes from './routes/messageRoutes.js';

// Load environment variables
dotenv.config();
connectDB();

const app = express();

// --- START: The Important CORS Fix ---
const allowedOrigins = [
  'http://localhost:5173', // For local development
  'https://postify-ani.vercel.app' // Your live frontend URL
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
// --- END: The Important CORS Fix ---

app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

let onlineUsers = [];

const addUser = (userId, socketId) => {
  !onlineUsers.some((user) => user.userId === userId) &&
    onlineUsers.push({ userId, socketId });
};

const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return onlineUsers.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", onlineUsers);
  });

  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    const user = getUser(receiverId);
    if (user) {
      io.to(user.socketId).emit("getMessage", {
        senderId,
        text,
      });
    }
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
    io.emit("getUsers", onlineUsers);
  });
});

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/generate', generationRoutes);
app.use('/api/messages', messageRoutes);

app.get('/', (req, res) => {
    res.send('API is running successfully.');
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

