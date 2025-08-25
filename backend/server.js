// backend/server.js

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js'; 
import generationRoutes from './routes/generationRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
// Load environment variables
dotenv.config();

connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON bodies


// Test Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/generate', generationRoutes);
app.use('/api/messages', messageRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} 🔥`);
});