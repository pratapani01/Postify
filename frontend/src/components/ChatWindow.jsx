import React, { useState, useEffect, useRef } from 'react';
import { getMessages, sendMessage } from '../services/apiService';
import { IoSend } from 'react-icons/io5';

const ChatWindow = ({ selectedConversation, currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null); // Ref to scroll to bottom

  // This should be the other user in the conversation
  const otherUser = selectedConversation.participants[0];

  // Function to scroll to the latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!otherUser) return;
      setLoading(true);
      try {
        const data = await getMessages(otherUser._id);
        setMessages(data);
      } catch (error) {
        console.error("Failed to fetch messages", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [selectedConversation]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    try {
      const sentMessage = await sendMessage(otherUser._id, newMessage);
      // To display the new message instantly, we add it to our local state
      setMessages([...messages, sentMessage]);
      setNewMessage('');
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="flex items-center p-3 border-b border-gray-700">
        <div className="w-10 h-10 rounded-full bg-gray-600 mr-3 flex-shrink-0">
          {otherUser.profilePicture && <img src={otherUser.profilePicture} alt={otherUser.username} className="w-full h-full object-cover rounded-full" />}
        </div>
        <p className="font-bold text-white">{otherUser.username}</p>
      </div>

      {/* Messages Area */}
      <div className="flex-1 p-4 overflow-y-auto">
        {loading ? (
          <p className="text-center text-gray-400">Loading messages...</p>
        ) : (
          messages.map((msg) => (
            <div key={msg._id} className={`flex mb-2 ${msg.senderId === currentUser._id ? 'justify-end' : 'justify-start'}`}>
              <div className={`rounded-lg px-3 py-2 max-w-xs ${msg.senderId === currentUser._id ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-200'}`}>
                {msg.message}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-700">
        <form onSubmit={handleSendMessage} className="flex items-center gap-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 bg-gray-700 rounded-full text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button type="submit" className="p-2 bg-blue-600 rounded-full text-white hover:bg-blue-700">
            <IoSend size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
