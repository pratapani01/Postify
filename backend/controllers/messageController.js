import Conversation from '../models/conversationModel.js';
import Message from '../models/messageModel.js';
import { getReceiverSocketId, io } from '../server.js';

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

    // This will run in parallel
    await Promise.all([conversation.save(), newMessage.save()]);

    // SOCKET.IO REAL-TIME FUNCTIONALITY
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('newMessage', newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error in sendMessage: ', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getConversations = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const conversations = await Conversation.find({ participants: loggedInUserId })
      .populate({
        path: 'participants',
        select: 'username profilePicture',
      })
      .populate({
        path: 'messages',
        options: { sort: { createdAt: -1 }, limit: 1 }, // Fetch only the last message
      });

    // Filter out the logged-in user from participants list
    const formattedConversations = conversations.map((conv) => {
      const otherParticipant = conv.participants.find(
        (p) => p._id.toString() !== loggedInUserId.toString()
      );
      return {
        _id: conv._id,
        otherParticipant: otherParticipant,
        lastMessage: conv.messages[0],
      };
    });

    res.status(200).json(formattedConversations);
  } catch (error) {
    console.error('Error in getConversations: ', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { otherUserId } = req.params;
    const senderId = req.user._id;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, otherUserId] },
    }).populate('messages');

    if (!conversation) return res.status(200).json([]);

    res.status(200).json(conversation.messages);
  } catch (error) {
    console.error('Error in getMessages: ', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};