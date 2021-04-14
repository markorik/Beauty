import './scss/App.scss';

import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import MastersPage from './pages/MastersPage';
import OrdersPage from './pages/OrdersPage';
import CustomersPage from './pages/CustomersPage';
import NotFoundPage from './pages/NotFoundPage';
import LoginPage from './pages/LoginPage';
import { AuthProvider } from './contexts/authContext';
import PrivateRoute from './components/PrivateRoute';

import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';


function App() {    
  return (
    <Router>
      <AuthProvider>
        <div className="container">
            <header>
              <h1>Мир красоты</h1>  
              <NavBar />
            </header>   
            
            <main>
              <Switch>
                <PrivateRoute exact path="/">
                  <HomePage />
                </PrivateRoute>

                <PrivateRoute exact path="/masters">
                  <MastersPage />
                </PrivateRoute>

                <PrivateRoute exact path="/orders">
                  <OrdersPage />
                </PrivateRoute>

                <PrivateRoute exact path="/customers">
                  <CustomersPage />
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