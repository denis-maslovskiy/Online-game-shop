import { SET_ALL_GAME_AUTHORS, UPDATE_GAME_AUTHOR_ARRAY, DELETE_GAME_AUTHOR, SET_SELECTED_GAME_AUTHOR_DATA } from "./gameAuthorTypes";

const initialState = {
  allGameAuthors: [],
  selectedGameAuthor: {}
};

const updateGameAuthorArray = (action, state) => {
  const updatedGameAuthor = action.payload;
  state.allGameAuthors.map((gameAuthor, index) => {
    if (gameAuthor._id === updatedGameAuthor._id) {
      state.allGameAuthors[index] = updatedGameAuthor;
    }
    return gameAuthor;
  });
  return state;
};

const updateGameArrayAfterDeletingTheGameAuthor = (action, state) => {
  state.allGameAuthors.map((author, index) => {
    if (author._id === action.payload) {
      state.allGameAuthors.splice(index, 1);
    }
    return author;
  });
  return state;
};

const gameAuthorReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ALL_GAME_AUTHORS:
      return {
        ...state,
        allGameAuthors: action.payload,
      };
    case UPDATE_GAME_AUTHOR_ARRAY:
      return updateGameAuthorArray(action, state);
    case DELETE_GAME_AUTHOR:
      return updateGameArrayAfterDeletingTheGameAuthor(action, state);
    case SET_SELECTED_GAME_AUTHOR_DATA:
      return {
        ...state,
        selectedGameAuthor: action.payload
      }
    default:
      return state;
  }
};

export default gameAuthorReducer;
