import { SET_ALL_GAMES } from './gamesTypes';
import { updateObject } from '../reducerHelpers';

const initialState = {
    allGames: []
}

const setAllGames = (action, state) => {
    const allGames = action.payload;
    updateObject(state, { allGames })
}

const gamesReducer = (state = initialState, action) => {
    switch(action.type) {
        case SET_ALL_GAMES: 
            return setAllGames(state, action)
        default:
            return state
    }
}

export default gamesReducer;