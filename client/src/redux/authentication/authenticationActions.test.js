const axios = require('axios');
import {registerUser} from './authenticationActions';

jest.mock('axios');

describe('Async tests: ', () => {
    const userData = {
        username: 'Dube',
        email: 'd@mail.ru',
        password: '123456'
    }

    test('should return data from server ', () => {
        axios.post.mockReturnValue(userData)

        return registerUser().then(data => {
            expect(data).toBeDefined()
        })
    })
})