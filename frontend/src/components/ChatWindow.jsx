import React, { useState, useEffect, useRef, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { getMessages, sendMessage, getUserById } from '../services/apiService';
import { useAuth } from '../context/AuthContext';
import { io } from 'socket.io-client';
import { FaPaperPlane } from 'react-icons/fa';

const ChatWindow = () => {
  const { userId: otherUserId } = useParams();
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [otherUser, setOtherUser] = useState(null);
  const socket = useRef();
  const scrollRef = useRef();

  // Connect to Socket.IO
  useEffect(() => {
    socket.current = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');
    
    socket.current.on('getMessage', (data) => {
        // Only update if the message is part of the current conversation
        if (data.sender === otherUserId) {
            setMessages((prev) => [...prev, { sender: data.sender, text: data.text, createdAt: new Date() }]);
        }
    });

    return () => {
      socket.current.disconnect();
    };
  }, [otherUserId]);

  // Add user to socket server
  useEffect(() => {
    if (currentUser) {
      socket.current.emit('addUser', currentUser._id);
    }
  }, [currentUser]);

  // Fetch messages and user data
  useEffect(() => {
    const fetchChatData = async () => {
      if (currentUser) {
        try {
          const fetchedMessages = await getMessages(otherUserId);
          const fetchedUser = await getUserById(otherUserId);
          setMessages(fetchedMessages);
          setOtherUser(fetchedUser.user);
        } catch (error) {
          console.error('Failed to fetch chat data', error);
        }
      }
    };
    fetchChatData();
  }, [otherUserId, currentUser]);
  
  // Auto-scroll to the latest message
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser) return;

    const message = {
      sender: currentUser._id,
      text: newMessage,
      createdAt: new Date(),
    };

    socket.current.emit('sendMessage', {
      senderId: currentUser._id,
      receiverId: otherUserId,
      text: newMessage,
    });

    try {
      const sentMessage = await sendMessage(otherUserId, newMessage);
      setMessages([...messages, sentMessage]);
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  if (!otherUser) {
    return <div className="flex-1 p-4 text-center text-gray-400">Loading Chat...</div>;
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-700/50 flex items-center gap-x-4">
        <div className="w-10 h-10 rounded-full bg-gray-600">
          {otherUser.profilePicture && <img src={otherUser.profilePicture} alt={otherUser.username} className="w-full h-full rounded-full object-cover" />}
        </div>
        <h2 className="text-lg font-bold text-white">{otherUser.username}</h2>
      </div>

      {/* Messages Area */}
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((msg) => (
          <div key={msg._id || msg.createdAt} ref={scrollRef}>
            <div className={`flex mb-4 ${msg.sender === currentUser._id ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                  msg.sender === currentUser._id
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-gray-700 text-gray-200 rounded-bl-none'
                }`}
              >
                <p>{msg.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-700/50">
        <form onSubmit={handleSendMessage} className="flex items-center gap-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 bg-gray-700 border border-transparent rounded-full text-white focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="p-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 disabled:bg-gray-500"
            disabled={!newMessage.trim()}
          >
            <FaPaperPlane />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;

