import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Import Icons
import { GoHomeFill, GoPlusCircle } from 'react-icons/go';
import { FaRegUser } from 'react-icons/fa';
import { IoChatbubbleEllipsesOutline, IoSparklesOutline } from 'react-icons/io5';
import { FiLogIn, FiLogOut } from 'react-icons/fi';

const BottomNavbar = () => {
  const { currentUser, logoutUser } = useAuth();

  // Helper function for NavLink styling
  const getLinkClass = ({ isActive }) => 
    `transition-colors duration-200 ${isActive ? "text-white" : "text-gray-400 hover:text-white"}`;

  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 w-auto max-w-md px-6 py-3 bg-gray-800/70 backdrop-blur-lg rounded-full shadow-lg z-50 lg:hidden">
      <div className="flex justify-around items-center gap-x-6">
        <NavLink to="/" className={getLinkClass}>
          <GoHomeFill size={28} />
        </NavLink>
        <NavLink to="/messages" className={getLinkClass}>
          <IoChatbubbleEllipsesOutline size={28} />
        </NavLink>
        <NavLink to="/create" className={getLinkClass}>
          <GoPlusCircle size={36} />
        </NavLink>
        <NavLink to="/imagine" className={getLinkClass}>
          <IoSparklesOutline size={28} />
        </NavLink>
        
        {currentUser ? (
          <>
            <NavLink to={`/profile/${currentUser.username}`} className={getLinkClass}>
              <FaRegUser size={24} />
            </NavLink>
            <button onClick={logoutUser} className="text-gray-400 hover:text-white">
              <FiLogOut size={26} />
            </button>
          </>
        ) : (
          <NavLink to="/login" className={getLinkClass}>
            <FiLogIn size={26} />
          </NavLink>
        )}
      </div>
    </nav>
  );
};

export default BottomNavbar;

