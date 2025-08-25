import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoHomeFill, GoSignIn, GoSignOut } from "react-icons/go";
import { FaRegUser } from "react-icons/fa";
import { IoChatbubbleEllipsesOutline } from 'react-icons/io5';

const LeftSidebar = () => {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  return (
    <aside className="w-64 p-4 sticky top-0">
      <div className="flex flex-col items-start space-y-6 text-gray-300">
        {/* Logo */}
        <Link to="/" className="mb-4">
          <img src="/logo.png" alt="Postify Logo" className="w-10 h-10" />
        </Link>

        {/* Navigation Links */}
        <Link to="/" className="flex items-center gap-x-4 text-xl font-semibold hover:text-white">
          <GoHomeFill size={28} />
          <span>Home</span>
        </Link>
        <Link to="/messages" className="flex items-center gap-x-4 text-xl font-semibold hover:text-white">
          <IoChatbubbleEllipsesOutline size={28} />
          <span>Messages</span>
        </Link>
        
        {userInfo && (
          <Link to={`/profile/${userInfo.username}`} className="flex items-center gap-x-4 text-xl font-semibold hover:text-white">
            <FaRegUser size={24} />
            <span>Profile</span>
          </Link>
        )}

        {/* Conditional Login/Logout Button */}
        {userInfo ? (
          <button onClick={handleLogout} className="flex items-center gap-x-4 text-xl font-semibold hover:text-white">
            <GoSignOut size={28} />
            <span>Logout</span>
          </button>
        ) : (
          <Link to="/login" className="flex items-center gap-x-4 text-xl font-semibold hover:text-white">
            <GoSignIn size={28} />
            <span>Login</span>
          </Link>
        )}
      </div>
    </aside>
  );
};

export default LeftSidebar;
