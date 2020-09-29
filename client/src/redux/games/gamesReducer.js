import { SET_ALL_GAMES, SET_GAME_DATA, UPDATE_GAME_ARRAY } from './gamesTypes';
import { updateObject } from '../reducerHelpers';

const initialState = {
    allGames: [],
    game: {}
}

// const setAllGames = (action, state) => { //? am i need this? 
//     const allGames = action.payload;
//     updateObject(state, { allGames })
// }

// need to remove / 26.09 - but its used //? should i really remove this? Need to check it
const setGameData = (action, state) => {
    const game = action.payload;
    updateObject(state, { ...game })
}

const updateGameArray = (action, state) => {
    const game = action.payload;
    console.log('game: ', game);
    // в массиве найти эту игру по id и заменить на новую
    // updateObject(state, { ...game })
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
        case UPDATE_GAME_ARRAY:
            return updateGameArray(action, state)
        default:
            return state
    }
}

export default gamesReducer;