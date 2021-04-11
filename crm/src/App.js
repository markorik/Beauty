import './scss/App.scss';

import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import NavBar from './components/NavBar';
import HomePage from './pages/Home';
import MastersPage from './pages/Masters';
import OrdersPage from './pages/Orders';
import NotFoundPage from './pages/NotFound';
import LoginPage from './pages/Login';
import { AuthProvider } from './contexts/authContext';
import PrivateRoute from './components/PrivateRoute';

import 'primereact/resources/themes/saga-blue/theme.css';
// import 'primereact/resources/primereact.min.css';
import 'primereact/resources/primereact.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';


function App() {    
  return (
    <Router>
      <AuthProvider>
        <div className="container">
            <header>
              <h2>Мир красоты</h2>  
              <NavBar />
            </header>   
            
            <main>
              <Switch>
                <PrivateRoute exact path="/">
                  <HomePage />
                </PrivateRoute>

                <PrivateRoute path="/masters">
                  <MastersPage />
                </PrivateRoute>

                <PrivateRoute path="/orders">
                  <OrdersPage />
                </PrivateRoute>

                <Route path="/login">
                  <LoginPage />
                </Route>

                <Route path="*">
                  <NotFoundPage />
                </Route>
              </Switch>

            </main>
        </div>
    </AuthProvider>    
  </Router>
  );
}

export default App;