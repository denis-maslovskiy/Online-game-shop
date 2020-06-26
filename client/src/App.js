import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useRoutes } from './routes';
import { Navbar } from './components/Navbar';

function App() {

  const routes = useRoutes();

  return (

    <BrowserRouter>

      <Navbar/>

      <div>
        { routes }
      </div>

    </BrowserRouter>
    
  );
}

export default App;
