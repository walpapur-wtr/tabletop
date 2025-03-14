import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import HeaderComponent from '../components/Header-component';
import FooterComponent from '../components/Footer-component';
import "./Login.css";

const LoginPage = () => {
  const [isRegistering, setIsRegistering] = useState(false);

  const toggleForm = () => {
    setIsRegistering((prev) => !prev);
  };

  return (
    <div className="login-container">
      <HeaderComponent />
      {isRegistering ? (
        <RegisterForm toggleForm={toggleForm} />
      ) : (
        <LoginForm toggleForm={toggleForm} />
      )}
       <FooterComponent />
    </div>
  );
};

export default LoginPage;
