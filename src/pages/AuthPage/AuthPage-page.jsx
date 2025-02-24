import React, { useState } from 'react';
import LoginComponent from '../../components/Auth/LoginComponent-component';
import RegistrationComponent from '../../components/Auth/RegistrationComponent-component';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div>
            <button onClick={() => setIsLogin(true)}>Login</button>
            <button onClick={() => setIsLogin(false)}>Register</button>
            {isLogin ? <LoginComponent /> : <RegistrationComponent />}
        </div>
    );
};

export default AuthPage;
