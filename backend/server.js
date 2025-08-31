import dotenv from 'dotenv';
import cors from 'cors';
import express from 'express';

import connectDB from './config/db.js';
import { app, server } from './socket/socket.js'; // Nayi file se import

import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import generationRoutes from './routes/generationRoutes.js';
import messageRoutes from './routes/messageRoutes.js';

dotenv.config();
connectDB();

const corsOptions = {
  origin: [
    'http://localhost:5173',
    'https://postify-ani.vercel.app'
  ],
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/generate', generationRoutes);
app.use('/api/messages', messageRoutes);

// Base Route
app.get('/', (req, res) => {
  res.send('API is running successfully.');
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
