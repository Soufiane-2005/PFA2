// components/ProtectedRoute.jsx
import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'


export function ProtectedRoute({ children, allowedRoles }) {
  const {user , loading} = useContext(AuthContext)

  console.log(user)
  if (loading) {
    return <p>Chargement...</p>;
  }
  if (!user) {
  
    return <Navigate to="/login" />
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />
  }

  return children
}
