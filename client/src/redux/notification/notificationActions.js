import {
  SUCCESS_MESSAGE,
  ERROR_MESSAGE,
  INFO_MESSAGE,
  SET_CURRENT_USER,
  CLEAR_ERROR_MESSAGE,
  CLEAR_SUCCESS_MESSAGE,
  CLEAR_INFO_MESSAGE,
} from "./notificationTypes";

export const successMessage = (successMsg) => {
  return {
    type: SUCCESS_MESSAGE,
    payload: successMsg,
  };
};

export const errorMessage = (errorMsg) => {
  return {
    type: ERROR_MESSAGE,
    payload: errorMsg,
  };
};

export const infoMessage = (infoMsg) => {
  return {
    type: INFO_MESSAGE,
    payload: infoMsg,
  };
};

export const clearErrorMessage = () => {
  return {
    type: CLEAR_ERROR_MESSAGE,
  };
};

export const clearSuccessMessage = () => {
  return {
    type: CLEAR_SUCCESS_MESSAGE,
  };
};

export const clearInfoMessage = () => {
  return {
    type: CLEAR_INFO_MESSAGE,
  };
};

export const setCurrentUser = (decoded) => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded,
  };
};
