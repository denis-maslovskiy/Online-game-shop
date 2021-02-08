import axios from "axios";
import { successMessage, errorMessage, infoMessage } from "../notification/notificationActions";
import {  SET_ALL_USERS, SET_USER_DATA } from './userTypes';

export const setAllUser = (users) => {
  return {
    type: SET_ALL_USERS,
    payload: users
  }
}

export const setUserData = (user) => {
  return {
    type: SET_USER_DATA,
    payload: user
  }
}

export const getUserData = (userId) => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`/api/user/${userId}`);
      dispatch(setUserData(response.data));
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
      const response = await axios.put(`/api/user/purchase-game/${userId}`, user);
      dispatch(successMessage(response.data.message));
    } catch (e) {
      console.log(e.response.data.message);
    }
  };
};

export const removeGameFromBasket = (userId, user) => {
  return async (dispatch) => {
    try {
      const response = await axios.delete(`/api/user/remove-game-from-basket/${userId}`, { data: { ...user } });
      dispatch(infoMessage(response.data.message));
    } catch (e) {
      console.log(e.response.data.message);
    }
  };
};

export const getAllUsers = (userId) => {
  return async (dispatch) => {
    try {
      const response = await axios.get("/api/admin/get-all-users", { params: { ...userId } });
      dispatch(setAllUser(response.data))
    } catch (e) {
      console.log(e.response.data.message);
    }
  }
}