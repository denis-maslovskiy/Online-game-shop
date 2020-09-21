import axios from 'axios';

export const addGame = (newGame) => {
    return async () => {
        try {
            await axios.post('/api/games/createOrUpdateGame', {...newGame});     
        } catch (e) {
            console.log(e);
        }
    }
}