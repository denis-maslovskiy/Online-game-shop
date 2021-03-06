import {
  SET_ALL_GAMES,
  UPDATE_GAME_ARRAY,
  DELETE_GAME,
  GAME_FILTER,
  GAME_SORT,
} from "./gamesTypes";

const initialState = {
  allGames: [],
  filteredGames: [],
  game: {},
};

const updateGameArray = (action, state) => {
  const updatedGame = action.payload;
  state.allGames.map((game, index) => {
    if (game._id === updatedGame._id) {
      state.allGames[index] = updatedGame;
    }
    return game;
  });
  return state;
};

const updateGameArrayAfterDeletingTheGame = (action, state) => {
  state.allGames.map((game, index) => {
    if (game._id === action.payload) {
      state.allGames.splice(index, 1);
    }
    return game;
  });
  return state;
};

const gamesReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ALL_GAMES:
      return {
        ...state,
        allGames: action.payload,
      };
    case UPDATE_GAME_ARRAY:
      return updateGameArray(action, state);
    case DELETE_GAME:
      return updateGameArrayAfterDeletingTheGame(action, state);
    case GAME_FILTER:
      return {
        ...state,
        filteredGames: action.payload,
      };
    case GAME_SORT:
      return {
        ...state,
        allGames: action.payload
      };
    default:
      return state;
  }
};

export default gamesReducer;
