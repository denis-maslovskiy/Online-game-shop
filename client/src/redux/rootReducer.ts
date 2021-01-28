import { combineReducers } from "redux";
import notificationReducer from "./notification/notificationReducer";
import authenticationReducer from "./authentication/authenticationReducer";
import gamesReducer from "./games/gamesReducer";
import userReducer from './user/userReducer';

const rootReducer = combineReducers({
  notification: notificationReducer,
  authentication: authenticationReducer,
  games: gamesReducer,
  user: userReducer
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
