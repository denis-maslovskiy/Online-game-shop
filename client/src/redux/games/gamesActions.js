import axios from "axios";
import { SET_ALL_GAMES, UPDATE_GAME_ARRAY, DELETE_GAME, GAME_FILTER, GAME_SORT } from "./gamesTypes";
import { successMessage, errorMessage, infoMessage, clearSuccessMessage } from "../notification/notificationActions";
import { updateGameAuthorArray } from "../gameAuthor/gameAuthorActions";

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

export const addGame = (newGame, selectedFiles, userId) => {
  return async (dispatch) => {
    try {
      const {
        data: { message, game },
      } = await axios.post("/api/admin/create-game", { ...newGame, userId });
      dispatch(successMessage(message));

      // Checking the existence of the author
      let isAuthorAlreadyExist = false;
      const { data } = await axios.get("/api/game-author/get-all-game-authors");
      data.forEach(async (author) => {
        if (author.authorName === newGame.author) {
          isAuthorAlreadyExist = true;
          author.authorsGames.push(newGame);
          await axios.put(`/api/admin/edit-game-author-info/${author._id}`, { ...author, userId });
          dispatch(updateGameAuthorArray(author));
        }
      });

      if (!isAuthorAlreadyExist) {
        const newAuthor = {
          authorName: newGame.author,
          authorsGames: [newGame],
        };
        await axios.post("/api/admin/create-game-author", { ...newAuthor, userId });
      }

      // Image upload
      selectedFiles.forEach((file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = async () => {
          const fileStr = reader.result;
          const {
            data: { uploadResponse },
          } = await axios.post("/api/admin/upload-image", { fileStr, userId });
          game.imgSource.push(uploadResponse.public_id);
          await axios.put(`/api/admin/${game.id}`, { ...game, userId });
        };
      });
    } catch (e) {
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

export const adminUpdateGameData = (gameId, game, userId) => {
  return async (dispatch) => {
    try {
      const {
        data: { message },
      } = await axios.put(`/api/admin/${gameId}`, { ...game, userId });

      const { data } = await axios.get("/api/game-author/get-all-game-authors");
      let gameAuthor = null;

      data.forEach((author) => {
        if (author.authorName === game.author) {
          gameAuthor = author;
        }
      });

      gameAuthor.authorsGames.forEach((authorGame) => {
        if (authorGame.gameName === game.gameName) {
          authorGame.imgSource = game.imgSource;
        }
      });
      await axios.put(`/api/admin/edit-game-author-info/${gameAuthor._id}`, { ...gameAuthor, userId });

      dispatch(updateGameArray(game));
      dispatch(successMessage(message));
    } catch (e) {
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
      dispatch(errorMessage(e.response.data.message));
    }
  };
};

export const adminUploadGameImagesWhenEditingGame = (selectedFiles, gameId, userId) => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get(`/api/games/${gameId}`);
      const response = await axios.get("/api/game-author/get-all-game-authors");
      let gameAuthor = null;

      response.data.forEach((author) => {
        if (author.authorName === data.author) {
          gameAuthor = author;
        }
      });

      selectedFiles.forEach((file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = async () => {
          const fileStr = reader.result;
          const {
            data: { uploadResponse },
          } = await axios.post("/api/admin/upload-image", { fileStr, userId });
          data.imgSource.push(uploadResponse.public_id);
          await axios.put(`/api/admin/${gameId}`, { ...data, userId });
          gameAuthor.authorsGames.forEach((game) => {
            if (game.gameName === data.gameName) {
              game.imgSource = data.imgSource;
            }
          });
          await axios.put(`/api/admin/edit-game-author-info/${gameAuthor._id}`, { ...gameAuthor, userId });
          dispatch(clearSuccessMessage());
          dispatch(successMessage(`Image "${file.name}" uploaded successfully`));
        };
      });
    } catch (e) {
      console.log(e);
    }
  };
};
