import axios from 'axios';
// import { GET_FULL_LIST_OF_GAMES } from './gamesTypes';

export const getAllGames = () => {
    return async (dispatch) => {
        try {
            const response = await axios.get('/api/games/getAllGames');
            return response.data;
        } catch (e) {
            console.log(e.response.data.message)
        }
    }
}

export const getGameInfo = (gameId) => {
    return async (dispatch) => {
        try {
            const response = await axios.get(`/api/games/${gameId}`)
            return response.data;
        } catch (e) {  
            console.log(e.response.data.message);
        }
    }
}