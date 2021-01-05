import React from "react";
import { Route, Redirect } from "react-router-dom";

export const PrivateRoute = ({ component: Component, isAuthenticated, ...rest }) => (
  <Route {...rest} render={(props) => (!isAuthenticated ? <Redirect to="/" /> : <Component {...props} />)} />
);

export const AdminPrivateRoute = ({ component: Component, isAuthenticated, isAdmin, ...rest }) => (
  <Route {...rest} render={(props) => (isAuthenticated && isAdmin ? <Component {...props} /> : <Redirect to="/" />)} />
);
