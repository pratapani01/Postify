import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMessages, sendMessage, getUserById } from '../services/apiService';
import { io } from 'socket.io-client';
import { FaPaperPlane, FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const ChatWindow = ({ otherUserId }) => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [otherUser, setOtherUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const socket = useRef();
  const messagesEndRef = useRef(null);

  // Scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Fetch initial data and set up socket
  useEffect(() => {
    if (!otherUserId) {
      setLoading(false);
      // This case is handled by the parent MessagesPage, so we just return.
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [userData, messagesData] = await Promise.all([
          getUserById(otherUserId),
          getMessages(otherUserId),
        ]);
        setOtherUser(userData.user);
        setMessages(messagesData);
      } catch (err) {
        console.error('Failed to fetch chat data', err);
        setError('Failed to load chat. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Setup socket connection
    if (currentUser) {
      const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      socket.current = io(backendUrl.replace('/api', ''), {
        query: { userId: currentUser._id },
      });

      socket.current.on('newMessage', (newMessage) => {
        if (newMessage.senderId === otherUserId || newMessage.receiverId === otherUserId) {
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        }
      });

      // Cleanup on component unmount
      return () => {
        socket.current.disconnect();
      };
    }
  }, [otherUserId, currentUser]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const sentMessage = await sendMessage(otherUserId, newMessage);
      setMessages((prevMessages) => [...prevMessages, sentMessage]);
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-full text-gray-400">Loading Chat...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-full text-red-500">{error}</div>;
  }
  
  if (!otherUser) {
    // This message is shown on desktop if no chat is selected.
    return <div className="hidden md:flex items-center justify-center h-full text-gray-400">Select a conversation to start chatting.</div>;
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header with Back Button for Mobile */}
      <div className="p-4 border-b border-gray-700 flex items-center gap-x-4 sticky top-0 bg-gray-800 z-10">
        <Link to="/messages" className="md:hidden text-white mr-2">
          <FaArrowLeft size={20} />
        </Link>
        <div className="w-10 h-10 rounded-full bg-gray-600">
          {otherUser.profilePicture && (
            <img src={otherUser.profilePicture} alt={otherUser.username} className="w-full h-full object-cover rounded-full" />
          )}
        </div>
        <h2 className="text-xl font-bold text-white">{otherUser.username}</h2>
      </div>

      {/* Messages Area */}
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((msg, index) => (
          <div
            key={msg._id || `msg-${index}`}
            className={`flex mb-4 ${msg.senderId === currentUser._id ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs md:max-w-md p-3 rounded-lg ${
                msg.senderId === currentUser._id
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-gray-700 text-gray-200 rounded-bl-none'
              }`}
            >
              <p>{msg.message}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Form */}
      <div className="p-4 border-t border-gray-700 bg-gray-800 sticky bottom-0">
        <form onSubmit={handleSendMessage} className="flex items-center gap-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-full text-white focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-gray-500 transition-colors"
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

