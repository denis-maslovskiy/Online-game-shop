import axios from "axios";
import { SET_CURRENT_USER } from "./authenticationTypes";
import { successMessage, errorMessage } from "../notification/notificationActions";

export const setCurrentUser = (decoded) => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded,
  };
};

export const registerUser = (userData) => {
  return async (dispatch) => {
    try {
      const response = await axios.post("/api/auth/registration", { ...userData });
      dispatch(successMessage(response.data.message));
      dispatch(setCurrentUser(response.data.user));
      localStorage.setItem(
        "userData",
        JSON.stringify({
          userId: response.data.user.id,
          token: response.data.token,
          isAdmin: response.data.user.isAdmin,
        })
      );
      window.location.href = "/";
    } catch (e) {
      dispatch(errorMessage(e.response.data.message));
    }
  };
};

export const loginUser = (userData) => {
  return async (dispatch) => {
    try {
      const response = await axios.post("/api/auth/login", { ...userData });
      dispatch(setCurrentUser(response.data));
      localStorage.setItem(
        "userData",
        JSON.stringify({
          userId: response.data.userId,
          token: response.data.token,
          isAdmin: response.data.user.isAdmin,
        })
      );
      window.location.href = "/";
    } catch (e) {
      dispatch(errorMessage(e.response.data.message));
      console.log(e);
    }
  };
};
