import React from 'react';
import ChatWindow from '../components/ChatWindow';

const ChatPage = () => {
  // Yeh component abhi ke liye sirf ChatWindow ko render karega.
  // Hum ismein user details fetch karne ka logic baad mein daal sakte hain.
  return (
    <div className="h-[calc(100vh-4rem)] lg:h-screen">
      <ChatWindow />
    </div>
  );
};

export default ChatPage;
