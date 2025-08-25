import express from 'express';
import { sendMessage, getConversations, getConversationMessages } from '../controllers/messageController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getConversations); // Get all conversations
router.get('/:otherUserId', protect, getConversationMessages); // Get messages for one convo
router.post('/send/:receiverId', protect, sendMessage);

export default router;
