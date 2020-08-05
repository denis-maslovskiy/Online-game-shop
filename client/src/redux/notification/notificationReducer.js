import {
  SUCCESS_MESSAGE,
  ERROR_MESSAGE,
  INFO_MESSAGE,
  CLEAR_ERROR_MESSAGE,
  CLEAR_SUCCESS_MESSAGE,
  CLEAR_INFO_MESSAGE,
} from "./notificationTypes";
import { updateObject } from "../reducerHelpers";

const initialState = {
  errorMsg: "",
  successMsg: "",
  infoMsg: "",
};

const setErrorMessage = (state, action) => {
  const errorMsg = action.payload;
  return updateObject(state, { errorMsg });
};

const setSuccessMessage = (state, action) => {
  const successMsg = action.payload;
  return updateObject(state, { successMsg });
};

const setInfoMessage = (state, action) => {
  const infoMsg = action.payload;
  return updateObject(state, { infoMsg });
};

const clearErrorMessage = (state) => {
  const errorMsg = "";
  return updateObject(state, { errorMsg });
};

const clearSuccessMessage = (state) => {
  const successMsg = "";
  return updateObject(state, { successMsg });
};

const clearInfoMessage = (state) => {
  const infoMsg = "";
  return updateObject(state, { infoMsg });
};

const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case ERROR_MESSAGE:
      return setErrorMessage(state, action);

    case SUCCESS_MESSAGE:
      return setSuccessMessage(state, action);

    case INFO_MESSAGE:
      return setInfoMessage(state, action);

    case CLEAR_ERROR_MESSAGE:
      return clearErrorMessage(state);

    case CLEAR_SUCCESS_MESSAGE:
      return clearSuccessMessage(state);

    case CLEAR_INFO_MESSAGE:
      return clearInfoMessage(state);

    default:
      return state;
  }
};

export default notificationReducer;
