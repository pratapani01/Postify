import Conversation from '../models/conversationModel.js';
import Message from '../models/messageModel.js';
import User from '../models/userModel.js';

// @desc    Send a message
// @route   POST /api/messages/send/:receiverId
// @access  Private
export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { receiverId } = req.params;
    const senderId = req.user._id;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }

    // This will run both saves in parallel
    await Promise.all([conversation.save(), newMessage.save()]);

    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error in sendMessage controller: ', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// @desc    Get all conversations for a user
// @route   GET /api/messages
// @access  Private
export const getConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    const conversations = await Conversation.find({ participants: userId }).populate({
      path: 'participants',
      select: 'username profilePicture', // User ki details fetch karein
    });

    // Current user ko participants list se hata dein
    const filteredConversations = conversations.map(conversation => {
      const otherParticipants = conversation.participants.filter(
        participant => participant._id.toString() !== userId.toString()
      );
      // Return a modified object
      return { ...conversation.toObject(), participants: otherParticipants };
    });

    res.status(200).json(filteredConversations);
  } catch (error) {
    console.error('Error in getConversations controller: ', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// @desc    Get messages for a specific conversation
// @route   GET /api/messages/:otherUserId
// @access  Private
export const getConversationMessages = async (req, res) => {
  try {
    const { otherUserId } = req.params;
    const userId = req.user._id;

    const conversation = await Conversation.findOne({
      participants: { $all: [userId, otherUserId] },
    }).populate('messages');

    if (!conversation) {
      return res.status(200).json([]);
    }

    res.status(200).json(conversation.messages);
  } catch (error) {
    console.error('Error in getMessages controller: ', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};
