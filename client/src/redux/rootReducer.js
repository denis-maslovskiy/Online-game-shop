import { combineReducers } from "redux";
import notificationReducer from "./notification/notificationReducer";
import authenticationReducer from "./authentication/authenticationReducer";
import gamesReducer from './games/gamesReducer';
import adminReducer from './admin/adminReducer';

const rootReducer = combineReducers({
  notification: notificationReducer,
  authentication: authenticationReducer,
  games: gamesReducer,
  admin: adminReducer
});

export default rootReducer;
