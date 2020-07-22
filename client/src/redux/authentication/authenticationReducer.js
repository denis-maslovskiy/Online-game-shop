import { SET_CURRENT_USER } from "./authenticationTypes";
import { updateObject } from "../reducerHelpers";

const initialState = {
  username: "",
  email: "",
  userId: "",
  purchasedGames: [],
  dateOfRegistration: "",
};

const setCurrentUser = (state, action) => {
  const username = action.payload.name,
    email = action.payload.email,
    userId = action.payload.id,
    dateOfRegistration = action.payload.dateOfRegistration;

  return updateObject(state, { username, email, userId, dateOfRegistration });
};

const authenticationReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CURRENT_USER:
      return setCurrentUser(state, action);

    default:
      return state;
  }
};

export default authenticationReducer;
