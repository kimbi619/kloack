import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useLocalStorage from '../../hooks/UseLocalStorage';
import UseCookie from '../../hooks/UseCookie';
import { useAuth } from '../../context/AuthContext';

export default function AuthSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authTokenLocal, setAuthTokenLocal] = useLocalStorage('auth_token', null);
  const [userInfo, setUserInfo] = useLocalStorage('user_info', null);
  const { login } = useAuth();
  
  useEffect(() => {
    const processTokenData = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const tokenData = params.get('token_data');
        
        if (!tokenData) {
          setError('No token data received');
          setLoading(false);
          return;
        }
        
        const parsedData = JSON.parse(tokenData);
        
        if (!parsedData.token) {
          setError('Invalid token data');
          setLoading(false);
          return;
        }
        
        console.log('Processing token data:', parsedData);
        
        // Store token in localStorage
        setAuthTokenLocal(parsedData.token);
        
        // Store user info in localStorage
        setUserInfo(parsedData.user_info);
        
        // Update auth context to reflect logged-in state
        login(parsedData.token, parsedData.user_info);
        
        // Set loading to false
        setLoading(false);
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } catch (err) {
        console.error('Failed to process token data:', err);
        setError('An error occurred while processing authentication data');
        setLoading(false);
      }
    };
    
    processTokenData();
  }, [location, navigate, setAuthTokenLocal, setUserInfo, login]);
  
  if (error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Authentication Error</h2>
        <p style={{ color: 'red' }}>{error}</p>
        <button 
          onClick={() => navigate('/')}
          style={{ padding: '0.5rem 1rem', marginTop: '1rem' }}
        >
          Return to Home
        </button>
      </div>
    );
  }
  
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <p>Processing authentication...</p>
    </div>
  );
}