import axios from "axios";

export const getGameInfo = async (gameId) => {
  try {
    const response = await axios.get(`/api/games/${gameId}`);
    return response.data;
  } catch (e) {
    console.log(e.response.data.message);
  }
};

export const deleteGame = async (gameId) => {
    try {
      await axios.delete(`/api/games/${gameId}`);
      // "game deleted" popup message can be added
    } catch (e) {
      console.log(e.response.data.message);
    }
}
