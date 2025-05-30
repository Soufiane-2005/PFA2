import { createContext, useEffect, useState, useCallback } from "react";
import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true)
  
  const loadUser = useCallback(() => {
    const token = Cookies.get("token");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (e) {
        console.error("Token invalide", e);
        setUser(null);
      }
    }
    setLoading(false)
  },[]);

  

  useEffect(() => {
    loadUser();
    
  }, [loadUser]);


  return (
    <AuthContext.Provider value={{user , loading, loadUser}}>
      {children}
    </AuthContext.Provider>
  );
};
