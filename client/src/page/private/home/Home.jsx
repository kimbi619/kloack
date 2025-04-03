import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div>
      <h2>Welcome back you !!</h2>
      <p>This is a simple home page.</p>
      <p>Checkout the dashboard below</p>
      <Link to="/dashboard">
        <button className="btn btn-primary">Go to Dashboard</button>
      </Link>
    </div>
  )
}

export default Home
