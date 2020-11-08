import axios from "axios";
import {
  SET_ALL_GAMES,
  UPDATE_GAME_ARRAY,
  DELETE_GAME,
  GAME_FILTER,
  GAME_SORT
} from "./gamesTypes";

export const setSortedArray = (array) => {
  return {
    type: GAME_SORT,
    payload: array
  }
}

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

export const getAllGames = () => {
  return async (dispatch) => {
    try {
      const response = await axios.get("/api/games/getAllGames");
      dispatch(setAllGames(response.data));
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

export const deleteGame = (gameId) => {
  return async (dispatch) => {
    try {
      await axios.delete(`/api/games/${gameId}`);
      dispatch(updateGameArrayAfterDeletingTheGame(gameId));
    } catch (e) {
      console.log(e);
    }
  };
};
