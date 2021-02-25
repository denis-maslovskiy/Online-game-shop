import axios from "axios";
import { SET_ALL_GAMES, UPDATE_GAME_ARRAY, DELETE_GAME, GAME_FILTER, GAME_SORT } from "./gamesTypes";
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

export const addGame = (newGame) => {
  return async (dispatch) => {
    try {
      const {
        data: { message },
      } = await axios.post("/api/admin/create-game", { ...newGame });
      dispatch(successMessage(message));
    } catch (e) {
      console.log(e);
      dispatch(errorMessage(e.response.data.message));
    }
  };
};

export const getAllGames = () => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get("/api/games/get-all-games");
      dispatch(setAllGames(data));
    } catch (e) {
      console.log(e.response.data.message);
    }
  };
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
