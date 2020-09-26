import axios from "axios";
import { SET_ALL_GAMES,  SET_GAME_DATA, UPDATE_GAME_ARRAY } from './gamesTypes'

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

export const updateGameArray = (updatedGame) => {
  return {
    type: UPDATE_GAME_ARRAY,
    payload: updatedGame
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

export const updateGameData = (gameId, game) => { // dispatch, обновить массив игр в сторе
  return async (dispatch) => {
    try {
      await axios.put(`/api/games/${gameId}`, game);
      dispatch(updateGameArray(game))
      console.log('test...');
    } catch (e) {
      console.log(e.response.data.message);
    }
  };
};