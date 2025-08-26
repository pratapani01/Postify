import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getConversations } from '../services/apiService';

const Conversation = ({ conversation, currentUser }) => {
  // The backend now sends the other participant in the participants array
  const otherUser = conversation.participants[0];
  if (!otherUser) return null; // Safety check

  return (
    // Each conversation is a link to the specific chat page
    <Link to={`/messages/${otherUser._id}`} className="flex items-center p-3 hover:bg-gray-700 rounded-lg cursor-pointer">
      <div className="w-12 h-12 rounded-full bg-gray-600 mr-4 flex-shrink-0">
        {otherUser.profilePicture && <img src={otherUser.profilePicture} alt={otherUser.username} className="w-full h-full object-cover rounded-full" />}
      </div>
      <div>
        <p className="font-bold text-white">{otherUser.username}</p>
        <p className="text-sm text-gray-400">
          Click to view messages
        </p>
      </div>
    </Link>
  );
};

const MessagesPage = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    setCurrentUser(userInfo);

    const fetchConversations = async () => {
      if (!userInfo) return;
      try {
        const data = await getConversations();
        setConversations(data);
      } catch (error) {
        console.error("Failed to fetch conversations", error);
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, []);

  return (
    <div>
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold text-white">Chats</h1>
      </div>
      <div className="p-2">
        {loading ? (
          <p className="text-gray-400 text-center">Loading conversations...</p>
        ) : conversations.length > 0 ? (
          conversations.map(convo => (
            <Conversation key={convo._id} conversation={convo} currentUser={currentUser} />
          ))
        ) : (
          <p className="text-gray-400 text-center p-4">You have no conversations yet. Start one from a user's profile!</p>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
