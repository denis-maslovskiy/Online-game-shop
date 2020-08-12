import axios from "axios";
import {
  successMessage,
  errorMessage,
  infoMessage,
} from "../notification/notificationActions";

export const getUserData = (userId) => {
  return async () => {
    try {
      const response = await axios.get(`/api/user/${userId}`);
      return response.data;
    } catch (e) {
      console.log(e.response.data.message);
    }
  };
};

export const addGameInTheBasket = (userId, user) => {
  return async (dispatch) => {
    try {
      const response = await axios.put(`/api/user/${userId}`, user);
      dispatch(successMessage(response.data.message));
      return response.data.message;
    } catch (e) {
      dispatch(errorMessage(e.response.data.message));
    }
  };
};

export const purchaseGame = (userId, user) => {
  return async (dispatch) => {
    try {
      const response = await axios.put(
        `/api/user/purchasegame/${userId}`,
        user
      );
      dispatch(successMessage(response.data.message));
    } catch (e) {
      console.log(e.response.data.message);
    }
  };
};

export const updateTheBasket = (userId, user) => {
  return async (dispatch) => {
    try {
      const response = await axios.put(
        `/api/user/updatethebasket/${userId}`,
        user
      );
      dispatch(infoMessage(response.data.message));
    } catch (e) {
      console.log(e.response.data.message);
    }
  };
};