import React from 'react';
import { Link } from 'react-router-dom';
// Import Icons
import { GoHomeFill, GoPlusCircle } from 'react-icons/go';
import { FaRegUser } from 'react-icons/fa';
import { IoChatbubbleEllipsesOutline, IoSunnyOutline, IoMoonOutline } from 'react-icons/io5';

const BottomNavbar = () => {

  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 w-auto max-w-sm px-6 py-3 bg-white/30 dark:bg-gray-900/30 backdrop-blur-lg rounded-full shadow-lg z-50">
      <div className="flex justify-around items-center gap-x-6 text-gray-700 dark:text-gray-200">
        <Link to="/" className="hover:text-blue-500 dark:hover:text-blue-400">
          <GoHomeFill size={28} />
        </Link>
        <Link to="/messages" className="hover:text-blue-500 dark:hover:text-blue-400">
          <IoChatbubbleEllipsesOutline size={28} />
        </Link>
        <Link to="/create" className="hover:text-blue-500 dark:hover:text-blue-400">
          <GoPlusCircle size={36} />
        </Link>
        <Link to="/profile/me" className="hover:text-blue-500 dark:hover:text-blue-400">
          <FaRegUser size={24} />
        </Link>
      </div>
    </nav>
  );
};

export default BottomNavbar;