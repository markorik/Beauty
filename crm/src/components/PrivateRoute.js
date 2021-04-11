  
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';

export default function PrivateRoute({ children, ...rest }) {
    const { isAuth } = useAuth();
    const render = isAuth ? children : <Redirect to="/login" />;
    return <Route {...rest} render={() => render} />;
}