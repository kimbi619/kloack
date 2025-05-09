import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleKeycloakLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const callbackUrl = `${window.location.origin}/callback`;
      console.log('Request to auth endpoint with callback:', callbackUrl);
      
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL || 'http://172.105.75.119:8000/api'}/auth/`, 
        {
          params: {
            redirect_uri: callbackUrl
          }
        }
      );
      
      console.log('Auth response:', response.data);
      
      if (response.data && response.data.auth_url) {
        window.location.href = response.data.auth_url;
      } else {
        setError('Failed to get authentication URL');
      }
    } catch (err) {
      console.error('Error initiating Keycloak login:', err);
      setError(`Failed to connect to authentication server: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <p>This is the public home page of the application.</p>
      <p>Please login or register to access more features.</p>
      
      <button 
        onClick={handleKeycloakLogin} 
        disabled={loading}
      >
        {loading ? 'Connecting...' : 'Login with Keycloak'}
      </button>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  )
}

export default Home
