// utils/auth.js
import Cookies from 'js-cookie'
import {jwtDecode} from 'jwt-decode'

export const getToken = () => {
  return Cookies.get('token')
}

export const getUserFromToken = () => {
  const token = getToken()
  
  
  if (!token) return null
  try {
    return jwtDecode(token) // retourne {id, role, exp, ...}
  } catch (e) {
    alert(e)
    return null
  }
}

export const isAuthenticated = () => {
  const user = getUserFromToken()
  
  return user !== null
}
