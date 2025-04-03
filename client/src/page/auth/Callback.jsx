import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Callback = () => {
  const [status, setStatus] = useState('Processing...');
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const searchParams = new URLSearchParams(location.search);
        const code = searchParams.get('code');
        
        if (!code) {
          setError('No authorization code received from Keycloak');
          return;
        }
        
        setStatus('Received authorization code, finalizing login...');
        
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/callback/`,
          {
            params: {
              code,
              redirect_uri: `${window.location.origin}/callback`
            }
          }
        );
        
        if (response.data && response.data.success) {
          setStatus('Authentication successful! Redirecting...');
          
          if (response.data.redirect_url) {
            window.location.href = response.data.redirect_url;
          } else {
            navigate('/dashboard');
          }
        } else {
          setError('Failed to complete authentication');
        }
      } catch (err) {
        console.error('Error during callback processing:', err);
        setError(`Authentication failed: ${err.message}`);
      }
    };

    handleCallback();
  }, [location, navigate]);

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h2>Keycloak Authentication</h2>
      {!error ? (
        <>
          <p>{status}</p>
          <div className="spinner" style={{ margin: '20px auto' }}>Loading...</div>
        </>
      ) : (
        <>
          <p style={{ color: 'red' }}>{error}</p>
          <button onClick={() => navigate('/login')}>Return to Login</button>
        </>
      )}
    </div>
  );
};

export default Callback;