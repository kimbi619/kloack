import { useState, useEffect } from 'react';
import './App.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import PrivateRoute from './routes/PrivateRoute';
import PublicRoute from './routes/PublicRoute';

function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; 
  }
  


  return (
      <div className="App">
        {isAuthenticated ? <PrivateRoute /> : <PublicRoute />}
      </div>
  );
}

export default App;