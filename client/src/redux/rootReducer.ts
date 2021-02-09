import { combineReducers } from "redux";
import notificationReducer from "./notification/notificationReducer";
import authenticationReducer from "./authentication/authenticationReducer";
import gamesReducer from "./games/gamesReducer";
import userReducer from "./user/userReducer";
import gameAuthorReducer from "./gameAuthor/gameAuthorReducer";
import achievementReducer from "./achievement/achievementReducer";

const rootReducer = combineReducers({
  notification: notificationReducer,
  authentication: authenticationReducer,
  games: gamesReducer,
  user: userReducer,
  gameAuthor: gameAuthorReducer,
  achievement: achievementReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
