import React from "react";
import { Switch, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Registration from "./pages/Registration";
import SelectedGame from "./pages/SelectedGame";
import Basket from "./pages/Basket";
import PersonalAccount from "./pages/PersonalAccount";
import Authorization from "./pages/Authorization";
import Admin from "./pages/Admin/Admin";
import SelectedGameAuthor from "./pages/SelectedGameAuthor";
import { PrivateRoute, AdminPrivateRoute } from "./PrivateRoutes";
import { useAuth } from "./hooks/authHook";

export const useRoutes = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <Switch>
      <Route path="/registration" component={Registration} exact />
      <Route path="/authorization" component={Authorization} exact />
      <Route path="/selected-game/:id" component={SelectedGame} exact />
      <Route path="/selected-game-author/:id" component={SelectedGameAuthor} exact />
      <PrivateRoute path="/basket" isAuthenticated={isAuthenticated} component={Basket} exact />
      <PrivateRoute path="/account" isAuthenticated={isAuthenticated} component={PersonalAccount} exact />
      <AdminPrivateRoute
        path="/admin-panel"
        isAdmin={isAdmin}
        isAuthenticated={isAuthenticated}
        component={Admin}
        exact
      />
      <Route path="/" component={HomePage} exact />
    </Switch>
  );
};
