import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getMessages, sendMessage, getUserById } from '../services/apiService';
import { useAuth } from '../context/AuthContext';
import { io } from 'socket.io-client'; // Socket.IO client import karein
import { IoSend } from "react-icons/io5";

const ChatWindow = () => {
  const { userId: otherUserId } = useParams();
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [otherUser, setOtherUser] = useState(null);
  const socket = useRef();
  const scrollRef = useRef();

  // Socket.IO connection setup
  useEffect(() => {
    // Backend ka URL Vercel se le, ya local use karein
    const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
    socket.current = io(SOCKET_URL);

    // Live message receive karein
    socket.current.on('getMessage', (data) => {
      // Check karein ki message isi chat ka hai ya nahi
      if (data.sender === otherUserId) {
        setMessages((prev) => [...prev, { sender: data.sender, text: data.text, createdAt: Date.now() }]);
      }
    });

    // Jab component band ho to connection tod dein
    return () => {
      socket.current.disconnect();
    };
  }, [otherUserId]);

  // Server ko batayein ki aap online hain
  useEffect(() => {
    if (currentUser) {
      socket.current.emit('addUser', currentUser._id);
    }
  }, [currentUser]);

  // Messages aur user profile fetch karein
  useEffect(() => {
    const fetchChatData = async () => {
      try {
        const messageData = await getMessages(otherUserId);
        const userData = await getUserById(otherUserId);
        setMessages(messageData);
        setOtherUser(userData.user);
      } catch (error) {
        console.error("Failed to fetch chat data", error);
      }
    };
    fetchChatData();
  }, [otherUserId]);

  // Har naye message par neeche scroll karein
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      sender: currentUser._id,
      text: newMessage,
      createdAt: Date.now(),
    };
    
    // Server ko live message bhejein
    socket.current.emit('sendMessage', {
      senderId: currentUser._id,
      receiverId: otherUserId,
      text: newMessage,
    });
    
    // Database mein message save karein
    try {
      const savedMessage = await sendMessage(otherUserId, newMessage);
      setMessages((prev) => [...prev, savedMessage]);
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message', error);
    }
  };

  if (!otherUser) {
    return <div className="flex-1 flex items-center justify-center text-gray-400">Loading Chat...</div>;
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-700 flex items-center gap-x-4">
        <div className="w-10 h-10 rounded-full bg-gray-600">
          {otherUser.profilePicture && <img src={otherUser.profilePicture} alt={otherUser.username} className="w-full h-full rounded-full object-cover" />}
        </div>
        <h2 className="text-lg font-bold text-white">{otherUser.username}</h2>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div ref={scrollRef} key={msg._id || msg.createdAt} className={`flex ${msg.sender === currentUser._id ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${msg.sender === currentUser._id ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-200'}`}>
              <p>{msg.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input Form */}
      <div className="p-4 border-t border-gray-700">
        <form onSubmit={handleSendMessage} className="flex items-center gap-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-full text-white focus:outline-none focus:border-blue-500"
          />
          <button type="submit" className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700">
            <IoSend size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
