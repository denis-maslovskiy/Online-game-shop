import { AXIOS_SUCCESS_MESSAGE, AXIOS_ERROR_MESSAGE } from './alertTypes';

const initialState = {
    errorMsg: '',
    successMsg: '',
}

const alertReducer = (state = initialState, action) => {
    switch(action.type) {
        case AXIOS_ERROR_MESSAGE: return {
            ...state,
            errorMsg: action.payload
        }

        case AXIOS_SUCCESS_MESSAGE: return {
            ...state,
            successMsg: action.payload
        }

        default: return state
    }
}

export default alertReducer