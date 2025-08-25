import React from 'react';
import { Link } from 'react-router-dom';
// Importing specific icons we need
import { IoChatbubbleEllipsesOutline, IoSunnyOutline, IoMoonOutline } from 'react-icons/io5';

const TopNavbar = () => {
  // We'll add theme switching logic here later
  const isDarkMode = false; // Placeholder

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white/30 dark:bg-gray-900/30 backdrop-blur-lg shadow-sm z-50 flex items-center justify-between px-4 sm:px-6">
      {/* App Logo/Name - Styled as requested */}
      <Link to="/">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-500 text-transparent bg-clip-text">
          Postify
        </h1>
      </Link>

      {/* Action Icons */}
      <div className="flex items-center gap-x-5">
        <Link to="/messages">
          <IoChatbubbleEllipsesOutline size={26} className="text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400" />
        </Link>

        <button>
          {isDarkMode ? (
            <IoSunnyOutline size={26} className="text-gray-700 dark:text-gray-200 hover:text-yellow-500" />
          ) : (
            <IoMoonOutline size={26} className="text-gray-700 dark:text-gray-200 hover:text-indigo-500" />
          )}
        </button>

        {/* Placeholder for Profile Picture/Dropdown */}
        <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600"></div>
      </div>
    </header>
  );
};

export default TopNavbar;