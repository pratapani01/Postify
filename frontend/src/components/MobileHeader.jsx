import React from 'react';
import { Link } from 'react-router-dom';

const MobileHeader = () => {
  return (
    // This header is fixed to the top and only visible on screens smaller than lg
    <header className="fixed top-0 left-0 right-0 h-16 bg-gray-900 border-b border-gray-700 z-40 flex items-center justify-center lg:hidden">
      <Link to="/">
        <img src="/logo.png" alt="Postify Logo" className="w-40 h-15" />
      </Link>
    </header>
  );
};

export default MobileHeader;
