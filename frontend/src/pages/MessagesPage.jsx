import React, { useState, useEffect } from 'react';
import { getConversations } from '../services/apiService';
import ChatWindow from '../components/ChatWindow';

const Conversation = ({ conversation, currentUser, onClick, isSelected }) => {
  const otherUser = conversation.participants[0];

  return (
    <div 
      onClick={() => onClick(conversation)}
      className={`flex items-center p-3 rounded-lg cursor-pointer ${isSelected ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
    >
      <div className="w-12 h-12 rounded-full bg-gray-600 mr-4 flex-shrink-0">
        {otherUser.profilePicture && <img src={otherUser.profilePicture} alt={otherUser.username} className="w-full h-full object-cover rounded-full" />}
      </div>
      <div>
        <p className="font-bold text-white">{otherUser.username}</p>
        <p className="text-sm text-gray-400">
          {conversation.lastMessage ? conversation.lastMessage.text : 'Start a conversation'}
        </p>
      </div>
    </div>
  );
};

const MessagesPage = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedConversation, setSelectedConversation] = useState(null);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    setCurrentUser(userInfo);

    const fetchConversations = async () => {
      try {
        const data = await getConversations();
        setConversations(data);
      } catch (error) {
        console.error("Failed to fetch conversations", error);
      } finally {
        setLoading(false);
      }
    };

    if (userInfo) {
      fetchConversations();
    }
  }, []);

  return (
    <div className="flex h-[calc(100vh-4rem)] lg:h-screen"> {/* Adjusted height for mobile/desktop */}
      {/* Left Sidebar: Conversations List */}
      <div className="w-full lg:w-1/3 border-r border-gray-700">
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-xl font-bold text-white">Chats</h1>
        </div>
        <div className="p-2">
          {loading ? (
            <p className="text-gray-400 text-center">Loading conversations...</p>
          ) : (
            conversations.map(convo => (
              <Conversation 
                key={convo._id} 
                conversation={convo} 
                currentUser={currentUser}
                onClick={setSelectedConversation}
                isSelected={selectedConversation && selectedConversation._id === convo._id}
              />
            ))
          )}
        </div>
      </div>

      {/* Right Side: Chat Window */}
      <div className="hidden lg:flex w-2/3 flex-col">
        {selectedConversation ? (
          <ChatWindow selectedConversation={selectedConversation} currentUser={currentUser} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
