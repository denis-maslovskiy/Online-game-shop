import axios from "axios";
import { SET_ALL_GAMES, UPDATE_GAME_ARRAY, DELETE_GAME, GAME_FILTER, GAME_SORT, SET_GAME_DATA, CLEAR_GAME_DATA } from "./gamesTypes";
import { successMessage, errorMessage, infoMessage } from "../notification/notificationActions";

export const setSortedArray = (array) => {
  return {
    type: GAME_SORT,
    payload: array,
  };
};

export const setFilteredArray = (array) => {
  return {
    type: GAME_FILTER,
    payload: array,
  };
};

export const setAllGames = (games) => {
  return {
    type: SET_ALL_GAMES,
    payload: games,
  };
};

export const setGameData = (game) => {
  return {
    type: SET_GAME_DATA,
    payload: game
  }
}

export const updateGameArray = (updatedGame) => {
  return {
    type: UPDATE_GAME_ARRAY,
    payload: updatedGame,
  };
};

export const updateGameArrayAfterDeletingTheGame = (deletedGame) => {
  return {
    type: DELETE_GAME,
    payload: deletedGame,
  };
};

export const clearGameData = () => { 
  return {
    type: CLEAR_GAME_DATA
  }
}

let tempImageArray = [];

export const addGame = (newGame) => {
  return async (dispatch) => {
    try {
      tempImageArray = [];
      const response = await axios.post("/api/admin/create-game", { ...newGame });
      dispatch(successMessage(response.data.message));
    } catch (e) {
      console.log(e);
      dispatch(errorMessage(e.response.data.message));
    }
  };
};

export const getAllGames = () => {
  return async (dispatch) => {
    try {
      const response = await axios.get("/api/games/get-all-games");
      dispatch(setAllGames(response.data));
    } catch (e) {
      console.log(e.response.data.message);
    }
  };
};

export const getGameInfo = (gameId) => {
  return async (dispatch) => {
    try {
      console.log('test');
      const {data} = await axios.get(`/api/games/${gameId}`);
      console.log('redux data: ', data);
      dispatch(setGameData(data));
    } catch (e) {
      console.log(e.response.data.message);
    }
  }
};

export const updateGameData = (gameId, game) => {
  return async (dispatch) => {
    try {
      await axios.put(`/api/games/${gameId}`, game);
      dispatch(updateGameArray(game));
    } catch (e) {
      console.log(e);
    }
  };
};

export const adminUpdateGameData = (gameId, game) => {
  return async (dispatch) => {
    try {
      const {
        data: { message },
      } = await axios.put(`/api/admin/${gameId}`, game);
      dispatch(updateGameArray(game));
      dispatch(successMessage(message));
    } catch (e) {
      console.log(e);
      dispatch(errorMessage(e.response.data.message));
    }
  };
};

export const deleteGame = (gameId, userId) => {
  return async (dispatch) => {
    try {
      const {
        data: { message },
      } = await axios.delete(`/api/admin/${gameId}`, { data: { ...userId } });
      dispatch(updateGameArrayAfterDeletingTheGame(gameId));
      dispatch(infoMessage(message));
    } catch (e) {
      console.log(e);
      dispatch(errorMessage(e.response.data.message));
    }
  };
};

export const uploadGameImages = (fileStr, gameName, userId) => {
  return async () => {
    try {
      let createdGame = null;

      const { data } = await axios.get("/api/games/get-all-games");
      data.forEach((game) => {
        if (game.gameName === gameName) {
          return (createdGame = game);
        }
      });
      const {
        data: { uploadResponse },
      } = await axios.post("/api/admin/upload-game-images", { fileStr });

      if (!tempImageArray.includes(uploadResponse.public_id)) {
        tempImageArray.push(uploadResponse.public_id);
        createdGame.imgSource = tempImageArray;
      }

      await axios.put(`/api/admin/${createdGame._id}`, { ...createdGame, userId });
    } catch (e) {
      console.log(e);
    }
  };
};
