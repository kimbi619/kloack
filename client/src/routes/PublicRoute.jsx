import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from '../page/auth/Login'
import Register from '../page/auth/Register'
import Home from '../page/public/home/Home'
import Callback from '../page/auth/Callback'
import AuthSuccess from '../page/auth/AuthSuccess'

const PublicRoute = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} /> */}
        <Route path="/callback" element={<Callback />} />
        <Route path="/auth-success" element={<AuthSuccess />} />
      </Routes>
    </div>
  )
}

export default PublicRoute
