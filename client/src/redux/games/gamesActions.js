import axios from "axios";

export const getAllGames = () => {
  return async () => {
    try {
      const response = await axios.get("/api/games/getAllGames");
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
