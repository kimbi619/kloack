import React, { createContext, useState, useContext, useEffect } from 'react';
import useLocalStorage from '../hooks/UseLocalStorage';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useLocalStorage('auth_token', null);
  const [user, setUser] = useLocalStorage('user_info', null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = () => {
      const token = authToken;
      if (token && user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false);
    };

    checkAuth();
  }, [authToken, user]);

  // Login function
  const login = (token, userData) => {
    setAuthToken(token);
    setUser(userData);
    setIsAuthenticated(true);
  };

  // Logout function
  const logout = () => {
    setAuthToken(null);
    setUser(null);
    setIsAuthenticated(false);
    // Clear localStorage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_info');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, user, login, logout, authToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);