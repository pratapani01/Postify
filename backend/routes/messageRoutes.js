import express from 'express';
import {
  sendMessage,
  getConversations,
  getMessages, // <-- YAHAN NAAM THEEK KIYA GAYA HAI
} from '../controllers/messageController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all conversations for a user
router.get('/', protect, getConversations);

// Get messages for a specific conversation
router.get('/:otherUserId', protect, getMessages); // <-- YAHAN BHI NAAM THEEK KIYA GAYA HAI

// Send a message
router.post('/send/:receiverId', protect, sendMessage);

export default router;
