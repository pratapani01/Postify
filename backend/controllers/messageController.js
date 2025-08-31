import Conversation from '../models/conversationModel.js';
import Message from '../models/messageModel.js';

// Get all conversations for a user
export const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id,
    }).populate('participants', 'username profilePicture');

    // Get the last message for each conversation
    const conversationsWithLastMessage = await Promise.all(
      conversations.map(async (conversation) => {
        const lastMessage = await Message.findOne({
          conversationId: conversation._id,
        }).sort({ createdAt: -1 });

        return {
          ...conversation.toObject(),
          lastMessage: lastMessage
            ? {
                text: lastMessage.text,
                createdAt: lastMessage.createdAt,
              }
            : null,
        };
      })
    );
    
    res.status(200).json(conversationsWithLastMessage);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};


// Get messages for a conversation
export const getMessages = async (req, res) => {
    try {
        const { otherUserId } = req.params;
        const userId = req.user._id;

        const conversation = await Conversation.findOne({
            participants: { $all: [userId, otherUserId] },
        });

        if (!conversation) {
            return res.status(200).json([]);
        }

        const messages = await Message.find({
            conversationId: conversation._id,
        }).sort({ createdAt: 1 });

        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Send a message
export const sendMessage = async (req, res) => {
    try {
        const { receiverId } = req.params;
        const { message } = req.body;
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
            text: message,
            conversationId: conversation._id,
        });
        
        await newMessage.save();
        
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

