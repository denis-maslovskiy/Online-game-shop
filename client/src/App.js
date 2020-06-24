import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useRoutes } from './routes';

function App() {

  const routes = useRoutes();

  return (

    <BrowserRouter>

      <div>
        { routes }
      </div>

    </BrowserRouter>
    
  );
}

export default App;
