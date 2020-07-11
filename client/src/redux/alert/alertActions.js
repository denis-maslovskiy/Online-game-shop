import axios from 'axios';
import { AXIOS_SUCCESS_MESSAGE, AXIOS_ERROR_MESSAGE, AXIOS_POST_REQUEST, SET_CURRENT_USER } from './alertTypes';

export const successMessage = (successMsg) => {
    return {
        type: AXIOS_SUCCESS_MESSAGE,
        payload: successMsg
    }
}

export const errorMessage = (errorMsg) => {
    return {
        type: AXIOS_ERROR_MESSAGE,
        payload: errorMsg
    }
}

export const setCurrentUser = (decoded) => {
    return {
        type: SET_CURRENT_USER,
        payload: decoded
    }
}

export const registerUser = (userData) => {
    return async (dispatch) => {
        try {
            console.log(userData);
            const response = await axios.post("/api/auth/registration", {...userData});
            console.log(response.data.message);
            dispatch(successMessage(response.data.message))
            // history.push('/');
        } catch (e) {
            console.log('register: ',e.response.data.message);
            dispatch(errorMessage(e.response.data.message))
        }
        
    }
}

