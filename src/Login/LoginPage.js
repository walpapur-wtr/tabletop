import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import HeaderComponent from '../components/Header-component';
import FooterComponent from '../components/Footer-component';
import DiceRollerButton from "../components/DiceRollerButton.jsx";
import "./Login.css";

const LoginPage = () => {
  const [isRegistering, setIsRegistering] = useState(false);

  const toggleForm = () => {
    setIsRegistering((prev) => !prev);
  };

  return (
    <div className="login-container">
      <HeaderComponent className="header" />
      {isRegistering ? (
        <RegisterForm toggleForm={toggleForm} />
      ) : (
        <LoginForm toggleForm={toggleForm} />
      )}
      <DiceRollerButton />
      <FooterComponent className="footer" />
    </div>
  );
};

export default LoginPage;
