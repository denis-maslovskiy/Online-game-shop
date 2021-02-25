import React from "react";
import { BrowserRouter } from "react-router-dom";
import { useRoutes } from "./routes";
import { Navbar } from "./components/Navbar";
import { useAuth } from "./hooks/authHook";
import { DependenciesContext } from "./context/DependenciesContext";
import "./styles/body.scss";

function App() {
  const { token, logout, userId, isAdmin } = useAuth();
  const isAuthenticated = !!token;
  const routes = useRoutes();
  const cloudName = "dgefehkt9";

  return (
    <DependenciesContext.Provider value={{ token, logout, userId, isAuthenticated, isAdmin, cloudName }}>
      <BrowserRouter>
        <Navbar />
        <div>{routes}</div>
      </BrowserRouter>
    </DependenciesContext.Provider>
  );
}

export default App;
