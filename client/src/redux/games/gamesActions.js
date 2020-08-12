import axios from "axios";
import { SET_ALL_GAMES } from './gamesTypes'

export const setAllGames = (decoded) => {
  return {
    type: SET_ALL_GAMES,
    payload: decoded
  }
}

export const getAllGames = () => {
  return async (dispatch) => {
    try {
      const response = await axios.get("/api/games/getAllGames");
      // dispatch(setAllGames(response.data));
      return response.data;
    } catch (e) {
      console.log(e.response.data.message);
    }
  };
};

export const getGameInfo = (gameId) => {
  return async () => {
    try {
      const response = await axios.get(`/api/games/${gameId}`);
      return response.data;
    } catch (e) {
      console.log(e.response.data.message);
    }
  };
};

export const updateGameData = (gameId, game) => {
  return async () => {
    try {
      await axios.put(`/api/games/${gameId}`, game);
    } catch (e) {
      console.log(e.response.data.message);
    }
  };
};
