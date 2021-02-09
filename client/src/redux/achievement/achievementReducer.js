import { SET_ALL_ACHIEVEMENTS, UPDATE_ACHIEVEMENT_ARRAY, DELETE_ACHIEVEMENT } from "./achievementTypes";

const initialState = {
  allAchievements: [],
};

const updateAchievementArray = (action, state) => {
  const updatedAchievement = action.payload;
  state.allAchievements.map((achieve, index) => {
    if (achieve._id === updatedAchievement._id) {
      state.allAchievements[index] = updatedAchievement;
    }
    return achieve;
  });
  return state;
};

const updateAchievementArrayAfterDeletingTheAchievement = (action, state) => {
  state.allAchievements.map((achieve, index) => {
    if (achieve._id === action.payload) {
      state.allAchievements.splice(index, 1);
    }
    return achieve;
  });
  return state;
};

const achievementReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ALL_ACHIEVEMENTS:
      return {
        ...state,
        allAchievements: action.payload,
      };
    case UPDATE_ACHIEVEMENT_ARRAY:
      return updateAchievementArray(action, state);
    case DELETE_ACHIEVEMENT:
      return updateAchievementArrayAfterDeletingTheAchievement(action, state);
    default:
      return state;
  }
};

export default achievementReducer;
