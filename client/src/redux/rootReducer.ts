import { combineReducers } from "redux";
import notificationReducer from "./notification/notificationReducer";
import authenticationReducer from "./authentication/authenticationReducer";
import gamesReducer from "./games/gamesReducer";
import userReducer from "./user/userReducer";
import achievementReducer from "./achievement/achievementReducer";

const rootReducer = combineReducers({
  notification: notificationReducer,
  authentication: authenticationReducer,
  games: gamesReducer,
  user: userReducer,
  achievement: achievementReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
