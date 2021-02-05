import { SET_ALL_USERS, SET_USER_DATA } from "./userTypes";

const initialState = {
  allUsers: [],
  user: {},
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ALL_USERS:
      return {
        ...state,
        allUsers: action.payload,
      };
    case SET_USER_DATA:
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
};

export default userReducer;
