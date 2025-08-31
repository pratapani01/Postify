import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getConversations } from '../services/apiService';
import { useAuth } from '../context/AuthContext';
import ChatWindow from '../components/ChatWindow';

const Conversation = ({ conversation, isActive }) => {
  const { currentUser } = useAuth();
  
  if (!conversation.otherParticipant) {
    return null;
  }

  const activeClasses = isActive ? 'bg-gray-700' : 'hover:bg-gray-700';

  return (
    <Link
      to={`/messages/${conversation.otherParticipant._id}`}
      className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${activeClasses}`}
    >
      <div className="w-12 h-12 rounded-full bg-gray-600 mr-4 flex-shrink-0">
        {conversation.otherParticipant.profilePicture && (
          <img
            src={conversation.otherParticipant.profilePicture}
            alt={conversation.otherParticipant.username}
            className="w-full h-full object-cover rounded-full"
          />
        )}
      </div>
      <div className="flex-1 overflow-hidden">
        <p className="font-bold text-white truncate">{conversation.otherParticipant.username}</p>
        <p className="text-sm text-gray-400 truncate">
          {conversation.lastMessage 
            ? `${conversation.lastMessage.senderId === currentUser._id ? 'You: ' : ''}${conversation.lastMessage.message}`
            : 'No messages yet.'
          }
        </p>
      </div>
    </Link>
  );
};

const ConversationList = ({ conversations, activeConversationId }) => (
  <div className="flex flex-col h-full">
    <div className="p-4 border-b border-gray-700">
      <h1 className="text-2xl font-bold text-white">Chats</h1>
    </div>
    <div className="flex-1 overflow-y-auto">
      {conversations.length > 0 ? (
        conversations.map((conv) => (
          <Conversation 
            key={conv._id} 
            conversation={conv} 
            isActive={activeConversationId === conv.otherParticipant?._id}
          />
        ))
      ) : (
        <div className="p-4 text-center text-gray-400">
          <p>You have no conversations yet. Start one from a user's profile!</p>
        </div>
      )}
    </div>
  </div>
);

const MessagesPage = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { otherUserId } = useParams();

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const data = await getConversations();
        setConversations(data);
      } catch (error) {
        console.error('Failed to fetch conversations', error);
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, []);

  if (loading) {
    return <div className="p-4 text-center text-gray-400">Loading conversations...</div>;
  }

  return (
    <div className="flex h-full">
      {/* Desktop: Conversation List */}
      <div className="hidden md:flex w-[400px] border-r border-gray-700 flex-col">
        <ConversationList conversations={conversations} activeConversationId={otherUserId} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1">
        {/* Desktop: Chat Window or Placeholder */}
        <div className="hidden md:block h-full">
          {otherUserId ? (
            <ChatWindow otherUserId={otherUserId} />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <p>Select a conversation to start chatting.</p>
            </div>
          )}
        </div>

        {/* Mobile: Show either Conversation List or Chat Window */}
        <div className="md:hidden h-full">
          {otherUserId ? (
            <ChatWindow otherUserId={otherUserId} />
          ) : (
            <ConversationList conversations={conversations} activeConversationId={otherUserId} />
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;

