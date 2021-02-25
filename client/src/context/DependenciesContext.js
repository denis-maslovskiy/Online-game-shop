import { createContext } from "react";

function noop() {}

export const DependenciesContext = createContext({
  token: null,
  userId: null,
  login: noop,
  logout: noop,
  isAuthenticated: false,
  isAdmin: false,
  cloudName: "",
});
