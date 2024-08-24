import React from 'react'
import { useStateContext } from '../contexts/ContextProvider'
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoutes = () => {

    const { isLoggedIn } = useStateContext();

    return isLoggedIn ? <Outlet /> : <Navigate to='/' />

}

export default ProtectedRoutes