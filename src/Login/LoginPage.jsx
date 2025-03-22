import React, { useState } from 'react';
import LoginForm from './LoginForm.jsx';
import RegisterForm from './RegisterForm.jsx';
import HeaderComponent from '../components/Header-component.jsx';
import FooterComponent from '../components/Footer-component.jsx';
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
