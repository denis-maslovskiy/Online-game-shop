import React from "react";
import { BrowserRouter } from "react-router-dom";
import { useRoutes } from "./routes";
import { Navbar } from "./components/Navbar";
import { useAuth } from "./hooks/authHook";
import { AuthContext } from "./context/AuthContext";

function App() {
  const { login, logout, token, userId } = useAuth();
  const isAuthenticated = !!token;

  const routes = useRoutes(isAuthenticated);

  return (
    <AuthContext.Provider
      value={{ login, logout, token, userId, isAuthenticated }}
    >
      <BrowserRouter>
        <Navbar />
        <div>{routes}</div>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
