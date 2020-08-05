import React from "react";
import { Switch, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Registration from "./pages/Registration";
import SelectedGame from "./pages/SelectedGame";
import Basket from "./pages/Basket";
import PersonalAccount from "./pages/PersonalAccount";
import Authorization from "./pages/Authorization";
import PrivateRoute from "./PrivateRoute";
import { useAuth } from "./hooks/authHook";

export const useRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Switch>
      <Route path="/registration" component={Registration} exact />
      <Route path="/authorization" component={Authorization} exact />
      <Route path="/selectedgame/:id" component={SelectedGame} exact />
      <PrivateRoute
        path="/basket"
        isAuthenticated={isAuthenticated}
        component={Basket}
        exact
      />
      <PrivateRoute
        path="/account"
        isAuthenticated={isAuthenticated}
        component={PersonalAccount}
        exact
      />
      <Route path="/" component={HomePage} exact />
    </Switch>
  );
};
