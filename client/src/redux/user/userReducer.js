import { SET_ALL_USERS, SET_USER_DATA, SET_OPTION_FOR_ADMIN, CLEAR_OPTION_FOR_ADMIN } from "./userTypes";

const initialState = {
  allUsers: [],
  user: {},
  adminOptionData: {
    optionName: "",
    optionData: null,
  },
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
    case SET_OPTION_FOR_ADMIN:
      return {
        ...state,
        adminOptionData: action.payload,
      };
    case CLEAR_OPTION_FOR_ADMIN:
      return {
        ...state,
        adminOptionData: initialState.adminOptionData,
      };
    default:
      return state;
  }
};

export default userReducer;
