import React from 'react';
import { Link } from 'react-router-dom';
import { GoHomeFill, GoPlusCircle } from "react-icons/go";
import { FaRegUser } from "react-icons/fa";
import { IoChatbubbleEllipsesOutline } from 'react-icons/io5';

const LeftSidebar = () => {
  return (
    <aside className="w-64 p-4 sticky top-0">
      <div className="flex flex-col items-start space-y-6">
        {/* Logo */}
        <Link to="/" className="mb-4">
          <img src="/logo.png" alt="Postify Logo" className="w-40 h-15" />
        </Link>

        {/* Navigation Links */}
        <Link to="/" className="flex items-center gap-x-4 text-xl font-semibold text-gray-300 hover:text-white">
          <GoHomeFill size={28} />
          <span>Home</span>
        </Link>
        <Link to="/messages" className="flex items-center gap-x-4 text-xl font-semibold text-gray-300 hover:text-white">
          <IoChatbubbleEllipsesOutline size={28} />
          <span>Messages</span>
        </Link>
        <Link to="/create" className="flex items-center gap-x-4 text-xl font-semibold text-gray-300 hover:text-white">
          <GoPlusCircle size={28} />
          <span>Create</span>
        </Link>
        <Link to="/profile/me" className="flex items-center gap-x-4 text-xl font-semibold text-gray-300 hover:text-white">
          <FaRegUser size={24} />
          <span>Profile</span>
        </Link>
      </div>
    </aside>
  );
};

export default LeftSidebar;
