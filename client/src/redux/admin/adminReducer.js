// TODO: убрать всё это
import { ADD_NEW_GAME } from './adminTypes';
import { updateObject } from "../reducerHelpers";

const newGameInitialState = {
    gameName: "",
    gameDescription: "",
    rating: 0,
    releaseDate: "",
    author: "",
    genre: "",
    numberOfPhysicalCopies: 0,
    price: 0,
    isPhysical: false,
    isDigital: false
}

const setNewGame = (state, action) => {
    const newGame = action.payload;

    return updateObject(state, {newGame});
}

const adminReducer = (state = newGameInitialState, action) => {
    switch(action.type) {
        case ADD_NEW_GAME:
            return setNewGame(state, action);

        default: 
            return state;
    }
}

export default adminReducer;