import axios from "axios";
import { SET_CURRENT_USER } from "./authenticationTypes";
import {
  successMessage,
  errorMessage,
} from "../notification/notificationActions";

export const setCurrentUser = (decoded) => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded,
  };
};

export const registerUser = (userData) => {
  return async (dispatch) => {
    try {
      const response = await axios.post("/api/auth/registration", {
        ...userData,
      });
      dispatch(successMessage(response.data.message));
      const loginResponse = await axios.post("/api/auth/login", {
        ...userData,
      });
      dispatch(setCurrentUser(loginResponse.data));

      // return {
      //   token: loginResponse.data.token,
      //   userId: loginResponse.data.userId,
      // };
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
      return response;
    } catch (e) {
      dispatch(errorMessage(e.response.data.message));
    }
  };
};
