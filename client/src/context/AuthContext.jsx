import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authToken, setAuthToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
    window.addEventListener('storage', checkAuthStatus);
    
    return () => {
      window.removeEventListener('storage', checkAuthStatus);
    };
  }, []);

  const checkAuthStatus = () => {
    // Check localStorage
    const localToken = JSON.parse(localStorage.getItem('auth_token'));
    const userInfoData = JSON.parse(localStorage.getItem('user_info'));
    
    // Check cookies (basic approach)
    const cookieString = document.cookie;
    const cookieToken = cookieString
      .split('; ')
      .find(row => row.startsWith('auth_token='))
      ?.split('=')[1];
    
    // Parse cookie token if it exists
    let parsedCookieToken = null;
    try {
      if (cookieToken) {
        parsedCookieToken = JSON.parse(decodeURIComponent(cookieToken));
      }
    } catch (e) {
      console.error("Error parsing cookie token", e);
    }
    
    // Set values
    const token = localToken || parsedCookieToken;
    setAuthToken(token);
    setUserInfo(userInfoData);
    setIsAuthenticated(token !== null);
    setLoading(false);
  };

  const login = (token, userInfo) => {
    setAuthToken(token);
    setUserInfo(userInfo);
    setIsAuthenticated(true);
  };

  const logout = () => {
    // Clear localStorage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_info');
    
    // Clear cookies
    document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    
    setAuthToken(null);
    setUserInfo(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      authToken,
      userInfo,
      loading,
      login,
      logout,
      checkAuthStatus
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);