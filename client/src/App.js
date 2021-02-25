import React from "react";
import { BrowserRouter } from "react-router-dom";
import { useRoutes } from "./routes";
import { Navbar } from "./components/Navbar";
import { useAuth } from "./hooks/authHook";
import { AuthContext } from "./context/AuthContext";
import "./styles/body.scss";

function App() {
  const { token, logout, userId } = useAuth();
  const isAuthenticated = !!token;
  const routes = useRoutes();

  return (
    <AuthContext.Provider value={{ token, logout, userId, isAuthenticated }}>
      <BrowserRouter>
        <Navbar />
        <div>{routes}</div>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
