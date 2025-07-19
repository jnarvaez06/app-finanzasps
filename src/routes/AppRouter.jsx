import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Dashboard from '../pages/Dashboard'
import PrivateRoute from './PrivateRoute'
import Layout from '../layout/Layout'

export default function AppRouter() {
	return (
		<>
			<Routes>
				{/* Rutas Publicas */}
				<Route path='/' element={<Login />}/>
				<Route path='/register' element={<Register />}/>

				{/* Rutas Protegidas */}
				<Route element={<PrivateRoute><Layout /></PrivateRoute>}>
					<Route path='/dashboard' element={<Dashboard />} />
				</Route>
			</Routes>
		</>
	)
}
