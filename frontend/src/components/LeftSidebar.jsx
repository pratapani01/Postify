import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Import Icons
import { GoHomeFill, GoPlusCircle } from 'react-icons/go';
import { FaRegUser } from 'react-icons/fa';
import { IoChatbubbleEllipsesOutline, IoSparklesOutline } from 'react-icons/io5';
import { FiLogIn, FiLogOut } from 'react-icons/fi';

const LeftSidebar = () => {
  const { currentUser, logoutUser } = useAuth();

  // Helper function for NavLink styling
  const getLinkClass = ({ isActive }) =>
    `flex items-center gap-x-4 py-2 px-4 rounded-full text-xl font-semibold transition-colors duration-200 ${
      isActive
        ? 'text-white bg-white/10'
        : 'text-gray-400 hover:bg-white/5 hover:text-white'
    }`;

  return (
    <aside className="w-[275px] p-4 flex flex-col justify-between h-screen sticky top-0">
      <div>
        {/* Logo */}
        <Link to="/" className="mb-5 inline-block">
          <img src="/logo.png" alt="Postify Logo" className="w-25 h-15" />
        </Link>

        {/* Navigation Links */}
        <nav className="flex flex-col items-start space-y-2">
          <NavLink to="/" className={getLinkClass}>
            <GoHomeFill size={28} />
            <span>Home</span>
          </NavLink>
          <NavLink to="/messages" className={getLinkClass}>
            <IoChatbubbleEllipsesOutline size={28} />
            <span>Messages</span>
          </NavLink>
          <NavLink to="/imagine" className={getLinkClass}>
            <IoSparklesOutline size={28} />
            <span>Imagine</span>
          </NavLink>
          {/* Create link is now a regular nav link */}
          <NavLink to="/create" className={getLinkClass}>
            <GoPlusCircle size={28} />
            <span>Create</span>
          </NavLink>
          <NavLink to={`/profile/${currentUser?.username || ''}`} className={getLinkClass}>
            <FaRegUser size={24} />
            <span>Profile</span>
          </NavLink>
        </nav>
      </div>

      {/* Logout/Login Button */}
      <div className="mt-auto">
        {currentUser ? (
          <button onClick={logoutUser} className="w-full flex items-center gap-x-4 py-2 px-4 rounded-full text-xl font-semibold text-gray-400 hover:bg-white/5 hover:text-white">
            <FiLogOut size={26} />
            <span>Logout</span>
          </button>
        ) : (
          <NavLink to="/login" className={getLinkClass}>
            <FiLogIn size={26} />
            <span>Login</span>
          </NavLink>
        )}
      </div>
    </aside>
  );
};

export default LeftSidebar;
