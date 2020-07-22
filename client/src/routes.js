import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import Registration from "./pages/Registration";
import { SelectedGame } from "./pages/SelectedGame";
import { Basket } from "./pages/Basket";
import { PersonalAccount } from "./pages/PersonalAccount";
import Authorization from "./pages/Authorization";

export const useRoutes = () => {
  return (
    <Switch>
      <Route path="/" exact>
        <HomePage />
      </Route>

      <Route path="/registration" exact>
        <Registration />
      </Route>

      <Route path="/selectedgame" exact>
        <SelectedGame />
      </Route>

      <Route path="/authorization" exact>
        <Authorization />
      </Route>

      <Route path="/account" exact>
        <PersonalAccount />
      </Route>

      <Route path="/basket" exact>
        <Basket />
      </Route>

      <Redirect to="/authorization" />
    </Switch>
  );
};
