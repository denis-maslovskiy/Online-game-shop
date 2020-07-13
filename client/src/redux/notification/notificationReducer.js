import {
  AXIOS_SUCCESS_MESSAGE,
  AXIOS_ERROR_MESSAGE,
  CLEAR_ERROR_MESSAGE,
} from "./notificationTypes";
import { updateObject } from "../reducerHelpers";

const initialState = {
  errorMsg: "",
  successMsg: "",
};

const setErrorMessage = (state, action) => {
  const errorMsg = action.payload;
  return updateObject(state, { errorMsg });
};

const setSuccessMessage = (state, action) => {
  const successMsg = action.payload;
  return updateObject(state, { successMsg });
};

const clearErrorMessage = (state) => {
  const errorMsg = "";
  return updateObject(state, { errorMsg });
};

const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case AXIOS_ERROR_MESSAGE:
      return setErrorMessage(state, action);

    case AXIOS_SUCCESS_MESSAGE:
      return setSuccessMessage(state, action);

    case CLEAR_ERROR_MESSAGE:
      return clearErrorMessage(state);

    default:
      return state;
  }
};

export default notificationReducer;
