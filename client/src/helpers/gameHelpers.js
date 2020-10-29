import axios from "axios";

export const getGameInfo = async (gameId) => {
  try {
    const response = await axios.get(`/api/games/${gameId}`);
    return response.data;
  } catch (e) {
    console.log(e.response.data.message);
  }
};

export const addGame = async (newGame) => {
  try {
    await axios.post("/api/games/createOrUpdateGame", { ...newGame });
    console.log('game created successfully');
  } catch (e) {
    console.log(e);
  }
};