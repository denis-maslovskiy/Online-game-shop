import { useState, useCallback, useEffect } from "react";

export const useAuth = () => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("userData"));

    if (data && data.token) {
      setToken(data.token);
      setUserId(data.userId);
    }
  }, []);

  return { token, userId, isAuthenticated: !!token };
};
