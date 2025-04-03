import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from '../page/auth/Login'
import Register from '../page/auth/Register'
import Home from '../page/public/home/Home'

const PublicRoute = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  )
}

export default PublicRoute
