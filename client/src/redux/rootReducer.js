import { combineReducers } from "redux";
import notificationReducer from "./notification/notificationReducer";
import authenticationReducer from "./authentication/authenticationReducer";

const rootReducer = combineReducers({
  notification: notificationReducer,
  authentication: authenticationReducer,
});

export default rootReducer;
