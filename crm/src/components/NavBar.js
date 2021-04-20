import { withRouter } from 'react-router-dom';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button'; 

import { useAuth } from '../contexts/authContext';

const ROUTES = [
    {to: '/',           title: 'Главная'       },
    {to: '/orders',     title: 'Заявки'     },
    {to: '/masters',      title: 'Мастера'      },
    {to: '/customers',      title: 'Клиенты'      },
];

function NavBar({ location, history }) {
  const { isAuth, logout } = useAuth();

  return isAuth ? (
    <nav>
        <div className="p-d-flex p-ai-center">
            <Dropdown
                className="p-m-1"
                optionLabel="title"
                optionValue="to"
                value={location.pathname}
                options={ROUTES}
                onChange={(e) => history.push(e.target.value)}                    
            />
            <Button
                icon="pi pi-home"
                className="p-m-1"
                tooltip="Главная"
                onClick={(e) => history.push("/")}
            />
            <Button
                icon="pi pi-power-off"
                className="p-m-1 p-button-danger"
                tooltip="Выйти"
                onClick={logout}
            />
        </div>  
        <br />     
    </nav>
  ) : null;
}

export default withRouter(NavBar);