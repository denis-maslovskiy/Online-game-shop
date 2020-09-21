import { SET_ALL_GAMES, SET_GAME_DATA } from './gamesTypes';
import { updateObject } from '../reducerHelpers';

const initialState = {
    allGames: [],
    game: {}
}

const setAllGames = (action, state) => {
    const allGames = action.payload;
    updateObject(state, { allGames })
}

// need to remove 
const setGameData = (action, state) => {
    const game = action.payload;
    updateObject(state, { ...game })
}

const gamesReducer = (state = initialState, action) => {
    switch(action.type) {
        case SET_ALL_GAMES: 
            return {
                ...state,
                allGames: action.payload
            }
        case SET_GAME_DATA: 
            return setGameData(action, state)     
        default:
            return state
    }
}

export default gamesReducer;