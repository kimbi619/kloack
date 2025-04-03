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
        
        setAuthTokenLocal(parsedData.token);
        
        setUserInfo(parsedData.user_info);
        
        login(parsedData.token, parsedData.user_info);
        
        setLoading(false);
        
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
      <div>
        <h2>Authentication Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/')} >Return to Home</button>
      </div>
    );
  }
  
  return (
    <div>
      <p>Processing authentication...</p>
    </div>
  );
}