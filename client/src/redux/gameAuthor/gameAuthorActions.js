import axios from "axios";
import { successMessage, errorMessage, infoMessage } from "../notification/notificationActions";
import {
  SET_ALL_GAME_AUTHORS,
  UPDATE_GAME_AUTHOR_ARRAY,
  DELETE_GAME_AUTHOR,
  SET_SELECTED_GAME_AUTHOR_DATA,
} from "./gameAuthorTypes";

export const setAllGameAuthors = (gameAuthors) => {
  return {
    type: SET_ALL_GAME_AUTHORS,
    payload: gameAuthors,
  };
};

export const setSelectedGameAuthorData = (gameAuthor) => {
  return {
    type: SET_SELECTED_GAME_AUTHOR_DATA,
    payload: gameAuthor,
  };
};

export const updateGameAuthorArray = (updatedGameAuthor) => {
  return {
    type: UPDATE_GAME_AUTHOR_ARRAY,
    payload: updatedGameAuthor,
  };
};

export const updateGameArrayAfterDeletingTheGameAuthor = (deletedGameAuthor) => {
  return {
    type: DELETE_GAME_AUTHOR,
    payload: deletedGameAuthor,
  };
};

export const adminAddAuthor = (newAuthor) => {
  return async (dispatch) => {
    try {
      const {
        data: { message },
      } = await axios.post("/api/admin/create-game-author", { ...newAuthor });
      dispatch(successMessage(message));
    } catch (e) {
      dispatch(errorMessage(e.response.data.message));
    }
  };
};

export const getAllAuthors = () => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get("/api/game-author/get-all-game-authors");
      dispatch(setAllGameAuthors(data));
    } catch (e) {
      console.log(e.response.data.message);
    }
  };
};

export const getSelectedGameAuthor = (gameAuthorId) => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get(`/api/game-author/get-selected-game-author/${gameAuthorId}`);
      dispatch(setSelectedGameAuthorData(data));
    } catch (e) {
      console.log(e.response.data.message);
    }
  };
};

export const adminUpdateGameAuthorData = (gameAuthorId, gameAuthor, userId, selectedFile ) => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get(`/api/game-author/get-selected-game-author/${gameAuthorId}`);

      if(selectedFile) {
        const reader = new FileReader();
        reader.readAsDataURL(selectedFile);
        reader.onloadend = async () => {
          const fileStr = reader.result;
          const {
            data: { uploadResponse },
          } = await axios.post("/api/admin/upload-image", { fileStr, userId });
          data.authorLogo = uploadResponse.public_id;
          await axios.put(`/api/admin/edit-game-author-info/${gameAuthorId}`, { ...data, userId });
          dispatch(updateGameAuthorArray(data));
        }
      }

      const {
        data: { message },
      } = await axios.put(`/api/admin/edit-game-author-info/${gameAuthorId}`, { ...gameAuthor, userId });
      dispatch(updateGameAuthorArray(gameAuthor));
      dispatch(successMessage(message));
    } catch (e) {
      dispatch(errorMessage(e.response.data.message));
    }
  };
};

export const adminDeleteGameAuthor = (gameAuthorId, userId) => {
  return async (dispatch) => {
    try {
      const {
        data: { message },
      } = await axios.delete(`/api/admin/delete-game-author/${gameAuthorId}`, { data: { ...userId } });
      dispatch(updateGameArrayAfterDeletingTheGameAuthor(gameAuthorId));
      dispatch(infoMessage(message));
    } catch (e) {
      dispatch(errorMessage(e.response.data.message));
    }
  };
};