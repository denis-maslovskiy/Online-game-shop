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
      const { data } = await axios.post("/api/auth/registration", { ...userData });
      dispatch(successMessage(data.message));
      dispatch(setCurrentUser(data.user));
      localStorage.setItem("userData", JSON.stringify({ ...data, userId: data.user.id, isAdmin: data.user.isAdmin }));
      window.location.href = "/";
    } catch (e) {
      dispatch(errorMessage(e.response.data.message));
    }
  };
};

export const loginUser = (userData) => {
  return async (dispatch) => {
    try {
      const { data } = await axios.post("/api/auth/login", { ...userData });
      dispatch(setCurrentUser(data));
      localStorage.setItem("userData", JSON.stringify({ ...data, userId: data.userId, isAdmin: data.user.isAdmin }));
      window.location.href = "/";
    } catch (e) {
      dispatch(errorMessage(e.response.data.message));
    }
  };
};
