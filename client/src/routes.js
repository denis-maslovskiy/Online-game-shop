import React from 'react';
import { Switch, Route} from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { Registration } from './pages/Registration';

export const useRoutes = () => {

    return (
        <Switch>

            <Route path='/' exact>
                <HomePage/>
            </Route>

            <Route path='/registration' exact>
                <Registration/>
            </Route>

        </Switch>
    )
}