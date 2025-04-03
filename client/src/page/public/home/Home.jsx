import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <p>This is the public home page of the application.</p>
      <p>Please login or register to access more features.</p>
      <Link to="/login">
        <button>Login</button>
      </Link>
      <Link to="http://localhost:8080/realms/kloack/account">
        <button>Login with keycloak</button>
      </Link>
    </div>
  )
}

export default Home
