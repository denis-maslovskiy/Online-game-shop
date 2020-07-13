import {
  AXIOS_SUCCESS_MESSAGE,
  AXIOS_ERROR_MESSAGE,
  SET_CURRENT_USER,
  CLEAR_ERROR_MESSAGE,
} from "./notificationTypes";

export const successMessage = (successMsg) => {
  return {
    type: AXIOS_SUCCESS_MESSAGE,
    payload: successMsg,
  };
};

export const errorMessage = (errorMsg) => {
  return {
    type: AXIOS_ERROR_MESSAGE,
    payload: errorMsg,
  };
};

export const clearErrorMessage = () => {
  return {
    type: CLEAR_ERROR_MESSAGE,
  };
};

export const setCurrentUser = (decoded) => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded,
  };
};
