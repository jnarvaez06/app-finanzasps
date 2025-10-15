import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Dashboard from '../pages/Dashboard'
import PrivateRoute from './PrivateRoute'
import Layout from '../layout/Layout'
import Categories from '../pages/Categories'
import SubCategories from '../pages/SubCategories'
import Accounts from '../pages/Accounts'
import Movements from '../pages/Movements'
import MonthlyPlan from '../pages/MonthlyPlan'
import MonthlyPlanHeader from '../pages/MonthlyPlanHeader'

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
					<Route path='/categories' element={<Categories />} />
					<Route path='/subcategories' element={<SubCategories />} />
					<Route path='/accounts' element={<Accounts />} />
					<Route path='/movements' element={<Movements />} />
					<Route path='/monthly_plan' element={<MonthlyPlan />} />
					<Route path='/monthly_plan_header' element={<MonthlyPlanHeader />} />
				</Route>
			</Routes>
		</>
	)
}
