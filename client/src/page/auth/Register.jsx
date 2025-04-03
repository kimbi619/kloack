"use client"

import { useState, useContext } from "react"
import { Link, Navigate } from "react-router-dom"
import "./Register.css"
import { AuthContext } from "../../components/buttons/Buttons"
import Github from '../../assets/icons/github.svg'
import EyeOpen from '../../assets/icons/eye-open.svg'
import EyeClose from '../../assets/icons/eye-close.svg'


export default function Register() {
  const [showPassword, setShowPassword] = useState(false)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const { user, login } = useContext(AuthContext)

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/dashboard" />
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError("")

    if (!firstName || !lastName || !email || !password) {
      setError("Please fill in all fields")
      return
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long")
      return
    }

    const userData = {
      name: `${firstName} ${lastName}`,
      email: email,
    }

    login(userData)
  }

  return (
    <div className="register-container">
      <div className="auth-card">
        <div className="card-header">
          <h1 className="card-title">Create an account</h1>
          <p className="card-description">Enter your information to create an account</p>
        </div>

        <div className="card-content">
          <button className="social-button">
            <img src={Github} alt="Github" className="social-icon" />
            Continue with Github
          </button>

          <div className="divider">
            <span>Or continue with</span>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="name-row">
              <div className="form-group">
                <label htmlFor="firstName">First name</label>
                <input
                  id="firstName"
                  type="text"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last name</label>
                <input
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-input">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
              <p className="password-hint">Password must be at least 8 characters long</p>
            </div>

            <div className="checkbox-group">
              <input type="checkbox" id="terms" required />
              <label htmlFor="terms">
                I agree to the{" "}
                <Link to="/terms" className="terms-link">
                  terms of service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="terms-link">
                  privacy policy
                </Link>
              </label>
            </div>

            <button type="submit" className="submit-button">
              Create account
            </button>
          </form>
        </div>

        <div className="card-footer">
          <p className="redirect-text">
            Already have an account?{" "}
            <Link to="/login" className="redirect-link">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

