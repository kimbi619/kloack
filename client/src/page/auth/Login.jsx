import { useState, useContext, useEffect } from "react"
import { Link, Navigate, useNavigate, useLocation } from "react-router-dom"
import "./Login.css"
import { AuthContext } from "../../components/buttons/Buttons"
import { keycloakAuth } from '../../app/api'
import UseCookie from '../../hooks/UseCookie'
import useLocalStorage from '../../hooks/UseLocalStorage'
import Github from '../../assets/icons/github.svg'
import EyeOpen from '../../assets/icons/eye-open.svg'
import EyeClose from '../../assets/icons/eye-close.svg'
import axios from 'axios'

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [authTokenCookie, setAuthTokenCookie] = UseCookie('auth_token', null);
  const [authTokenLocal, setAuthTokenLocal] = useLocalStorage('auth_token', null);
  const [userInfo, setUserInfo] = useLocalStorage('user_info', null);

  const { user, login } = useContext(AuthContext)

  // Parse token data from URL if coming from auth callback
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenData = params.get('token_data');
    
    if (tokenData) {
      try {
        const parsedData = JSON.parse(tokenData);
        if (parsedData.token) {
          // Store the token
          setAuthTokenLocal(parsedData.token);
          
          // Store user info
          setUserInfo(parsedData.user_info);
          
          // Redirect to dashboard
          navigate('/dashboard');
          window.location.reload();
        }
      } catch (err) {
        console.error("Failed to parse token data:", err);
      }
    }
  }, [location, navigate, setAuthTokenLocal, setUserInfo]);

  if (user) {
    return <Navigate to="/dashboard" />
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const response = await keycloakAuth(formData.email, formData.password);
      
      if (response.success) {
        const authData = response.data;
        
        if (formData.rememberMe) {
          setAuthTokenLocal(authData);
        } else {
          setAuthTokenCookie(authData);
        }
        
        setUserInfo({
          email: formData.email,
        });
        
        navigate('/dashboard');
        window.location.reload();
      } else {
        setError('Invalid email or password. Please try again.');
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleKeycloakLogin = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL || 'http://172.105.75.119:8000'}/api/auth/`, {
        params: {
          redirect_uri: `${window.location.origin}/callback`
        }
      });
      
      if (response.data && response.data.auth_url) {
        // Redirect to Keycloak
        window.location.href = response.data.auth_url;
      } else {
        setError('Failed to generate authentication URL');
      }
    } catch (err) {
      setError('Failed to initialize login process');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="auth-card">
        <div className="card-header">
          <h1 className="card-title">Login</h1>
          <p className="card-description">Enter your email and password to login to your account</p>
        </div>

        <div className="card-content">
          <button 
            type="button" 
            className="social-button"
            onClick={handleKeycloakLogin}
            disabled={loading}
          >
            <img src={Github} alt="Github" className="social-icon" />
            {loading ? 'Please wait...' : 'Login with Keycloak'}
          </button>

          <div className="divider">
            <span>Or continue with</span>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                />
            </div>

            <div className="form-group">
              <div className="label-row">
                <label htmlFor="password">Password</label>
                <Link to="/forgot-password" className="forgot-link">
                  Forgot password?
                </Link>
              </div>
              <div className="password-input">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button type="button" className="toggle-password" onClick={togglePasswordVisibility}>
                  {showPassword ? (
                    <img src={EyeOpen} alt="Show Password" className="eye-icon" />
                  ) : (
                    <img src={EyeClose} alt="Hide Password" className="eye-icon" />
                  )}
                </button>
              </div>
            </div>

            <div className="checkbox-group">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Remember me</label>
            </div>

            <button type="submit" className="submit-button">
              Login
            </button>
          </form>
        </div>

        <div className="card-footer">
          <p className="redirect-text">
            Don't have an account?{" "}
            <Link to="/register" className="redirect-link">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

