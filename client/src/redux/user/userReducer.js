import {  SET_ALL_USERS } from './userTypes';

const initialState = {
    allUsers: []
}

const userReducer = (state = initialState, action) => {
    switch(action.type) {
        case SET_ALL_USERS:
            return {
                ...state,
                allUsers: action.payload
            }
        default:
            return state;
    }
}

export default userReducer;