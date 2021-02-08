import axios from "axios";
import { SET_ALL_ACHIEVEMENTS, UPDATE_ACHIEVEMENT_ARRAY, DELETE_ACHIEVEMENT } from "./achievementTypes";
import { successMessage, errorMessage, infoMessage } from "../notification/notificationActions";

export const setAllAchievements = (achievements) => {
  return {
    type: SET_ALL_ACHIEVEMENTS,
    payload: achievements,
  };
};

export const updateAchievementArray = (newAchievement) => {
  return {
    type: UPDATE_ACHIEVEMENT_ARRAY,
    payload: newAchievement,
  };
};

export const updateAchievementArrayAfterDeletingTheAchievement = (deletedAchievement) => {
  return {
    type: DELETE_ACHIEVEMENT,
    payload: deletedAchievement,
  };
};

export const getAllAchievements = () => {
  return async (dispatch) => {
    try {
      const response = await axios.get("/api/achievement/get-all-achievements");
      dispatch(setAllAchievements(response.data));
    } catch (e) {
      console.log(e.response.data.message);
    }
  };
};

export const addAchievement = (newAchievement) => {
  return async (dispatch) => {
    try {
      const {
        data: { message },
      } = await axios.post("/api/admin/create-achievement", { ...newAchievement });
      dispatch(successMessage(message));
    } catch (e) {
      dispatch(errorMessage(e.response.data.message));
    }
  };
};

export const updateAchievementData = (achievementId, achievement) => {
  return async (dispatch) => {
    try {
      const {
        data: { message },
      } = await axios.put(`/api/admin/edit-achievement/${achievementId}`, achievement);
      dispatch(updateAchievementArray(achievement));
      dispatch(successMessage(message));
    } catch (e) {
      dispatch(errorMessage(e.response.data.message));
    }
  };
};

export const deleteAchievement = (achievementId, userId) => {
  return async (dispatch) => {
    try {
      const {
        data: { message },
      } = await axios.delete(`/api/admin/delete-achievement/${achievementId}`, { data: { ...userId } });
      dispatch(updateAchievementArrayAfterDeletingTheAchievement(achievementId));
      dispatch(infoMessage(message));
    } catch (e) {
      dispatch(errorMessage(e.response.data.message));
    }
  };
};
