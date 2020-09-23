import axios from "axios";
import { SET_ALL_GAMES,  SET_GAME_DATA } from './gamesTypes'

export const setAllGames = (games) => {
  return {
    type: SET_ALL_GAMES,
    payload: games
  }
}

// Should be using in the SelectedGame page
export const setGameData = (decoded) => {
  return {
    type:  SET_GAME_DATA,
    payload: decoded
  }
}

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

export const getGameInfo = async (gameId) => { // убрать из редакса

    try {
      const response = await axios.get(`/api/games/${gameId}`);
      // dispatch(setGameData(response.data));
      return response.data; //
    } catch (e) {
      console.log(e.response.data.message);
    }
};

export const updateGameData = (gameId, game) => { // dispatch, обновить массив игр в сторе
  return async () => {
    try {
      await axios.put(`/api/games/${gameId}`, game);
    } catch (e) {
      console.log(e.response.data.message);
    }
  };
};

export const deleteGame = (gameId) => {
  return async () => {
    try {
      await axios.delete(`/api/games/${gameId}`);
    } catch (e) {
      console.log(e.response.data.message);
    }
  }
}