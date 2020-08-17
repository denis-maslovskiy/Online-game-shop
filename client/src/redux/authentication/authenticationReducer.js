import { SET_CURRENT_USER } from "./authenticationTypes";
import { updateObject } from "../reducerHelpers";

const initialState = {
  user: {},
  token: JSON.parse(localStorage.getItem('userData')) ? JSON.parse(localStorage.getItem('userData')).token : ""
};

const setCurrentUser = (state, action) => {
  const { user, token } = action.payload;

  return updateObject(state, { ...user, token });
};

const authenticationReducer = (state = initialState, action) => {
  console.log(action);
  switch (action.type) {
    case SET_CURRENT_USER:
      return setCurrentUser(state, action);

    default:
      return state;
  }
};

export default authenticationReducer;
