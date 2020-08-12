import { SET_CURRENT_USER } from "./authenticationTypes";
import { updateObject } from "../reducerHelpers";

const initialState = {
  username: "",
  email: "",
  userId: JSON.parse(localStorage.getItem('userData')) ? JSON.parse(localStorage.getItem('userData')).userId : "",
  purchasedGames: [],
  dateOfRegistration: "",
  token: JSON.parse(localStorage.getItem('userData')) ? JSON.parse(localStorage.getItem('userData')).token : ""
};

const setCurrentUser = (state, action) => {
  const { user, token } = action.payload;
  const username = user.name,
    email = user.email,
    userId = user.id,
    dateOfRegistration = user.dateOfRegistration;

  return updateObject(state, { username, email, userId, dateOfRegistration, token });
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
