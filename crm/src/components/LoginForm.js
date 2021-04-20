import React from 'react';
import { Redirect } from 'react-router-dom';

import classNames from 'classnames';

import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';

import { useAuth } from '../contexts/authContext';

export default function AuthForm({ onLogin }) {
    const [userName, setUserName] = React.useState("");
    const [password, setPassword] = React.useState("");

    const [errorMessage, setErrorMessage] = React.useState(null);
    const [loading, setLoading] = React.useState(false);

    const { isAuth } = useAuth();

    function onLoginFailed(message) {
        setErrorMessage((message || 'Unknown error!'));
        setLoading(false);
    }

    function handleSubmit(event) {
        event.preventDefault();
        if (!loading) {
            setErrorMessage(null);
            setLoading(true);
            onLogin({ userName, password }, onLoginFailed);
        }
    }

    return isAuth 
        ? <Redirect to="/" />
        : (<div className="p-d-flex p-jc-center" >
            <div className="card">
                <h1>Вход в систему</h1>
                <form onSubmit={handleSubmit} className="p-fluid">
                    <div className="p-field p-my-5">
                        <span className="p-float-label">
                            <InputText id="name" name="userName"
                                value={userName} onChange={e => setUserName(e.target.value)}
                                autoFocus required disabled={loading}
                                className={classNames({ 'p-invalid': errorMessage })}
                            />
                            <label htmlFor="userName">Имя пользователя *</label>
                        </span>
                    </div>
                    <div className="p-field p-my-5">
                        <span className="p-float-label">
                            <Password id="password" name="password"
                                value={password} onChange={e => setPassword(e.target.value)}
                                toggleMask feedback={false} required disabled={loading}
                                className={classNames({ 'p-invalid': errorMessage })}
                            />
                            <label htmlFor="password">Пароль *</label>
                        </span>
                    </div>
                    <div>
                        {errorMessage && <span>{errorMessage}</span>}
                        <Button type="submit" label="Войти" className="p-mt-2" disabled={userName === '' || password === '' || loading} />
                    </div>
                </form>
            </div>
        </div>);
}