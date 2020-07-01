import React from 'react';
import { Switch, Route} from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { Registration } from './pages/Registration';
import { SelectedGame } from './pages/SelectedGame';

export const useRoutes = () => {

    return (
        <Switch>

            <Route path='/' exact>
                <HomePage/>
            </Route>

            <Route path='/registration' exact>
                <Registration/>
            </Route>

            <Route path='/selectedgame' exact>
                <SelectedGame/>
            </Route>

        </Switch>
    )
}