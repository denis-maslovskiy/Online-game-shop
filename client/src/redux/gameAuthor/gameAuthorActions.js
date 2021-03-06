import axios from "axios";
import {
  SET_ALL_GAME_AUTHORS,
  UPDATE_GAME_AUTHOR_ARRAY,
  DELETE_GAME_AUTHOR,
  SET_SELECTED_GAME_AUTHOR_DATA,
} from "./gameAuthorTypes";
import { successMessage } from "../notification/notificationActions";

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
  return async () => {
    try {
      await axios.post("/api/admin/create-game-author", { ...newAuthor });
    } catch (e) {
      console.log(e.response.data.message);
    }
  };
};

export const getAllAuthors = (userId) => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get("/api/game-author/get-all-game-authors");
      const { data: games } = await axios.get("/api/games/get-all-games");
      const authorsToReturn = [];

      // Prevent displaying of Game Authors without existing in shop games
      data.forEach(author => {
        let numberOfChecks = 0;
        author.authorsGames.forEach(authorGame => {
          games.forEach(game => {
            if(game.gameName === authorGame.gameName) {
              numberOfChecks++;
            }
          })
        })
        if(numberOfChecks === author.authorsGames.length) {
          authorsToReturn.push(author);
        } else {
          axios.delete(`/api/admin/delete-game-author/${author._id}`, { data: { ...userId } });
        }
      })

      dispatch(setAllGameAuthors(authorsToReturn));
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

export const adminUpdateGameAuthorData = (gameAuthorId, gameAuthor, userId, selectedFile, isNeedSuccessMessage = false) => {
  return async (dispatch) => {
    try {
      const {data:{message}} = await axios.put(`/api/admin/edit-game-author-info/${gameAuthorId}`, { ...gameAuthor, userId });
      dispatch(updateGameAuthorArray(gameAuthor));
      if(isNeedSuccessMessage) {
        dispatch(successMessage(message))
      }

      if (selectedFile) {
        const { data } = await axios.get(`/api/game-author/get-selected-game-author/${gameAuthorId}`);

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
        };
      }
    } catch (e) {
      console.log(e.response.data.message);
    }
  };
};

export const adminDeleteGameAuthor = (gameAuthorId, userId) => {
  return async (dispatch) => {
    try {
      await axios.delete(`/api/admin/delete-game-author/${gameAuthorId}`, { data: { ...userId } });
      dispatch(updateGameArrayAfterDeletingTheGameAuthor(gameAuthorId));
    } catch (e) {
      console.log(e.response.data.message);
    }
  };
};
