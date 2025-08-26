import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoHomeFill, GoPlusCircle, GoSignIn } from "react-icons/go";
import { FaRegUser } from "react-icons/fa";
import { IoChatbubbleEllipsesOutline ,IoImageOutline} from 'react-icons/io5';

const BottomNavbar = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 w-auto max-w-sm px-6 py-3 bg-gray-800/50 backdrop-blur-lg rounded-full shadow-lg z-50">
      <div className="flex justify-around items-center gap-x-6 text-gray-300">
        <Link to="/" className="hover:text-white">
          <GoHomeFill size={28} />
        </Link>
        <Link to="/messages" className="hover:text-white">
          <IoChatbubbleEllipsesOutline size={28} />
        </Link>
        <Link to="/create" className="hover:text-white">
          <GoPlusCircle size={36} />
        </Link>
        <Link to="/imagine" className="hover:text-white">
          <IoImageOutline size={28} />
        </Link>

        {/* Conditional Profile/Login Icon */}
        {userInfo ? (
          <Link to={`/profile/${userInfo.username}`} className="hover:text-white">
            <FaRegUser size={24} />
          </Link>
        ) : (
          <Link to="/login" className="hover:text-white">
            <GoSignIn size={28} />
          </Link>
        )}
      </div>
    </nav>
  );
};

export default BottomNavbar;
