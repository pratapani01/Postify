import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem('userInfo'))
  );

  const loginUser = (userData) => {
    localStorage.setItem('userInfo', JSON.stringify(userData));
    setCurrentUser(userData);
  };

  const logoutUser = () => {
    localStorage.removeItem('userInfo');
    setCurrentUser(null);
  };

  const updateUser = (updatedData) => {
    const storedUser = JSON.parse(localStorage.getItem('userInfo'));
    const newUserInfo = { ...storedUser, ...updatedData };
    localStorage.setItem('userInfo', JSON.stringify(newUserInfo));
    setCurrentUser(newUserInfo);
  };

  return (
    <AuthContext.Provider value={{ currentUser, loginUser, logoutUser, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
