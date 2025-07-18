import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Dashboard from '../pages/Dashboard'
import PrivateRoute from './PrivateRoute'

export default function AppRouter() {
  return (
    <>
        <Routes>
            <Route path='/' element={<Login />}/>
            <Route path='/register' element={<Register />}/>
            <Route path='/dashboard' element={<PrivateRoute><Dashboard /></PrivateRoute>}/>
        </Routes>
    </>
  )
}
