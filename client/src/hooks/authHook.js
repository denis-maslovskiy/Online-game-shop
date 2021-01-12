import { useState, useEffect } from "react";

export const useAuth = () => {
  const [state, setState] = useState({
    token: null,
    userId: null,
    isAdmin: null,
  });

  const logout = () => {
    localStorage.removeItem("userData");
    setState({ token: null, userId: null, isAdmin: null });
  };

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("userData"));

    if (data && data.token) {
      setState({...data});
    }
  }, []);

  return { logout, ...state, isAuthenticated: !!state.token };
};
