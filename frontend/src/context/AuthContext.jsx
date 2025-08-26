import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // App start hone par, localStorage se user ki info load karein
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo) {
      setCurrentUser(userInfo);
    }
  }, []);

  const login = (userData) => {
    localStorage.setItem('userInfo', JSON.stringify(userData));
    setCurrentUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('userInfo');
    setCurrentUser(null);
  };

  const updateUser = (updatedData) => {
    // Yeh function profile update hone par nayi info save karega
    const newUserData = { ...currentUser, ...updatedData };
    localStorage.setItem('userInfo', JSON.stringify(newUserData));
    setCurrentUser(newUserData);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Ek custom hook taaki hum aasani se user ki info access kar sakein
export const useAuth = () => useContext(AuthContext);
