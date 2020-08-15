import { useState, useEffect } from "react";

export const useAuth = () => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);

  const logout = ()=> {
    localStorage.removeItem('userData');
    setToken(null);
    setUserId(null);
  }
  
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("userData"));

    if (data && data.token) {
      setToken(data.token);
      setUserId(data.userId);
    }
  }, []);

  return { logout, token, userId, isAuthenticated: !!token };
};
