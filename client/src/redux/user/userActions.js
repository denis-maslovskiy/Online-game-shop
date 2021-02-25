import axios from "axios";
import { successMessage, errorMessage, infoMessage } from "../notification/notificationActions";
import { SET_ALL_USERS, SET_USER_DATA } from "./userTypes";
import { reloadAchievements } from "../../helpers/userHelpers";

export const setAllUser = (users) => {
  return {
    type: SET_ALL_USERS,
    payload: users,
  };
};

export const setUserData = (user) => {
  return {
    type: SET_USER_DATA,
    payload: user,
  };
};

export const getUserData = (userId) => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get(`/api/user/${userId}`);
      dispatch(setUserData(data));
    } catch (e) {
      console.log(e.response.data.message);
    }
  };
};

export const addGameInTheBasket = (userId, user) => {
  return async (dispatch) => {
    try {
      const {
        data: { message },
      } = await axios.put(`/api/user/${userId}`, user);
      dispatch(successMessage(message));
    } catch (e) {
      dispatch(errorMessage(e.response.data.message));
    }
  };
};

export const purchaseGame = (userId, userData) => {
  return async (dispatch) => {
    try {
      const {
        data: { message, user },
      } = await axios.put(`/api/user/purchase-game/${userId}`, userData);
      reloadAchievements(user);
      dispatch(successMessage(message));
    } catch (e) {
      console.log(e.response.data.message);
    }
  };
};

export const removeGameFromBasket = (userId, user) => {
  return async (dispatch) => {
    try {
      const {
        data: { message },
      } = await axios.delete(`/api/user/remove-game-from-basket/${userId}`, { data: { ...user } });
      dispatch(infoMessage(message));
    } catch (e) {
      console.log(e.response.data.message);
    }
  };
};

export const getAllUsers = (userId) => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get("/api/admin/get-all-users", { params: { ...userId } });
      dispatch(setAllUser(data));
    } catch (e) {
      console.log(e.response.data.message);
    }
  };
};
