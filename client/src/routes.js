import React from 'react';
import { Switch, Route} from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { Registration } from './pages/Registration';
import { Authorization } from './pages/Authorization';

export const useRoutes = () => {

    return (
        <Switch>

            <Route path='/' exact>
                <HomePage/>
            </Route>

            <Route path='/registration' exact>
                <Registration/>
            </Route>

            <Route path='/authorization' exact>
                <Authorization/>
            </Route>


        </Switch>
    )
}