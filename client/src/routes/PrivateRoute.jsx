import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Dashboard from '../page/private/dashboard/Dashboard'
import Home from '../page/private/home/Home'

const PrivateRoute = () => {
  return (
    <div>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  )
}

export default PrivateRoute
